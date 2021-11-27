import { Selector } from '@/utilities/forum';
import InfiniteScroll from '@/tasks/infinite-scroll';
import { getItem } from '@/utilities/storage';

export default async function TASK_InfiniteScrollUsersThread() {
    if (!await getItem('Switch::infinite-scroll-users-thread')) return;
    if (!document.URL.includes('/u.php')) return;
    const m = document.documentElement.outerHTML.match(/<li class="pagesone">Pages: (\d+)\/(\d+)/);
    const [_, page, maxPage] = m ? m : [];
    InfiniteScroll(
        Number(page),
        Number(maxPage),
        `<tr class="tr2 spp-infinite-scroll-divider"><td colspan="12" class="tac" style="border-top:0;font-weight: bold">...</td></tr>`,
        Selector.USERS_THREAD,
        {
            fetchingNextPage: (divider, page) => divider.children(':only-child').text(`正在获取${ page + 1 }页的帖子`),
            nextPageReady: (divider, page) => divider.children(':only-child').text(`继续向下滚动将在下方加载第${ page + 1 }页的帖子`),
            fetchFailed: (divider, page) => divider.children(':only-child').text(`获取第${ page + 1 }的帖子失败了, 请检查你的网络或者刷新后重试`),
            nextPageLoaded: (divider, page) => divider.children(':only-child').text(`以下是第${ page + 1 }页的帖子`),
        },
    );
}