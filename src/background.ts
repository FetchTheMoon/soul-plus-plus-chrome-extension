import { getItem } from '@/utilities/storage';

function addMyMarkListPopup() {
    chrome.contextMenus.create(
        {
            contexts: ['all'],
            id: 'popup-my-mark-list',
            title: '打开我的Mark列表',
        },
    );
}


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


chrome.contextMenus.onClicked.addListener(function (clickData, tab) {
    if (clickData.menuItemId === 'popup-my-mark-list') {
        chrome.tabs.create(
            {
                url: chrome.runtime.getURL('my-mark-list.html'),
            },
        );
    }
});



