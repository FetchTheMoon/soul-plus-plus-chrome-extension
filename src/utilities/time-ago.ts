export default function TimeAgo(dateTimeStamp: number) {
    const minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = Date.now(); //获取当前时间毫秒
    const diffValue = now - dateTimeStamp; //时间差

    if (diffValue < 0) {
        return '刚刚';
    }
    const minC = Math.round(diffValue / minute); //计算时间差的分，时，天，周，月
    const hourC = Math.round(diffValue / hour);
    const dayC = Math.round(diffValue / day);
    const weekC = Math.round(diffValue / week);
    const monthC = Math.round(diffValue / month);
    let result: string;
    if (monthC >= 1 && monthC <= 3) {
        result = ' ' + monthC + ' 月前';
    } else if (weekC >= 1 && weekC <= 3) {
        result = ' ' + weekC + ' 周前';
    } else if (dayC >= 1 && dayC <= 6) {
        result = ' ' + dayC + ' 天前';
    } else if (hourC >= 1 && hourC <= 23) {
        result = ' ' + hourC + ' 小时前';
    } else if (minC >= 1 && minC <= 59) {
        result = ' ' + minC + ' 分钟前';
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = '刚刚';
    } else {
        const datetime = new Date();
        datetime.setTime(dateTimeStamp);
        const Nyear = datetime.getFullYear();
        {
        }
        const Nmonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        const Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
        const Nhour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
        const Nminute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        const Nsecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + '-' + Nmonth + '-' + Ndate;
    }
    return result;
}

