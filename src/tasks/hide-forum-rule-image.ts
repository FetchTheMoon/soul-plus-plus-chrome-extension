import { getItem } from '@/utilities/storage';
import { Selector } from '@/utilities/forum';
import $ from 'jquery';
import { extract } from '@/utilities/misc';

let hideForumRuleImage: boolean | undefined;

export default async function TASK_HideForumRuleImage(item: HTMLElement) {

    if (!document.URL.includes('/thread.php') && !document.URL.includes('/thread_new.php')) return;

    hideForumRuleImage = hideForumRuleImage ?? await getItem('Switch::hide-forum-rule-image');
    if (!hideForumRuleImage) return;
    if (!item.closest(Selector.RULE)) return;
    const fid = Number(extract(document.URL, /fid-(\d+)/));
    const whiteList = [
        9,      // 茶馆 - 以和为贵, 以礼待人
        135,    // GALGAME汉化区 - 虚拟抱抱
    ];
    // console.info(`开始隐藏版块大图`);
    if (!whiteList.includes(fid)) {
        $(Selector.RULE_IMAGE_MEDIUM).removeAttr('src');
    }

    $(Selector.RULE_IMAGE_BIG).removeAttr('src');
}