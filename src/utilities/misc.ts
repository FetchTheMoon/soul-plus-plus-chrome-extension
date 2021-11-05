/**
 * @param content 用来匹配的文本
 * @param regex 正则表达式, 如果需要匹配多个结果, 要给正则尾部加上g
 * @param group 匹配结果的组号, 默认为1
 */
export function extract(content: unknown, regex: RegExp, group: number = 1): string {
    if (typeof content !== 'string') return '';
    const m = content.match(regex);
    if (!m) return '';
    if (!m[group]) return '';
    return m[group];
}

export function extractAll(content: unknown, regex: RegExp): string[] {
    if (typeof content !== 'string') return [];
    const m = content.match(regex);
    if (!m) return [];
    return m;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function debounce(callback: Function, wait: number) {
    let timeoutId: unknown = undefined;
    return (...args: any) => {
        if (typeof timeoutId === 'number') window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

export function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


/**
 * 将CSS文件的内容注入以style标签的方式注入到页面中
 * @param styleString CSS文件的内容
 * @param id 防止重复注入
 */
export function addStyle(styleString: string, id: string) {
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = styleString;
    document.head.append(style);

}


export const getImages = (x: HTMLElement | Document): Element[] => {
    if (x instanceof Document) {
        return [...x.getElementsByTagName('IMG')];
    } else {
        if (x.tagName !== 'IMG') return [];
        return [x];
    }
};
