import { debounce } from '@/utilities/misc';
import $ from 'jquery';
import { getDocument } from '@/utilities/requests';
import { Selector } from '@/utilities/forum';
import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import TASK_BuyRefreshFree from '@/tasks/buy-refresh-free';
import TASK_CollapseAdforumResult from '@/tasks/collapse-adforum-result';
import TASK_HighlightViewedThread from '@/tasks/highlight-viewed-thread';
import TASK_LinkToReplied from '@/tasks/link-to-replied';
import TASK_BaiduNetDiskAvailableTest from '@/tasks/baidunetdisk-available-test';

export default function InfiniteScroll(
    // URLTemplate: string,
    currentPage: number,
    maxPage: number,
    dividerHTML: string,
    itemSelector: Selector,
    dividerStage: {
        fetchingNextPage: (divider: JQuery, page: number) => void,
        nextPageReady: (divider: JQuery, page: number) => void,
        fetchFailed: (divider: JQuery, page: number) => void,
        nextPageLoaded: (divider: JQuery, page: number) => void,
    },
    // 传进去的document是传址, 所做的修改直接作用于这个对象, 所以无需返回值
    nextPageCachePrep?: (doc: Document) => void,
    currentPagePrep?: (doc: Document) => void,
) {

    if (currentPagePrep) currentPagePrep(document);


    const $items = $(itemSelector);
    // 给container增加url属性是为了在倒退键和前进键时直接
    $items.parent().attr('url', document.URL);
    let nextPageCache: Document | null;
    let isFetching = false;
    let divider: JQuery | null;
    let nextPageURL: string | undefined | null;

    // intersectionUpdateURL($itemsContainer[0], document.URL);


    const handleInfiniteScroll = debounce(async () => {
        // 如果没有正在获取下一页的内容, 也没有下一页的缓存, 则开始获取下一页的内容
        if (!isFetching && !nextPageCache) {

            // 没有下一页了啊, 告辞
            if (currentPage === maxPage) {
                $(window).off('scroll', handleInfiniteScroll);
                return;
            }

            // 论坛的帖子排序功能会导致伪静态链接变成了不同的格式, 用页码上的链接可以兼容类似的情况
            nextPageURL = $(Selector.CURRENT_PAGE_IN_PAGINATION).parent().next().children().first().attr('href');
            if (!nextPageURL) return;

            // 追加分割线
            divider = $(dividerHTML);
            // 需要重新获取最下面的一个item
            const $lastContainer = $(itemSelector).last().parent();
            divider.insertAfter($lastContainer);

            console.log(`开始读取:${ nextPageURL }`);
            dividerStage.fetchingNextPage(divider, currentPage);
            try {
                isFetching = true;
                nextPageCache = await getDocument(nextPageURL, 2, [
                    TASK_HidePostImage,
                    TASK_ReplaceUserAvatar,
                    TASK_BuyRefreshFree,
                    TASK_CollapseAdforumResult,
                    TASK_HighlightViewedThread,
                    TASK_LinkToReplied,
                    TASK_BaiduNetDiskAvailableTest,
                ]);
                dividerStage.nextPageReady(divider, currentPage);
                if (nextPageCachePrep) nextPageCachePrep(nextPageCache);
                const $nextPageItems = $(nextPageCache).find(itemSelector);
                const $nextPageItemsContainer = $nextPageItems.last().parent();

                // 获取下一页的内容或容器失败了
                if (!$nextPageItems.length || !$nextPageItemsContainer.length) throw new Error('获取下一页的内容或容器失败了');
                $nextPageItemsContainer.attr('url', `${ document.location.protocol }//${ document.location.host }/${ nextPageURL }`);
                // intersectionUpdateURL($nextPageItemsContainer[0], nextPageURL);

            } catch (e) {
                console.error(e);
                dividerStage.fetchFailed(divider, currentPage);
                nextPageURL = null;
                nextPageCache = null;
                divider.remove();
            } finally {
                isFetching = false;
            }
        }
        // 当滚动到底部时, 如果已经停止请求下一页了, 并且已经有下一页的缓存了
        // 就将下一页的楼层列表容器追加到分割线下面
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
            && nextPageURL && divider && nextPageCache && !isFetching) {
            dividerStage.nextPageLoaded(divider, currentPage);

            const $nextPageItemsContainer = $(nextPageCache).find(itemSelector).parent();
            $nextPageItemsContainer.insertAfter(divider);
            // 新页面的地址加入历史记录
            console.log(`新页面的地址加入历史记录:${ $nextPageItemsContainer.attr('url') }`);

            const url: string = $nextPageItemsContainer.attr('url')!;
            // data参数这么填的原因：
            // https://stackoverflow.com/questions/5121666/when-the-back-button-triggers-popstate-how-can-i-prevent-a-page-refresh
            // 不这么填的话back button只有第一次有效
            window.history.pushState({ [url]: true }, '', url);


            // 更新上下方的翻页组件
            const pagesOld = $(Selector.PAGINATION);
            const pagesNew = $(nextPageCache).find(Selector.PAGINATION);
            for (let i = 0; i < pagesOld.length; i++) {
                pagesOld[i].replaceWith(pagesNew[i]);
            }

            nextPageCache = null;
            divider = null;
            nextPageURL = null;
            currentPage++;
        }
    }, 30);


    $(window).on('mousewheel keydown', (evt) => {
        if (
            (evt.originalEvent instanceof KeyboardEvent && (evt.originalEvent.key === 'PageDown' || evt.key === 'ArrowDown'))
            ||
            (evt.originalEvent instanceof WheelEvent && ((<WheelEvent>evt.originalEvent).deltaY > 0))
        ) {
            handleInfiniteScroll();
        }
    });

    window.addEventListener('popstate', (event) => {
        event.preventDefault();
        history.scrollRestoration = 'manual';
        const $target = $(`*[url="${ document.location.href }"]`);
        if (!$target.length) {
            document.location.reload();
            return;
        }

        // 有divider就滚动到divider，没有就滚动到父元素
        ($target.prev('.spp-infinite-scroll-divider')[0] ?? $target.parent()[0])
            .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });

    });


    // function intersectionUpdateURL(container: HTMLElement, url: string) {
    //     container.setAttribute('url', url);
    //     addIntersectionObserver(([entry]) => {
    //         if (entry.isIntersecting) {
    //             console.log('intersection:', entry.target.getAttribute('url'));
    //             window.history.replaceState({}, '', entry.target.getAttribute('url'));
    //         }
    //     }, container, { threshold: 0, rootMargin: '-49% 0px -49% 0px' });
    // }

}

