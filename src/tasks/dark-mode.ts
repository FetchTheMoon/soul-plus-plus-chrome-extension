import DarkModeCSS from '@/css/dark-mode.css';
import { addStyle } from '@/utilities/misc';
import { getItem } from '@/utilities/storage';

export default async function TASK_DarkMode() {
    if (!await getItem('Switch::dark-mode')) return;
    addStyle(DarkModeCSS, 'dark-mode-css');
}