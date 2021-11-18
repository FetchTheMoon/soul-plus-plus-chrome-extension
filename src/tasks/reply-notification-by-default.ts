import { getItem } from '@/utilities/storage';
import $ from 'jquery';

export default async function TASK_ReplyNotificationByDefault() {
    if (!document.URL.includes('/post.php') && !document.URL.includes('/read.php')) return;
    if (!await getItem('Switch::reply-notification-by-default')) return;

    const $newRp = $(`input[name='atc_newrp']`);
    if ($newRp.length === 0) {
        $('td.f_one')[0].append($(`<span><input name="atc_newrp" type="checkbox" value="1" checked>新回复站内通知</span>`)[0]);
    } else {
        $newRp.attr('checked', 'true');
    }
}