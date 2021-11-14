import { Button, Category, Input, Switch } from '@/controls/menu';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import BugReportIcon from '@mui/icons-material/BugReport';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

import show_settings from '@/tasks/show-settings';
import test from '@/tasks/test';
import { getHostname } from '@/utilities/domain';
import ClearSettings from '@/tasks/clear-settings';

export default [
    // 配置项都是通过chrome.storage.sync(local也一样)存放的
    // 由于这个API的get都是返回promise, 而React用异步值作初始值会多出很多麻烦
    // 下面所有的init是为了能用then将异步返回的值存放到对象内部的缓存字段里
    // 方便React生成菜单的时候直接使用这个缓存字段作为初始值
    // 一大堆await和init看起来挺不爽的, 有什么更优雅的办法的话, 望不吝赐教

    // 免刷新
    await new Category('免刷新', 'refresh-free', SyncDisabledIcon, [
        await new Switch('购买免刷新', 'buy-refresh-free').init(),
    ]).init(),


    // 无缝加载
    await new Category('无缝加载', 'infinite-scroll', AllInclusiveIcon, [
        await new Switch('无缝加载板块帖子列表', 'infinite-scroll-thread').init(),
        await new Switch('无缝加载贴内楼层列表', 'infinite-scroll-post').init(),
        await new Switch('无缝加载搜索页结果', 'infinite-scroll-search-result').init(),
        await new Switch('无缝加载图墙模式帖子', 'infinite-scroll-pic-wall').init(),
    ]).init(),


    // 安全模式
    await new Category('SFW安全模式', 'safe-for-work', HealthAndSafetyIcon, [
        await new Switch('折叠贴内图片', 'hide-post-image').init(),
        await new Switch('按需加载图片', 'load-image-on-demand').init(),
        await new Switch('替换用户头像', 'replace-user-avatar').init(),
        await new Switch('折叠版块公告大图', 'hide-forum-rule-image').init(),
    ]).init(),


    // 样式
    // await new Category('样式', 'theme', ColorLensIcon, [
    // ]).init(),

    // 其它
    await new Category('其它', 'misc', MiscellaneousServicesIcon, [
        await new Switch('暗黑模式', 'dark-mode').init(),
        await new Switch('开启Mark++', 'mark-checker').init(),
        await new Switch('自动领取和完成论坛任务', 'task-bot').init(),
        await new Switch('标记已阅读过的帖子', 'highlight-viewed-thread').init(),
        await new Switch('折叠网赚区搜索结果', 'collapse-adforum-result').init(),
        await new Switch('域名跳转', 'domain-redirect').init(),
        await new Input(
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
    await new Category('调试', 'debug', BugReportIcon, [
        await new Button('显示设置', 'show-settings', show_settings),
        await new Button('TEST', 'test', test, 'success'),
        await new Button('清空设置', 'clear-settings', ClearSettings, 'error'),
    ]).init(),

];
