import MarkListManager, { MarkedThreadInfo, OFFER_STAGE } from '@/utilities/mark-list';
import { getDocument } from '@/utilities/requests';
import { getThreadInfo, Selector } from '@/utilities/forum';
import { extract, extractAll, sleep } from '@/utilities/misc';
import { getItem } from '@/utilities/storage';
import $ from 'jquery';

export default function TASK_CheckMarkList() {
    setTimeout(markChecker);
}

async function markChecker() {
    try {

        const domain = await getItem('GlobalData::domain');
        const markList: MarkedThreadInfo[] = Object.values(await MarkListManager.getMarkList());

        console.log('markList:', markList);

        // 筛选出没有检查到最后一页的
        let checkQueue = markList.filter(e => e['maxPage'] - e['lastCheckPage'] > 0);

        // 如果都到最后一页了, 就以lastCheckTime升序排序
        if (!checkQueue.length) {
            checkQueue = markList.sort(
                (first, second) => {
                    return first['lastCheckTime'] - second['lastCheckTime'];
                },
            );
        }

        console.log('checkQueue:', checkQueue);
        if (!checkQueue.length) return;
        const checking = checkQueue[0];
        console.log(`开始检查:${ `https://${ domain }/read.php?tid=${ checking.tid }&page=${ checking.lastCheckPage + 1 }` }`);
        const doc = await getDocument(`https://${ domain }/read.php?tid=${ checking.tid }&page=${ checking.lastCheckPage + 1 }`, 2);
        const t_info = getThreadInfo(undefined, doc);
        if (!t_info) {
            console.error(checking, '无法获取主题信息');
            return;
        }

        const allPosts = [...doc.querySelectorAll(Selector.POST_CONTAINER)];
        const setOfferStage = (doc: Document) => {
            const ele = doc.querySelector(Selector.OFFER_STAGE);
            if (!ele) {
                checking.offerStage = OFFER_STAGE.UNKNOWN;
                return;
            }
            const stage = ele.textContent;
            if (!stage) return;
            console.log(`悬赏状态:${ stage }`);
            if (stage.includes('剩余时间:已结束')) {
                checking.offerStage = OFFER_STAGE.EXPIRED;
            } else if (stage.includes('悬赏结束')) {
                checking.offerStage = OFFER_STAGE.FINISHED;
            } else if (stage.includes('悬赏中')) {
                checking.offerStage = OFFER_STAGE.OFFERING;
                checking.offerRemainingHours = Number(extract(stage, /(\d+)小时/));
            }
        };
        // 正在检查第一页就顺便获取一下悬赏状态
        if (checking.lastCheckPage === 0) setOfferStage(doc);
        // 如果已经检查到最后一页了, 就等个5秒, 再去第1页获取一下悬赏状态
        if (checking.lastCheckPage === checking.maxPage) {
            await sleep(5000);
            const doc = await getDocument(`https://${ domain }/read.php?tid=${ checking.tid }&page=1`, 2);
            setOfferStage(doc);
        }


        allPosts.forEach(post => {
            const $post = $(post);
            const t = getThreadInfo(post, doc);
            if (t.pid === 'tpc') return; // 顶楼直接跳过

            if ($post.find(Selector.SELL).length
                && checking.sell.filter(s => s.pid === t.pid).length === 0) {
                checking.sell.push({
                    tid: t.tid,
                    page: t.currentPage,
                    pid: t.pid,
                });
            }
            if ($post.find(Selector.HYPER_LINK_IN_POST).length
                && checking.hyperlink.filter(s => s.pid === t.pid).length === 0) {
                checking.hyperlink.push({
                    tid: t.tid,
                    page: t.currentPage,
                    pid: t.pid,
                });
            }
            if (extractAll($post.find(Selector.POST_CONTENT).text(), /magnet:\?xt=urn:btih:[a-fA-F0-9]{30,}/g).length
                && checking.magnet.filter(s => s.pid === t.pid).length === 0) {
                checking.magnet.push({
                    tid: t.tid,
                    page: t.currentPage,
                    pid: t.pid,
                });
            }

            if (extractAll($post.find(Selector.POST_CONTENT).text(), /([\dA-Fa-f]{32})#(?:([\dA-Fa-f]{32})#)?([\d]{1,20})#([\s\S]+)/g).length
                && checking.miaochuan.filter(s => s.pid === t.pid).length === 0) {
                checking.miaochuan.push({
                    tid: t.tid,
                    page: t.currentPage,
                    pid: t.pid,
                });
            }


        });

        // 设置一下页数
        checking.maxPage = t_info.maxPage;
        checking.lastCheckPage = t_info.currentPage;
        checking.lastCheckTime = Date.now();

        console.log('本轮完成:', checking);

        // 更新帖子信息
        await MarkListManager.setThreadMarkInfo(checking);

    } catch (e) {
        console.error(e);
    } finally {
        setTimeout(markChecker, (await MarkListManager.isAllPageChecked() ? 10 : 5) * 1000);
    }


}

