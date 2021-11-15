import { getDocument, getHTML } from '@/utilities/requests';
import { Progress } from 'rsup-progress';
import { Notyf } from 'notyf';
import { addStyle, extract } from '@/utilities/misc';
import { getThreadInfo, Selector } from '@/utilities/forum';
import $ from 'jquery';
import NotyfCss from 'notyf/notyf.min.css';
import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import { getItem } from '@/utilities/storage';


let notyfInstance: Notyf;

export default async function TASK_BuyRefreshFree(doc: Document = document) {
    if (!await getItem('Switch::buy-refresh-free')) return;
    if (!document.URL.includes('/read.php')) return;
    // console.info(`开始处理购买按钮`);
    addStyle(NotyfCss, 'notyf-css');
    // 只需要一个Notyf实例, Notyf每次实例化都会创建HTML元素
    notyfInstance = notyfInstance ?? new Notyf();

    $(doc).find(Selector.BUY_BUTTON).each((index, button) => {
        const $button = $(button);
        // 获取GET购买地址
        const url = extract($button.attr('onclick'), /location\.href='(.+)'/);
        if (!url) return;
        // 避免点击按钮的时候跳转，删掉这个属性
        // $button.removeAttr('onclick');
        // 在Chrome Extension中移除onclick属性后点击按钮依然会跳转
        const $clone = $(`<input 
                            type="button" 
                            value="愿意购买,我买,我付钱" 
                            class="btn btn-danger spp-buy-refresh-free" 
                            style="line-height: 100%; background: linear-gradient(to top, rgb(189, 76, 76), rgb(251, 153, 4)) "/> 
                        `);
        $button.replaceWith($clone);
        $clone.css('background', 'linear-gradient(to top, #bd4c4c,#fb9904)');
        // progress bar
        const progress = new Progress({
            height: '4px',
            color: '#2995ff',
        });
        // 添加点击事件，fetch发送请求，拿到结果后直接替换到当前页面
        $clone.on('click', async e => {
            e.stopPropagation();
            e.preventDefault();
            // 购买时，按钮变成不可点击状态
            $clone.attr('value', '正在购买……请稍等………');
            $clone.prop('disabled', true);
            // 获取楼层ID(pid) 帖子ID(tid) 当前页数(currentPage)备用
            const postDetail = getThreadInfo($clone, doc);
            // 获取当前楼层的容器节点备用
            let postContainer = $clone.closest(Selector.POST_CONTAINER);
            // 购买失败后将按钮恢复原状
            const failedRecoverButton = () => {
                notyfInstance.error('购买失败');
                progress.end();
                $clone.attr('value', '愿意购买,我买,我付钱');
                $clone.prop('disabled', false);
            };
            let html: string;
            try {
                // 顶部的进度条
                progress.start();
                // 获取购买结果
                html = await getHTML(url);
                if (!html.includes('操作完成')) {
                    failedRecoverButton();
                    return;
                }
            } catch {
                failedRecoverButton();
            }

            // 组合当前购买楼层所在的页面地址, 不要用地址栏的地址
            const resultURL = `/read.php?tid=${ postDetail?.tid }&page=${ postDetail?.currentPage }`;
            // 重新获取购买后的楼层内容, 替换当前购买楼层的内容
            let purchasedDoc: Document;
            try {
                $clone.attr('value', '正在加载购买内容……请稍等………');
                // await sleep(1000);
                purchasedDoc = await getDocument(resultURL, 3, [
                    TASK_HidePostImage,
                    TASK_ReplaceUserAvatar,
                ]);
                const purchased = $(purchasedDoc).find(`a[name="${ postDetail?.pid }"]`).next().find(Selector.POST_CONTENT);
                $(postContainer).find(Selector.POST_CONTENT).replaceWith(purchased);
            } catch (e) {
                notyfInstance.error({
                    message: '加载内容失败, 请手动刷新当前页面',
                    duration: 10 * 1000,
                });
            }

            progress.end();

        });
    });

}