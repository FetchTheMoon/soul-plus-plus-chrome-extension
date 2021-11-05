export type StorageType = 'local' | 'sync';

export function setItem(key: string, value: any, sType: StorageType = 'sync'): void {
    chrome.storage[sType].set({ [key]: value });
}

export async function getItem(key?: string, defaultValue?: any, sType: StorageType = 'sync'): Promise<any> {
    if (key) {
        const item = await chrome.storage[sType].get(key);
        return item[key] ?? defaultValue;
    } else {
        return await chrome.storage[sType].get();
    }
}

export function clearItems(sType: StorageType = 'sync') {
    chrome.storage[sType].clear();
}