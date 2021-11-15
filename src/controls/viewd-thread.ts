import { getItem, setItem } from '@/utilities/storage';


export default class ViewedThreadManager {

    static async addViewedThread(fid: number, tid: number): Promise<void> {
        const f = await this.getViewedThreads(fid);
        if (!f.includes(tid)) f.push(tid);
        this.setViewedThread(fid, f);
    }

    static async getViewedThreads(fid: number): Promise<number[]> {
        return (await this.getAllViewedThread())[fid] ?? [];
    }

    static async getAllViewedThread(): Promise<{ [fid: number]: number[] }> {
        return await getItem('FunctionData::viewed-threads', {}, 'local');
    }

    static async getLastViewedThread(): Promise<number> {
        return await getItem('FunctionData::last-viewed-thread', -1, 'local');
    }

    private static setViewedThread(fid: number, threads: number[]): void {
        setItem('FunctionData::viewed-threads', { ...this.getAllViewedThread(), [fid]: threads }, 'local');
    }

    static setLastViewedThread(tid: number): void {
        setItem('FunctionData::last-viewed-thread', tid, 'local');
    }


}