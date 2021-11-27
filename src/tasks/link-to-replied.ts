import { getItem } from '@/utilities/storage';
import $ from 'jquery';
import { getThreadInfo, Selector } from '@/utilities/forum';
import { extract } from '@/utilities/misc';

let linkToReplied: boolean | undefined;

export default async function TASK_LinkToReplied(item: HTMLElement | Document = document) {
    if (!document.URL.includes('/read.php')) return;

    linkToReplied = linkToReplied ?? await getItem('Switch::link-to-replied');
    if (!linkToReplied) return;
    if (item instanceof HTMLElement) {
        if (item.title === '复制此楼地址') {
            item.insertAdjacentHTML('beforebegin', `<a name="SPP-${ item.innerText }" id="SPP-${ item.innerText }"></a>`);
        }
    }
    if (item instanceof Document) {
        const $item = $(item);
        if (window.location.hash.includes('#SPP-')) {
            const ele = $(window.location.hash);
            if (ele) ele[0].scrollIntoView();
        }

        $item.find(Selector.QUOTE).each((i, e) => {
            const threadInfo = getThreadInfo(e);
            const floor = Number(extract(e.firstChild!.textContent, /引用第(\d+)楼/));
            const page = Math.ceil(floor / 31);
            const text = e.firstChild!.textContent!.replace(
                /引用(第\d+楼)(.+)/,
                `引用<a style="color: dodgerblue" href="/read.php?tid=${ threadInfo.tid }&page=${ page }#SPP-B${ floor }F">$1</a>$2`,
            );
            $(e).contents().first().replaceWith(text);
        });
        $item.find(Selector.REPLY).each((i, e) => {
            const threadInfo = getThreadInfo(e);
            const floor = Number(extract(e.firstChild!.textContent, /回 (\d+)楼/));
            const page = Math.ceil(floor / 31);
            const text = e.firstChild!.textContent!.replace(
                /回 (\d+)楼(.+)/,
                `回 <a style="color: dodgerblue" href="/read.php?tid=${ threadInfo.tid }&page=${ page }#SPP-B${ floor }F">$1楼</a>$2`,
            );
            $(e).contents().first().replaceWith(text);
        });


    }
}
