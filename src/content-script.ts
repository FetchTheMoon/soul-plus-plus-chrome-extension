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
import TASK_ReplyNotificationByDefault from '@/tasks/reply-notification-by-default';

import TASK_ForceDesktopVersion from '@/tasks/force-desktop-version';
import TASK_InfiniteScrollUsersThread from '@/tasks/infinite-scroll-users-thread';
import { TASK_AddPicwallDefaultCheckbox, TASK_PicwallDefaultRedirect } from '@/tasks/picwall-default';
import TASK_AddImgUpload from '@/tasks/add-img-upload';

// 由于插件的弹出页面位于插件的路径下, 无法使用相对路径访问论坛页面, 所以记录一下
setItem('GlobalData::domain', window.location.hostname);

MutationObserverProcess();

TASK_ForceDesktopVersion();
TASK_DomainRedirect();
TASK_DarkMode();
TASK_PicwallDefaultRedirect();

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded');
    BackToTop();
    MarkButton();
    TASK_AddPicwallDefaultCheckbox();
    TASK_TaskBot();
    TASK_LinkToReplied();
    TASK_BuyRefreshFree();
    TASK_BaiduNetDiskAvailableTest();
    TASK_CollapseAdforumResult();
    TASK_InfiniteScrollPost();
    TASK_InfiniteScrollThread();
    TASK_InfiniteScrollSearchResult();
    TASK_InfiniteScrollPicWall();
    TASK_InfiniteScrollUsersThread();
    TASK_HighlightViewedThread();
    TASK_ReplyRefreshFree();
    TASK_ReplyNotificationByDefault();
    TASK_AddImgUpload();
});

