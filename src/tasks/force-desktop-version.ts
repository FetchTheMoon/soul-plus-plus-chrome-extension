import { getItem } from '@/utilities/storage';
import { getHostname } from '@/utilities/domain';
import { extract } from '@/utilities/misc';


export default async function TASK_ForceDesktopVersion() {
    if (!await getItem('Switch::force-desktop-version')) return;
    if (window.location.pathname.includes('/simple/index.php')) {
        if (window.location.search === '') {
            window.location.href = `https://${ window.location.host }`;
            return;
        }
        let domain: string | undefined = window.location.host;
        if (await getItem('Switch::domain-redirect')) domain = getHostname(await getItem('Input::domain'));
        if (!domain) domain = window.location.host;
        const host = `${ window.location.protocol }//${ domain }/`;
        {
            const s = extract(window.location.search, /\?f(\d+_?\d+)\.html/);
            const [fid, page] = s.split('_');
            if (fid) {
                window.location.href = host + `/thread.php?fid=${ fid }${ page ? `&page=${ page }` : '' }`;
                return;
            }
        }

        {
            const s = extract(window.location.search, /\?t(\d+_?\d+)\.html/);
            const [tid, page] = s.split('_');
            if (tid) {
                window.location.href = host + `/read.php?tid=${ tid }${ page ? `&page=${ page }` : '' }`;
                return;
            }
        }


    }
}

