import { getSearchInfo, Selector } from '@/utilities/forum';
import InfiniteScroll from '@/tasks/infinite-scroll';
import { getItem } from '@/utilities/storage';

export default async function TASK_InfiniteScrollSearchResult() {
    if (await getItem('Switch::infinite-scroll-search-result')) return;
    if (!document.URL.includes('/search.php?')) return;

    const ThreadDetail = getSearchInfo();
    if (!ThreadDetail) return;
    InfiniteScroll(
        // `/search.php?step-2-keyword-{keyword}-sid-{sid}-seekfid-all-page-{page}.html`,
        ThreadDetail.currentPage,
        ThreadDetail.maxPage,
        `<tr class="tr2"><td colspan="12" class="tac" style="border-top:0;font-weight: bold">...</td></tr>`,
        Selector.SEARCH_RESULT_THREAD,
        {
            fetchingNextPage: (divider, page) => divider.children(':only-child').text(`正在获取搜索结果的第${ page + 1 }页`),
            nextPageReady: (divider, page) => divider.children(':only-child').text(`继续向下滚动将在下方加载搜索结果的第${ page + 1 }页`),
            fetchFailed: (divider, page) => divider.children(':only-child').text(`获取搜索结果的第${ page + 1 }的失败了, 请检查你的网络或者刷新后重试`),
            nextPageLoaded: (divider, page) => divider.children(':only-child').text(`以下是搜索结果的第${ page + 1 }页`),
        },
        Selector.SEARCH_RESULT_THREAD,
    );
}