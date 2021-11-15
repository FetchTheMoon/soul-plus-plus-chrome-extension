import { Button, Category, Input, Switch, UploadButton } from '@/controls/menu';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import BugReportIcon from '@mui/icons-material/BugReport';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

import { ExportSettings, ImportSettings } from '@/tasks/import-and-export-settings';
import { getHostname } from '@/utilities/domain';
import ClearSettings from '@/tasks/clear-settings';

export default [
    // 配置项都是通过chrome.storage.sync(local也一样)存放的
    // 由于这个API的get都是返回promise, 而React用异步值作初始值会多出很多麻烦
    // 下面所有的init是为了能用then将异步返回的值存放到对象内部的缓存字段里
    // 方便React生成菜单的时候直接使用这个缓存字段作为初始值
    // 一大堆init看起来挺不爽的, 有什么更优雅的办法的话, 望不吝赐教

    // 免刷新
    new Category('免刷新', 'refresh-free', SyncDisabledIcon, [
        new Switch('购买免刷新', 'buy-refresh-free').init(),
    ]).init(),


    // 无缝加载
    new Category('无缝加载', 'infinite-scroll', AllInclusiveIcon, [
        new Switch('无缝加载板块帖子列表', 'infinite-scroll-thread').init(),
        new Switch('无缝加载贴内楼层列表', 'infinite-scroll-post').init(),
        new Switch('无缝加载搜索页结果', 'infinite-scroll-search-result').init(),
        new Switch('无缝加载图墙模式帖子', 'infinite-scroll-pic-wall').init(),
    ]).init(),


    // 安全模式
    new Category('SFW安全模式', 'safe-for-work', HealthAndSafetyIcon, [
        new Switch('折叠贴内图片', 'hide-post-image').init(),
        new Switch('按需加载图片', 'load-image-on-demand').init(),
        new Switch('替换用户头像', 'replace-user-avatar').init(),
        new Switch('折叠版块公告大图', 'hide-forum-rule-image').init(),
    ]).init(),


    // 样式
    // await new Category('样式', 'theme', ColorLensIcon, [
    // ]).init(),

    // 其它
    new Category('其它', 'misc', MiscellaneousServicesIcon, [
        new Switch('暗黑模式', 'dark-mode').init(),
        new Switch('开启Mark++', 'mark-checker').init(),
        new Switch('自动领取和完成论坛任务', 'task-bot').init(),
        new Switch('标记已阅读过的帖子', 'highlight-viewed-thread').init(),
        new Switch('给[回复/引用]增加跳转链接', 'link-to-replied').init(),
        new Switch('折叠网赚区搜索结果', 'collapse-adforum-result').init(),
        new Switch('域名跳转', 'domain-redirect').init(),
        new Input(
            '要跳转的域名',
            'domain',
            `例如:south-plus.net`,
            `请输入正确的域名,例如:south-plus.net`,
            (value) => {
                const domain = getHostname(value);
                return {
                    valid: domain !== undefined,
                    result: domain ?? '',
                };
            },
        ).init(),
    ]).init(),


    // 调试
    new Category('调试', 'debug', BugReportIcon, [
        new Button('导出设置', 'export-settings', ExportSettings, 'secondary'),
        new UploadButton('导入设置', 'import-settings', ImportSettings, 'success'),
        // await new Button('TEST', 'test', test, 'success'),
        new Button('清空设置', 'clear-settings', ClearSettings, 'error'),
    ]).init(),

];
