interface Callback {
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}


export default function addIntersectionObserver(callback: Callback, element: HTMLElement,
                config: { root?: Document, threshold?: number, rootMargin?: string } = {
                    threshold: 0.2,
                }) {
    const obs = new window.IntersectionObserver(callback, config);
    obs.observe(element);
}
