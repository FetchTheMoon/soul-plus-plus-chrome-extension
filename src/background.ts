import { getItem } from '@/utilities/storage';
import { fetchRetry } from '@/utilities/requests';
import { base64ToBlob } from '@/utilities/blob-base64';

function addMyMarkListPopup() {
    chrome.contextMenus.create(
        {
            contexts: ['all'],
            id: 'popup-my-mark-list',
            title: '打开我的Mark列表',
        },
    );
}

chrome.runtime.onMessage.addListener((msg: any, sender, sendResponse) => {
    switch (msg[0]) {
        case 'request_cors': {
            fetchRetry(
                msg[1],
                {
                    mode: 'cors',
                },
                3,
            ).then(async r => {
                sendResponse(await r.text());
            });

            break;
        }
        case 'upload_img': {

            const body = { ...msg[2], source: base64ToBlob(msg[2]['source']) };
            console.log(body);
            const formData = new FormData();
            for (const [k, v] of Object.entries(body)) {
                formData.append(k, v as (string | Blob));
            }
            console.log(formData);
            fetchRetry(
                msg[1],
                {
                    body: formData,
                    method: 'post',
                    mode: 'no-cors',
                    credentials: 'include',
                    headers: {
                        accept: 'application/json',
                        contentType: 'multipart/form-data',
                    },
                },
                1,
            ).then(async r => {
                sendResponse(await r.json());
            });
        }
    }
    return true;
});

chrome.runtime.onStartup.addListener(async () => {
    if (await getItem('Switch::mark-checker')) addMyMarkListPopup();

});

chrome.runtime.onInstalled.addListener(async () => {
    if (await getItem('Switch::mark-checker')) addMyMarkListPopup();

});


chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (!changes['Switch::mark-checker']) return;
    if (changes['Switch::mark-checker']['newValue']) addMyMarkListPopup();
    else chrome.contextMenus.remove('popup-my-mark-list');
});


chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId === 'popup-my-mark-list') {
        chrome.tabs.create(
            {
                url: chrome.runtime.getURL('my-mark-list.html'),
            },
        );
    }
});



