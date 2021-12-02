import { getAllItems } from '@/utilities/storage';
import CryptoJS from 'crypto-js';


export async function ExportSettings() {
    const allItems = await getAllItems();


    const wa = CryptoJS.enc.Utf8.parse(JSON.stringify(allItems, undefined, 2));
    const url = 'data:application/json;base64,' + CryptoJS.enc.Base64.stringify(wa);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json'
    a.click();
}


export function ImportSettings(e: any) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();

    reader.onload = async function (e) {
        const contents = e.target!.result as string;
        const json = JSON.parse(contents);
        // console.log(json);
        if (!confirm('确定要覆盖所有的设置?')) return;
        for (const key in json) {
            // console.log(key);
            // console.log(json);
            if (key !== 'local' && key !== 'sync') throw new Error('配置文件有误');
            await chrome.storage[key].set(json[key]);
        }
        window.location.reload();
    };

    reader.readAsText(file);


}