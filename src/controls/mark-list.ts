import { getItem, setItem } from '@/utilities/storage';

export enum OFFER_STAGE {
    OFFERING = '悬赏中',
    FINISHED = '已完成',
    EXPIRED = '已过期',
    UNKNOWN = '未知',
}

export interface IPostInfo {
    tid: number,
    page: number,
    // pid 可能是tpc, 所以不要改成number
    pid: string,
}


export interface IMarkList {
    [tid: number]: IMarkedThreadInfo;
}


export interface IMarkedThreadInfo {
    tid: number;                    // 帖子id
    title: string;                  // 帖子标题
    maxPage: number;                // 帖子最大页数
    markTime: number;               // mark时间
    url: string;                    // 帖子url
    lastCheckTime: number;          // 上次检查时间
    lastCheckPage: number;          // 上次检查页数
    offerStage: OFFER_STAGE;        // 悬赏阶段
    offerRemainingHours?: number;   // 悬赏剩余时间
    sell: IPostInfo[];           // 出售帖子
    hyperlink: IPostInfo[]; // 超链接帖子
    miaochuan: IPostInfo[]; // 包含hash的帖子, 也就是磁力或者秒传
    magnet: IPostInfo[];       // 包含hash的帖子, 也就是磁力或者秒传
}

export default class MarkListManager {

    static async getMarkList(): Promise<IMarkList> {
        return await getItem('FunctionData::mark', {}, 'local');
    }

    static setMarkList(markList: IMarkList) {
        setItem('FunctionData::mark', markList, 'local');
    }

    static async getThreadMarkInfo(tid: number) {
        const markList = await this.getMarkList();
        return markList[tid];
    }

    static async setThreadMarkInfo(mark: IMarkedThreadInfo) {
        const markList = await this.getMarkList();
        markList[mark.tid] = mark;
        this.setMarkList(markList);
    }

    static addThreadMark(mark: IMarkedThreadInfo) {
        this.setThreadMarkInfo(mark);
    }

    static async removeThreadMark(tid: number) {
        const markList = await this.getMarkList();
        delete markList[tid];
        this.setMarkList(markList);
    }

    static async isAllPageChecked() {
        const markList = await this.getMarkList();
        const markListArr = Object.values(markList);
        return markListArr.every(mark => mark.maxPage === mark.lastCheckPage);
    }

}