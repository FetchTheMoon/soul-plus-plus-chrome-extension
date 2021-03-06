import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

export async function fetchRetry(url: string, options?: RequestInit, n: number = 1, timeout = 5000): Promise<Response> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        options = options ?? {
            credentials: 'include',
            mode: 'no-cors',
        };
        options.signal = controller.signal;
        options.signal.addEventListener('abort', () => clearTimeout(timeoutId));
        return await fetch(url, options).finally(() => clearTimeout(timeoutId));
    } catch (err) {
        if (n <= 1) throw err;
        return await fetchRetry(url, options, n - 1);
    }
}

// axios在service worker跨域会出现 adapter is not a function
// https://github.com/axios/axios/issues/2968#issuecomment-744012443
// https://github.com/axios/axios/issues/4209
// https://github.com/axios/axios/issues/1219
// https://github.com/axios/axios/issues/484
export async function requestRetry(url: string, config?: AxiosRequestConfig<any>, n: number = 1): Promise<AxiosResponse> {
    try {

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
