import { getHostname } from '@/utilities/domain';
import { getItem } from '@/utilities/storage';


export default async function TASK_DomainRedirect() {
    const domain = getHostname(await getItem('Input::domain'));
    if (!domain) return;
    if (window.location.hostname !== domain
    ) {
        window.location.href = `${ window.location.protocol }//${ domain }${ window.location.pathname }${ window.location.search }`;
    }
}

