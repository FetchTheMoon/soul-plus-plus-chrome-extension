export type StorageType = 'local' | 'sync';

export function setItem(key: string, value: any, sType: StorageType = 'sync'): void {
    chrome.storage[sType].set({ [key]: value });
}

// let counter = <any>{};

export async function getItem(key: string, defaultValue?: any, sType: StorageType = 'sync'): Promise<any> {

    // counter[key] = counter[key] ? counter[key] + 1 : 1;
    // console.log('getItem:', counter);

    if (key) {
        const item = await chrome.storage[sType].get(key);
        return item[key] ?? defaultValue;
    }
}

export function clearItems(sType: StorageType = 'sync') {
    chrome.storage[sType].clear();
}

export async function getAllItems() {
    const sync = await chrome.storage.sync.get();
    const local = await chrome.storage.local.get();

    return { sync, local };

}