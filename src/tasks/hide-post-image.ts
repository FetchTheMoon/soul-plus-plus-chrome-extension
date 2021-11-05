import $ from 'jquery';
import { Selector } from '@/utilities/forum';
import { addStyle, getImages, isInViewport } from '@/utilities/misc';
import { getItem } from '@/utilities/storage';
import HidePostImageCSS from '@/css/hide-post-image.css';


export default async function TASK_HidePostImage(item: HTMLElement | Document) {
    const hidePostImage = await getItem('Switch::hide-post-image');
    if (!hidePostImage) return;
    if (!document.URL.includes('/read.php')) return;
    const imgs = getImages(item);
    if (!imgs.length) return;
    addStyle(HidePostImageCSS, 'hide-post-image-css');
    const loadImageOnDemand = await getItem('Switch::load-image-on-demand', false);
    imgs.forEach((img) => {
        const $img = $(img);
        // 如果不是帖子内容里的图片, 告辞
        if (!$img.closest(Selector.POST_CONTENT).length) return;
        // 避免屏蔽了表情
        if ($img.attr('src')?.includes('images/post/smile')) return;
        // 避免屏蔽了文件图标
        if ($img.attr('src')?.includes('images/colorImagination/file')) return;
        // 如果图片的父元素是A标签，去掉它
        if ($img.parent().prop('tagName') === 'A') $img.parent().replaceWith($img);
        // 避免重复处理
        if ($img.parent().hasClass('spp-img-mask')) return;

        // 隐藏图片
        // console.info(`开始隐藏帖子图片`);
        $img.addClass('spp-hide');
        const $wrapper = $(
            `<div class="spp-img-mask">
                <span>
                    <img class="spp-img-mask-icon-hide" alt="" src="images/post/smile/smallface/face106.gif"/>
                    <img class="spp-img-mask-icon-show spp-hide" alt="" src="images/post/smile/smallface/face109.gif"/>
                    <span class="spp-img-mask-text">看看是啥</span>
                </span>
            </div>`,
        );
        // 用replace会把$img里面的data给清掉, 啊这..害我找半天
        // $img.replaceWith(wrapper);
        $img.after($wrapper);
        $wrapper.append($img);
        // 修复论坛过大图片的会超出容器的问题
        $img.width('100%');

        // 如果开启了按需加载
        let $loading: JQuery<HTMLElement>;
        if (loadImageOnDemand) {
            $loading = $(`<div class="spp-loading-animation spp-hide">
                <div class="dot1"></div>
                <div class="dot2"></div>
                <div class="dot3"></div>
                </div>`);
            $img.data('src', <string>($img.attr('src')));
            $img.removeAttr('src');
            $img.before($loading);
            $img.on('load', () => $loading.remove());
        }

        $img.on('click', (e) => {
            e.preventDefault();
        });
        $wrapper.on('click', (e) => {
            e.stopPropagation();
            $img.toggleClass('spp-hide');
            if ($img.hasClass('spp-hide')) {
                if (!isInViewport($wrapper[0] as HTMLElement)) {
                    $wrapper[0].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
                $('#spp-img-last-seen').removeAttr('id');
                $wrapper.addClass('spp-img-seen');
                $wrapper.attr('id', 'spp-img-last-seen');
            }

            $wrapper.find('.spp-img-mask-icon-hide').toggleClass('spp-hide');
            $wrapper.find('.spp-img-mask-icon-show').toggleClass('spp-hide');
            if ($loading) $loading.toggleClass('spp-hide');
            if (loadImageOnDemand && !$img.hasClass('spp-hide')) {
                $img.attr('src', $img.data('src'));
            }
        });

    });


}

