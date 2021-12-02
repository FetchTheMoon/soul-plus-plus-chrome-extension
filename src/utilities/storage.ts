export type StorageType = 'local' | 'sync';

export async function setItem(key: string, value: any, sType: StorageType = 'sync') {
    await chrome.storage[sType].set({ [key]: value });
}


export async function getItem(key?: string, defaultValue?: any, sType: StorageType = 'sync'): Promise<any> {

    return new Promise((resolve) => {

        if (key)
            chrome.storage[sType].get(key, (items => {
                resolve(items?.[key] ?? defaultValue);
            }));

        else
            chrome.storage[sType].get(items => resolve(items));
    });


}

export function clearItems(sType: StorageType = 'sync') {
    chrome.storage[sType].clear();
}

export async function getAllItems() {
    const sync = await getItem(undefined, {}, 'sync');
    const local = await getItem(undefined, {}, 'local');

    return { sync, local };

}