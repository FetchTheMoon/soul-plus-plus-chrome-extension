import MutationObserverProcess from '@/utilities/mutation-observer';
import TASK_DarkMode from '@/tasks/dark-mode';
import TASK_BuyRefreshFree from '@/tasks/buy-refresh-free';
import TASK_DomainRedirect from '@/tasks/domain-redirect';
import { setItem } from '@/utilities/storage';
import TASK_InfiniteScrollPost from '@/tasks/infinite-scroll-post';
import TASK_InfiniteScrollThread from '@/tasks/infinite-scroll-thread';
import TASK_InfiniteScrollSearchResult from '@/tasks/infinite-scroll-search';
import TASK_InfiniteScrollPicWall from '@/tasks/infinite-scroll-pic-wall';
import TASK_CollapseAdforumResult from '@/tasks/collapse-adforum-result';
import TASK_TaskBot from '@/tasks/task-bot';
import BackToTop from '@/components/float-button/back-to-top';
import MarkButton from '@/components/float-button/mark';
import TASK_LinkToReplied from '@/tasks/link-to-replied';
import TASK_HighlightViewedThread from '@/tasks/highlight-viewed-thread';
import TASK_ReplyRefreshFree from '@/tasks/reply-refresh-free';
import TASK_BaiduNetDiskAvailableTest from '@/tasks/baidunetdisk-available-test';


// 由于插件的弹出页面位于插件的路径下, 无法使用相对路径访问论坛页面, 所以记录一下
setItem('GlobalData::domain', window.location.hostname);

MutationObserverProcess();

TASK_DomainRedirect();
TASK_DarkMode();

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded');
    TASK_LinkToReplied();
    TASK_BuyRefreshFree();
    TASK_ReplyRefreshFree();
    TASK_InfiniteScrollPost();
    TASK_InfiniteScrollThread();
    TASK_InfiniteScrollSearchResult();
    TASK_InfiniteScrollPicWall();
    TASK_CollapseAdforumResult();
    TASK_HighlightViewedThread();
    TASK_BaiduNetDiskAvailableTest();
    TASK_TaskBot();
    MarkButton();
    BackToTop();
});

