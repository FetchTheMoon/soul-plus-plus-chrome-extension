import $ from 'jquery';
import { addStyle, extract, sleep } from '@/utilities/misc';
import { Selector } from '@/utilities/forum';
import { getHTML } from '@/utilities/requests';
import { Notyf } from 'notyf';
import { getItem, setItem } from '@/utilities/storage';
import TimeAgo from '@/utilities/time-ago';
import NotyfCss from 'notyf/notyf.min.css';

const key = 'FunctionData::task-bot';

export default async function TASK_TaskBot() {
    const notyfInstance: Notyf = new Notyf();
    if ($(Selector.LOGIN_FORM).length) {
        console.log(`尚未登录，不接任务`);
        return;
    }

    addStyle(NotyfCss, 'notyf-css');
    // uid是用来记录任务时间时用的
    const uid = extract($(Selector.UID).html(), /u\.php\?action-show-uid-(\d+)\.html/);
    const uname = $(Selector.USERNAME).text();
    if (!uid || !uname) {
        console.log(`获取用户信息失败，不接任务`);
        return;
    }
    console.log(uid, uname);

    // 如果上次完成任务的时间距离现在超过一个小时, 就再来一次
    const lastTime = await getItem(key, {});
    console.log(lastTime);
    const uidLastTime = lastTime[uid] ?? 0;
    console.log(`${ uname }[${ uid }] 上次签到时间：${ TimeAgo(uidLastTime) }`);

    if (Date.now() - uidLastTime < (3600 * 1000)) {
        console.log('再等等……');
        return;
    }

    // 接收任务和完成任务的页面相差无几
    const run = async (url: string, jobType: string, selector: Selector) => {
        // 去任务页面获得所有的[申请任务/领取奖励]按钮
        const taskPageHTML = await getHTML(
            url,
            3,
        );
        const $tasks = $(taskPageHTML).find(selector);
        console.log(`发现${ $tasks.length }个按钮`);
        // 都点一遍
        for await (let task of $tasks) {
            const job = task.getAttribute('onclick');
            const jobID = extract(job, /startjob\('(\d+)'\);/);
            const verifyHash = extract(taskPageHTML, /var verifyhash = '([a-f0-9]+)';/);
            const taskURL = `/plugin.php?H_name=tasks&action=ajax&actions=${ jobType }&cid=${ jobID }&nowtime=${ Date.now() }&verify=${ verifyHash }`;
            console.log(taskURL);
            const resultHTML = await getHTML(taskURL, 3);
            console.log(resultHTML);
            if (resultHTML.includes('success\t')) notyfInstance.success(extract(resultHTML, /!\[CDATA\[success\t(.+)]]>/));
        }
    };

    for (let i = 0; i < 2; i++) {
        try {
            await run(
                '/plugin.php?H_name-tasks.html',
                'job',
                Selector.RECEIVE_TASK_BUTTON,
            );
            console.log('领取完毕, 等3秒');
            await sleep(3000);
            console.log('开始完成');
            await run(
                '/plugin.php?H_name-tasks-actions-newtasks.html.html',
                'job2',
                Selector.COMPLETE_TASK_BUTTON,
            );
            console.log('ALL DONE!');
        } catch (e) {
            console.log(e);
        }
    }

    // 记录本次任务执行时间
    lastTime[uid] = Date.now();
    setItem(key, lastTime);
}