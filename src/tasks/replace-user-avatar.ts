import { getItem } from '@/utilities/storage';
import { extract, getImages } from '@/utilities/misc';
import { createAvatar } from '@dicebear/avatars';
import { Selector } from '@/utilities/forum';
import * as style from '@dicebear/avatars-identicon-sprites';
import $ from 'jquery';

export default async function TASK_ReplaceUserAvatar(item: HTMLElement | Document) {
    const replaceAvatar = await getItem('Switch::replace-user-avatar');
    if (!replaceAvatar) return;
    if (!document.URL.includes('/read.php')) return;
    const imgs = getImages(item);
    if (!imgs.length) return;

    imgs.forEach(img => {
        const $img = $(img);
        // 获取不到头像容器说明这个图片不是头像, 告辞
        const container = $img.closest(Selector.AVATAR_CONTAINER);
        if (!container.length) return;
        const $container = $(container);
        // 给容器增加一个minHeight, 避免切换头像时闪烁
        $container.css({ minHeight: 150 });

        // 获得独一无二的UID
        const uid = extract($container.next().find('a').attr('href'), /action-show-uid-(\d+)\.html/);

        // 生成独一无二的Identicon
        let svg = createAvatar(style, {
            seed: uid,
            size: 100,
            colorLevel: 600,
        });

        const $svg = $(svg);

        // 将头像图隐藏, 并将Identicon添加到头像图片下方
        $img.addClass('spp-hide').after($svg);
        // console.info(`开始替换用户头像`);

        // 切换头像的事件
        $container.on('mouseenter', () => {
            $img.toggleClass('spp-hide');
            $svg.toggleClass('spp-hide');
        });
        $container.on('mouseleave', () => {
            $img.toggleClass('spp-hide');
            $svg.toggleClass('spp-hide');
        });
    });


}