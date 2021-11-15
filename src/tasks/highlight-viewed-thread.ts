import ViewedThreadManager from '@/controls/viewd-thread';
import { getForumInfo, getThreadInfo, Selector } from '@/utilities/forum';
import $ from 'jquery';
import { addStyle, extract } from '@/utilities/misc';
import highLightViewedThreadCSS from '@/css/highlight-viewed-thread.css';
import { getItem } from '@/utilities/storage';

export default async function TASK_HighlightViewedThread(doc: Document = document) {
    if (!await getItem('Switch::highlight-viewed-thread')) return;
    addStyle(highLightViewedThreadCSS, 'highlight-viewed-thread');
    if (document.URL.includes('/read.php')) {
        const t = getThreadInfo();
        // 直接打开页面时不会触发visibilitychange事件
        // 如果此时页面处于可见状态的话说明用户正在查看这个页面, 而不是后台打开的
        if (!document.hidden) {
            ViewedThreadManager.addViewedThread(t.fid, t.tid);
            ViewedThreadManager.setLastViewedThread(t.tid);
        }


        // 当visibilitychange触发时，hidden代表用户关闭或者离开了当前页面
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                ViewedThreadManager.addViewedThread(t.fid, t.tid);
                ViewedThreadManager.setLastViewedThread(t.tid);
            }
        });
    }
    if (document.URL.includes('/thread.php')) {
        const f = getForumInfo();
        // 主动给阅读过的帖子换个颜色, 以及给上次阅读的帖子增加背景色

        const viewedThreads = await ViewedThreadManager.getViewedThreads(f.fid);
        const lastViewedThread = await ViewedThreadManager.getLastViewedThread();

        doc.querySelectorAll(Selector.THREAD_TITLE_LINK).forEach((e) => {
            const tid = Number(extract(e.id, /a_ajax_(\d+)/));
            if (viewedThreads.includes(tid)) $(e).addClass('spp-viewed-thread');
            if (tid === lastViewedThread) $(e).closest(Selector.THREAD).addClass('spp-last-viewed-thread');
        });

        // 说明是其它任务调用的, 处理完高亮就可以返回了
        if (doc !== document) return;

        // 主动滚动到上次浏览的帖子
        scrollToLastViewed();

        // 切换时滚动到上次浏览的帖子
        document.addEventListener('visibilitychange', () => scrollToLastViewed());

        // FunctionData::viewed-threads 和 FunctionData::viewed-threads 的值被改变后, 在主题列表做出相应的反应

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== 'local') return;
            // console.log(changes);
            const vt = changes['FunctionData::viewed-threads'];
            if (vt) {
                // newValue在当前fid下的最后一个成员必然是新增的帖子
                $(`a#a_ajax_${ vt.newValue[f.fid].slice(-1)[0] }`).addClass('spp-viewed-thread');
            }

            const lvt = changes['FunctionData::last-viewed-thread'];
            if (lvt) {

                // console.log(`#a_ajax_${ changes['FunctionData::last-viewed-thread'].oldValue }`);
                // console.log(`#a_ajax_${ changes['FunctionData::last-viewed-thread'].newValue }`);

                $(`#a_ajax_${ lvt.oldValue }`)
                    .closest(Selector.THREAD)
                    .removeClass('spp-last-viewed-thread');

                $(`#a_ajax_${ lvt.newValue }`)
                    .closest(Selector.THREAD)
                    .addClass('spp-last-viewed-thread');
            }
        });
    }


}


function scrollToLastViewed() {
    // 滚动到上次浏览的帖子
    history.scrollRestoration = 'manual';
    let ele = document.querySelector('.spp-last-viewed-thread');
    if (!ele) return;
    ele.scrollIntoView({ behavior: 'auto', block: 'center' });
}

