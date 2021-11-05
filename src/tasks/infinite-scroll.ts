import { debounce } from '@/utilities/misc';
import $ from 'jquery';
import { getDocument } from '@/utilities/requests';
import { Selector } from '@/utilities/forum';
import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import TASK_BuyRefreshFree from '@/tasks/buy-refresh-free';
import TASK_CollapseAdforumResult from '@/tasks/collapse-adforum-result';

export default function InfiniteScroll(
    // URLTemplate: string,
    currentPage: number,
    maxPage: number,
    dividerHTML: string,
    pageEndSelector: string,
    dividerStage: {
        fetchingNextPage: (divider: JQuery, page: number) => void,
        nextPageReady: (divider: JQuery, page: number) => void,
        fetchFailed: (divider: JQuery, page: number) => void,
        nextPageLoaded: (divider: JQuery, page: number) => void,
    },
    nextPageContentSelector: Selector,
    // 图墙区的帖子有需要把src从data-original里拿出来这种情况, 所以有时需要对下一页的数据进行处理
    // 传进去的document是传址, 所做的修改直接作用于这个对象, 所以无需返回值
    nextPageCachePreProc?: (content: Document) => void,
) {
    let nextPageCache: Document | null;
    let isFetching = false;
    let divider: JQuery | null;
    const handleInfiniteScroll = debounce(async () => {
        // 如果没有正在获取下一页的内容, 也没有下一页的缓存, 则开始获取下一页的内容
        if (!isFetching && !nextPageCache) {
            // 没有下一页了啊, 告辞
            if (currentPage === maxPage) {
                $(window).off('scroll', handleInfiniteScroll);
                return;
            }
            // 追加分割线
            divider = $(dividerHTML);
            divider.insertAfter($(pageEndSelector).last());

            // 获取下一页的内容
            // const nextPageURL = URLTemplate.replace('{page}', `${currentPage + 1}`);
            // 帖子排序会导致伪静态链接变成了不同的格式, 这个时候URLTemplate就不适用了
            // 用页码上的链接可以兼容类似的情况
            const nextPageURL = $(Selector.CURRENT_PAGE_IN_PAGINATION).parent().next().children().first().attr('href');
            if (!nextPageURL) return;
            console.log(`开始读取:${ nextPageURL }`);
            dividerStage.fetchingNextPage(divider, currentPage);
            try {
                isFetching = true;
                nextPageCache = await getDocument(nextPageURL, 2, [
                    TASK_HidePostImage,
                    TASK_ReplaceUserAvatar,
                    TASK_BuyRefreshFree,
                    TASK_CollapseAdforumResult,
                ]);
                dividerStage.nextPageReady(divider, currentPage);
            } catch (e) {
                console.error(e);
                dividerStage.fetchFailed(divider, currentPage);
            } finally {
                isFetching = false;
            }
        }
        // 当滚动到底部时, 如果已经停止请求下一页了, 并且已经有下一页的缓存了
        // 就将下一页的楼层列表容器追加到分割线下面
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
            && divider && nextPageCache && !isFetching) {
            dividerStage.nextPageLoaded(divider, currentPage);

            if (nextPageCachePreProc) nextPageCachePreProc(nextPageCache);
            $(nextPageCache).find(nextPageContentSelector).insertAfter(divider);


            // 更新上下方的翻页组件
            const pagesOld = $(Selector.PAGINATION);
            const pagesNew = $(nextPageCache).find(Selector.PAGINATION);
            for (let i = 0; i < pagesOld.length; i++) {
                pagesOld[i].replaceWith(pagesNew[i]);
            }

            nextPageCache = null;
            currentPage++;
            divider = null;
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

}

