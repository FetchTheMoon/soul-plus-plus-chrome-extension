import MutationObserverProcess from '@/utilities/mutation-observer';
import TASK_DarkMode from '@/tasks/dark-mode';
import TASK_BuyRefreshFree from '@/tasks/buy-refresh-free';
import TASK_DomainRedirect from '@/tasks/domain-redirect';
import { getItem, setItem } from '@/utilities/storage';
import TASK_InfiniteScrollPost from '@/tasks/infinite-scroll-post';
import TASK_InfiniteScrollThread from '@/tasks/infinite-scroll-thread';
import TASK_InfiniteScrollSearchResult from '@/tasks/infinite-scroll-search';
import TASK_InfiniteScrollPicWall from '@/tasks/infinite-scroll-pic-wall';
import TASK_CollapseAdforumResult from '@/tasks/collapse-adforum-result';
import TASK_TaskBot from '@/tasks/task-bot';
import BackToTop from '@/components/float-button/back-to-top';
import MarkButton from '@/components/float-button/mark';


import TASK_LinkToReplied from '@/tasks/link-to-replied';
// 由于插件的弹出页面位于插件的路径下, 无法使用相对路径访问论坛页面, 所以记录一下
setItem('GlobalData::domain', window.location.hostname);

MutationObserverProcess();

if (await getItem('Switch::domain-redirect')) TASK_DomainRedirect();
if (await getItem('Switch::dark-mode')) TASK_DarkMode();

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded');
    if (await getItem('Switch::link-to-replied')) TASK_LinkToReplied(document);
    if (await getItem('Switch::buy-refresh-free')) TASK_BuyRefreshFree();
    if (await getItem('Switch::infinite-scroll-post')) TASK_InfiniteScrollPost();
    if (await getItem('Switch::infinite-scroll-thread')) TASK_InfiniteScrollThread();
    if (await getItem('Switch::infinite-scroll-search-result')) TASK_InfiniteScrollSearchResult();
    if (await getItem('Switch::infinite-scroll-pic-wall')) TASK_InfiniteScrollPicWall();
    if (await getItem('Switch::collapse-adforum-result')) TASK_CollapseAdforumResult();
    if (await getItem('Switch::task-bot')) TASK_TaskBot();
    if (await getItem('Switch::mark-checker')) MarkButton();
    BackToTop();
});

