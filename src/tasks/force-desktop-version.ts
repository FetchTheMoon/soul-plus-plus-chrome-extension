import { getItem } from '@/utilities/storage';
import { getHostname } from '@/utilities/domain';


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
            const m = window.location.search.match(/\?f(\d+)_?(\d).html/);
            const [s, fid, page] = m ? m : [];
            if (fid) {
                window.location.href = host + `/thread.php?fid=${ fid }${ page ? `&page=${ page }` : '' }`;
                return;
            }
        }

        {
            const m = window.location.search.match(/\?t(\d+)_?(\d).html/);
            const [s, tid, page] = m ? m : [];
            if (tid) {
                window.location.href = host + `/read.php?tid=${ tid }${ page ? `&page=${ page }` : '' }`;
                return;
            }
        }


    }
}

