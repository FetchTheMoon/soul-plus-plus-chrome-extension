import createDraggableButton from '@/utilities/draggable-button';
import backToTopCSS from '@/css/float-button-back-to-top.css';
import { addStyle } from '@/utilities/misc';

export default async function BackToTop() {
    addStyle(backToTopCSS, 'back-to-top-css');
    // const postInfo = getPostInfo();
    // if (!postInfo) return;

    const $button = await createDraggableButton(
        '回到顶部',
        'spp-back-to-top',
        {
            left: 'calc(50vw + 470px)',
            bottom: '30px',
        },
        'ComponentData::back-to-top',
    );

    $button.appendTo('body');

    $button.on('click', evt => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    });
}