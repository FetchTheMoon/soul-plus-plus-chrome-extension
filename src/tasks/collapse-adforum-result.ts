import $ from 'jquery';
import { Selector } from '@/utilities/forum';
import CollapseAdforumResultCSS from '@/css/collapse-adforum-result.css';
import { addStyle } from '@/utilities/misc';

export default function TASK_CollapseAdforumResult(doc = document) {
    if (!document.URL.includes('/search.php?')) return;
    console.log('开始折叠网赚区结果');
    addStyle(CollapseAdforumResultCSS, 'collapse-adforum-result-css');
    const btnShowAdforumResultClass = 'spp-btn-show-adforum-result';
    const listTitle = $(Selector.SEARCH_RESULT_TITLE);
    // 无缝加载搜索结果页的时候, 如果doc===document, 则说明是搜索结果页, 初始给data-hide设置为真
    // 否则说明是fetch读取的页面, 就不要再重复设置了
    if (listTitle.data('hide') === undefined) listTitle.data('hide', true);
    $(doc).find('.tr3.tac').each((index, ele) => {
        const forum = $(ele).children()[2];
        if ($(forum).children().first().attr('href')?.match(/fid-17[1-4]/)) {
            $(ele).addClass(['spp-adforum-result', listTitle.data('hide') ? 'spp-hide' : '']);
        }
    });

    if ($(`#${ btnShowAdforumResultClass }`).length) return;
    const button = $(`<button id="${ btnShowAdforumResultClass }"> 点我<b>${ listTitle.data('hide') ? '展开' : '折叠' }</b>网赚区的主题 </button>`);
    button.on('click', () => {
        if (listTitle.data('hide')) {
            $(`.spp-adforum-result`).removeClass('spp-hide');
        } else {
            $(`.spp-adforum-result`).addClass('spp-hide');
        }
        listTitle.data('hide', !listTitle.data('hide'));
        button.children().first().text(listTitle.data('hide') ? '展开' : '折叠');
    });
    listTitle.append(button);
}