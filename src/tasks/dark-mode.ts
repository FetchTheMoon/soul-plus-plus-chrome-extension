import CSS from '@/css/dark-mode.css';
import { addStyle } from '@/utilities/misc';
import { getItem } from '@/utilities/storage';

export default async function TASK_DarkMode() {
    if (!await getItem('Switch::dark-mode')) return;
    addStyle(CSS, 'dark-mode-css');
}

export async function DarkModeStylesReplacer(ele: Element) {
    if (!await getItem('Switch::dark-mode')) return;
    if(ele.getAttribute('spp-css-replace') === 'done') return;
    
    ele.textContent = ele.textContent!
        .replace(/background(-image)?:(#[a-f0-9]{3,6} )?url\(images\/colorImagination\/\w*?(bg|u-wrap)\w*?\.(gif|png)\).+?([;}])/gim, '')
        .replace(/background:(#f{3}|#f{6});?/gim, '')
        .replace(/\.gray3{.+?}/gim, '')
        .replace(/h2 a{.+?}/gim, '')
        .replace(/background:(#f8f8f8);/gim, '')
        .replace(/background:(#EEEEEE);/gim, '')
        .replace(/background:(#bbbbbb);/gim, '')

    ele.setAttribute('spp-css-replace', 'done');
}

