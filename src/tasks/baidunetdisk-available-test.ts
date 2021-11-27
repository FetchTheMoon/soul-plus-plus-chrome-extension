import $ from 'jquery';
import { getItem } from '@/utilities/storage';
import { extract } from '@/utilities/misc';

export default async function TASK_BaiduNetDiskAvailableTest(doc: Document = document) {
    if (!document.URL.includes('/read.php')) return;
    if (!await getItem('Switch::baidunetdisk-available-test')) return;


    $(doc).find(`a[href^='https://pan.baidu.com']`).each((i, e) => {
        const ele = <HTMLLinkElement>e;
        const link = ele.textContent;
        ele.textContent = link + ' ⌛'
        chrome.runtime.sendMessage(
            [
                'request_cors',
                ele.href,
            ],
            function (txt) {
                const title = extract(txt, /<title>(.+)<\/title>/);
                if (title.includes('请输入提取码') || title.includes('免费高速下载')) {
                    ele.textContent = link + ' ✅';
                } else {
                    ele.textContent = link + ' ❌';
                }
            },
        );


    });
}