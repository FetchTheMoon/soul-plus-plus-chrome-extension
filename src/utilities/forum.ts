import { extract } from '@/utilities/misc';
import $ from 'jquery';


export enum Selector {
    ALL_POSTS_CONTAINER = 'form[name=delatc]',
    POST_CONTAINER = '.t5.t2',
    POST_CONTENT = '.tr1 .r_one',
    THREAD = '.tr3.t_one',
    SEARCH_RESULT_THREAD = '.tr3.tac',
    BUY_BUTTON = '.quote.jumbotron>.btn.btn-danger',
    PAGINATION = '.pages',
    PICWALL_THREAD = '.dcsns-li.dcsns-rss.dcsns-feed-0',
    PICWALL_THREAD_PIC = '.dcsns-li.dcsns-rss.dcsns-feed-0 .lazy',
    CURRENT_PAGE_IN_PAGINATION = '.pages b',
    SEARCH_RESULT_TITLE = '#main>.t>table>tbody>tr>td.h',
    LOGIN_FORM = 'input[type=password]',
    UID = '#menu_profile .ul2',
    USERNAME = '#user-login>a[href="u.php"]',
    RECEIVE_TASK_BUTTON = 'a[title=按这申请此任务]',
    COMPLETE_TASK_BUTTON = 'a[title=领取此奖励]',
    AVATAR_CONTAINER = '.user-pic',
    AVATAR_IMAGE = '.user-pic img',
    RULE_IMAGE_BIG = '[onload="if(this.width>\'9999\')this.width=\'9999\';"]',
    RULE = '#cate_thread>#tab_1',
    RULE_IMAGE_MEDIUM = '[onload="if(this.width>\'680\')this.width=\'680\';"]',
    POST_TITLE = '.crumbs-item.current strong>a',
    OFFER_STAGE = '.tips .s3',
    SELL = '.quote.jumbotron',
    HYPER_LINK_IN_POST = '.tpc_content a',
    QUOTE = '.t5.t2 h6.quote2+div',
    REPLY = '.t5.t2 .h1.fl>.fl',
    THREAD_TITLE_LINK = '.tr3.t_one h3 a',
    REPLY_TEXTAREA = 'textarea[onkeydown="quickpost(event)"]',
    SUBMIT_BUTTON = 'form[action="post.php?"] input[type="submit"]',
    REPLY_FORM_DATA = 'form .f_one input',
    USERS_THREAD = '#u-contentmain table tr',
    PICWALL_SWITCH_LINK = '.fr.gray3>a',


}

export function getThreadInfo(anyEleInThread?: any, doc: Document = document) {
    const $anyEleInThread = anyEleInThread ? $(anyEleInThread) : $(doc).find(Selector.POST_CONTENT).first();
    // 当调用者没有提供任何帖子内元素时, 直接取第一个帖子
    if (!$anyEleInThread.length) throw new Error('只能在帖子内调用 getThreadInfo');
    const pid = $anyEleInThread.closest(Selector.POST_CONTAINER).prev().attr('name');
    if (typeof pid === 'undefined') throw new Error('没有找到楼层对应的PID');
    return {
        // tid可能是"tpc", 不要转换成数字
        pid: pid,
        tid: Number(extract(doc.body.textContent, /var tid = '(\d+)'/)),
        fid: Number(extract(doc.body.textContent, /var fid = '(\d+)'/)),
        title: $(doc).find(Selector.POST_TITLE).text(),
        currentPage: Number(extract(doc.body.textContent, /var page = parseInt\('(\d+)'\)/)),
        maxPage: Number(extract(doc.body.textContent, /var totalpage = parseInt\('(\d+)'\)/)),
    };
}

export function getForumInfo(anyEleInForum?: JQuery, doc: Document = document) {
    if (doc.URL.includes('/thread.php')) {
        anyEleInForum = anyEleInForum ?? $(doc).find(Selector.THREAD).first();
    } else if (doc.URL.includes('/thread_new.php')) {
        anyEleInForum = anyEleInForum ?? $(doc).find(Selector.PICWALL_THREAD).first();
    } else {
        throw new Error('只能在版块页面内调用 getForumInfo');
    }
    return {
        tid: Number(extract(anyEleInForum.first().find('a').attr('href'), /tid-(\d+)\.html/)),
        fid: Number(extract(doc.body.textContent, /var fid = '(\d+)'/)),
        currentPage: Number(extract(doc.body.textContent, /var page = parseInt\('(\d+)'\)/)),
        maxPage: Number(extract(doc.body.textContent, /Pages: \d+\/(\d+)/)),
    };
}

export function getSearchInfo(anyEleInThread?: JQuery, doc: Document = document) {
    if (doc.URL.includes('/search.php')) {
        anyEleInThread = anyEleInThread ?? $(doc).find(Selector.SEARCH_RESULT_THREAD).first();
    } else {
        return;
    }
    return {
        tid: Number(extract(anyEleInThread.first().find('a').attr('href'), /tid-(\d+)\.html/)),
        currentPage: Number(extract(doc.body.textContent, /Pages: (\d+)\/\d+/)),
        maxPage: Number(extract(doc.body.textContent, /Pages: \d+\/(\d+)/)),
    };
}
