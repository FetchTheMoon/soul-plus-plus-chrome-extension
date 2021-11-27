import { getItem } from '@/utilities/storage';
import $ from 'jquery';
import { Selector } from '@/utilities/forum';
import { getDocument, post } from '@/utilities/requests';
import { addStyle, extract } from '@/utilities/misc';
import { Progress } from 'rsup-progress';
import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import TASK_LinkToReplied from '@/tasks/link-to-replied';
import TASK_BaiduNetDiskAvailableTest from '@/tasks/baidunetdisk-available-test';


export default async function TASK_ReplyRefreshFree() {
    if (!document.URL.includes('/read.php')) return;
    if (!await getItem('Switch::reply-refresh-free')) return;

    addStyle(`.spp-progress-bar{ position:absolute !important; top:0 !important, left:0 !important }`, 'spp-progress-bar');
    // 去掉textarea的按键事件
    const $textArea1 = $(Selector.REPLY_TEXTAREA);
    const $textArea2 = $(`<textarea id="spp-reply-textarea" name="atc_content" rows="8"   style="width:96%"></textarea>`);
    $textArea1.replaceWith($textArea2);

    // 去掉`提交`按钮的submit事件
    const $submitButton1 = $(Selector.SUBMIT_BUTTON);
    const $submitButton2 = $(`<input id="spp-submit-button" class="btn" type="button" name="Submit" value=" 提 交 ">`);
    $textArea2.closest('.t5').css('position', 'relative');

    $submitButton1.replaceWith($submitButton2);
    const progress = new Progress({
        height: '4px',
        color: '#2995ff',
        container: $textArea2.closest('.t5')[0],
        className: 'spp-progress-bar',

    });

    const replyPost = async () => {
        progress.start();
        // 组装post用的参数
        const formData: any = {};
        $(Selector.REPLY_FORM_DATA).each((i, e) => {
            const ele = (<HTMLInputElement>e);
            if (!ele.name) return;
            if (ele.disabled) return;
            if (ele.type === 'checkbox' && !ele.checked) return;
            formData[ele.name] = ele.value;
        });
        formData['atc_content'] = $textArea2.val();
        // 发送post以及拿到新页面自己的最后一个回帖, 并且将它追加到当前页面回帖列表的最下面
        const response = await post('/post.php', formData);
        const lastPage = await getDocument(`/read.php?tid=${ formData['tid'] }&page=e&#a`, 3,
            [
                TASK_HidePostImage,
                TASK_ReplaceUserAvatar,
                TASK_LinkToReplied,
                TASK_BaiduNetDiskAvailableTest,
            ],
        );
        const uid = extract($(Selector.UID).html(), /u\.php\?action-show-uid-(\d+)\.html/);
        const $yourReply = $(lastPage)
            .find(`.t5.t2 a[href="u.php?action-show-uid-${ uid }.html`)
            .last()
            .closest(Selector.POST_CONTAINER);

        $(Selector.POST_CONTAINER).last().after($yourReply);
        $yourReply[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        progress.end();
        // 回复后清空文本
        $textArea2.val("");
    };

    // 模拟原网页的"按键"提交回帖
    $textArea2.on('keydown', e => {
        if ((e.ctrlKey && e.key === 'Enter') || (e.altKey && e.key === 's')) {
            replyPost();
        }
    });

    // 模拟原网页的"按钮"提交回帖
    $submitButton2.on('click', e => {
        replyPost();
    });


}