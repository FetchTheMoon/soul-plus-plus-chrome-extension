import $ from 'jquery';
import { getItem, setItem } from '@/utilities/storage';

/**
 * 创建一个可以在视口内随意拖动的按钮
 * @param name      按钮上的文字
 * @param id        按钮的ID
 * @param initPos   按钮的初始位置
 * @param key       按钮的存储键
 * @return $button  按钮的jQuery对象
 */
export default async function createDraggableButton(
    name: string,
    id: string,
    initPos: { top?: string, left?: string, right?: string, bottom?: string },
    key: string,
) {
    let savedTransform = await getItem(key);
    const $button = $(`<button id="${ id }" draggable="true">${ name }</button>`).css(
        {
            ...initPos,
            ...savedTransform ? { transform: savedTransform } : {},
        },
    );
    const start = { x: 0, y: 0 };

    $button.on('dragstart', (e) => {
        if (!e.screenX || !e.screenY) return;
        start.x = e.screenX;
        start.y = e.screenY;
        savedTransform = $button[0].style.transform;
    });

    $button.on('dragend', (e) => {
        if (!e.screenX || !e.screenY) return;
        const offsetX = e.screenX - start.x;
        const offsetY = e.screenY - start.y;
        // console.log(offsetX, offsetY);
        // console.log($button[0].style.transform);
        const m = $button[0].style.transform.match(/translate\((-?\d+)px, (-?\d+)px\)/);
        const transX = m ? Number(m[1]) : 0;
        const transY = m ? Number(m[2]) : 0;
        $button.css('transform', `translate(${ transX + offsetX }px, ${ transY + offsetY }px)`);
        if (key) setItem(key, $button[0].style.transform);
    });


    // 防止超出视口
    const obs = new window.IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
            $button.css('transform', savedTransform);
            if (key) setItem(key, savedTransform);
        }
    }, {
        root: null,
        threshold: 0.01,
    });
    obs.observe($button[0]);

    return $button;
}