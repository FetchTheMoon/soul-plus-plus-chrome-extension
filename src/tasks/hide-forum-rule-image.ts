import { getItem } from '@/utilities/storage';
import { Selector } from '@/utilities/forum';
import $ from 'jquery';
import { addStyle, extract } from '@/utilities/misc';
import CSS from '@/css/hide-forum-rule-image.css';


let hideForumRuleImage: boolean | undefined;
export default async function TASK_HideForumRuleImage(item: HTMLElement) {
    if (!document.URL.includes('/thread.php') && !document.URL.includes('/thread_new.php')) return;
    hideForumRuleImage = hideForumRuleImage ?? await getItem('Switch::hide-forum-rule-image');
    if (!hideForumRuleImage) return;
    if (!item.closest(Selector.RULE)) return;
    if ($('#spp-hide-forum-rule-image-button').length) return;

    addStyle(CSS, 'hide-forum-rule-image');

    const fid = Number(extract(document.URL, /fid-(\d+)/));
    const whiteList = [
        9,      // 茶馆 - 以和为贵, 以礼待人
        135,    // GALGAME汉化区 - 虚拟抱抱
    ];
    // console.info(`开始隐藏版块大图`);
    const $mediumImg = whiteList.includes(fid) ? undefined : $(Selector.RULE_IMAGE_MEDIUM);
    const $bigImg = $(Selector.RULE_IMAGE_BIG);
    $mediumImg?.addClass('spp-hide');
    $bigImg?.addClass('spp-hide');

    const $switchButton = $(`<button id="spp-hide-forum-rule-image-button">查看版块大图</button>`);
    $('#cate_thread')?.before($switchButton);

    $switchButton.on('click', (e) => {
        $mediumImg?.toggleClass('spp-hide');
        $bigImg?.toggleClass('spp-hide');
    });

}