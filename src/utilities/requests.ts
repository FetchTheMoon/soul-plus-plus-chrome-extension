import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

export async function requestRetry(url: string, config?: AxiosRequestConfig<any>, n: number = 1): Promise<AxiosResponse> {
    try {
        // return await fetch(url, options ?? {
        //     credentials: 'include',
        //     mode: 'no-cors',
        // });

        return await axios.get(url, config);

    } catch (err) {
        console.log('requestRetry error:', err);
        if (n <= 1) throw err;
        return await requestRetry(url, config, n - 1);
    }
}

export async function post(url: string, data: any) {

    return await axios.post(url, qs.stringify(data));
}

export async function getHTML(url: string, retry?: number): Promise<string> {
    const response = await requestRetry(url, undefined, retry);
    // return await response.text();
    return await response.data;
}


/**
 * @param {string} url 获取文档的地址
 * @param {number} retry 重试次数
 * @param {((doc:Document)=>Document)[]} preprocessTasks 用此参数提供的函数依次处理文档后再将文档返回
 */
export async function getDocument(url: string, retry?: number, preprocessTasks?: any[]): Promise<Document> {
    const html = await getHTML(url, retry);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.documentElement.dataset.URL = url;
    for (const task of preprocessTasks ?? []) {
        await task(doc);
    }
    // preprocessTasks?.forEach(async task => {
    //     await task(doc);
    // });
    return doc;
}
