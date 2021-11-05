import { getThreadInfo, Selector } from '@/utilities/forum';
import InfiniteScroll from '@/tasks/infinite-scroll';

export default function TASK_InfiniteScrollPost() {
    if (!document.URL.includes('/read.php')) return;

    const postInfo = getThreadInfo();
    if (!postInfo) return;
    InfiniteScroll(
        // `/read.php?tid=${postDetail.tid}&page={page}`,
        postInfo.currentPage,
        postInfo.maxPage,
        `<div class="h2 spp-infinite-scroll-divider" style="text-align: center;font-weight: bold"> ... </div>`,
        Selector.ALL_POSTS_CONTAINER,
        {
            fetchingNextPage: (divider, page) => divider.text(`正在获取${ page + 1 }页的帖子`),
            nextPageReady: (divider, page) => divider.text(`继续向下滚动将在下方加载第${ page + 1 }页的帖子`),
            fetchFailed: (divider, page) => divider.text(`获取第${ page + 1 }的帖子失败了, 请检查你的网络或者刷新后重试`),
            nextPageLoaded: (divider, page) => divider.text(`以下是第${ page + 1 }页的帖子`),
        },
        Selector.ALL_POSTS_CONTAINER,
    );
}
