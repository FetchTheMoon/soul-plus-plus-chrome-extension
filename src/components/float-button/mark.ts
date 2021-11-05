import { addStyle } from '@/utilities/misc';
import markCSS from '@/css/float-button-mark.css';
import { getThreadInfo } from '@/utilities/forum';
import createDraggableButton from '@/utilities/draggable-button';
import MarkListManager, { OFFER_STAGE } from '@/utilities/mark-list';

export default async function Mark() {

    addStyle(markCSS, 'mark-button-css');
    const threadInfo = getThreadInfo();
    if (!threadInfo) return;
    const markInfo = await MarkListManager.getThreadMarkInfo(threadInfo.tid);


    const $button = await createDraggableButton(
        'MARK',
        'spp-mark',
        {
            left: 'calc(50vw + 470px)',
            top: '30px',
        },
        'ComponentData::mark-button',
    );
    $button.appendTo('body');

    if (markInfo) {
        $button.text('MARKED');
        $button.addClass('marked');
    }

    $button.on('click', async evt => {
        const ele = evt.target;
        const markInfo = await MarkListManager.getThreadMarkInfo(threadInfo.tid);
        if (markInfo) {
            MarkListManager.removeThreadMark(threadInfo.tid);
            ele.textContent = 'MARK';
            ele.classList.remove('marked');
        } else {
            MarkListManager.addThreadMark({
                tid: threadInfo.tid,
                title: threadInfo.title,
                maxPage: threadInfo.maxPage,
                markTime: Date.now(),
                url: document.URL,
                lastCheckTime: 0,
                lastCheckPage: 0,
                offerStage: OFFER_STAGE.UNKNOWN,
                sell: [],
                hyperlink: [],
                magnet: [],
                miaochuan: [],
            });
            ele.textContent = 'MARKED';
            ele.classList.add('marked');
        }
    });
}
