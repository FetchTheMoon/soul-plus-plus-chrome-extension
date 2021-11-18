import $ from 'jquery';
import { Selector } from '@/utilities/forum';
import { getItem, setItem } from '@/utilities/storage';
import { extract } from '@/utilities/misc';

const KEY = 'FunctionData::picwall-default';

export async function TASK_AddPicwallDefaultCheckbox() {
    if (!document.URL.includes('/thread.php') && !document.URL.includes('/thread_new.php')) return;
    const fid = Number(extract(document.URL, /fid[=-](\d+)/));
    $(Selector.PICWALL_SWITCH_LINK)
        .after(
            `<label style="color:dodgerblue; cursor:pointer;  vertical-align: middle;" for="spp-picwall-default" >
                        <input style="display: inline-block; vertical-align: middle; margin-bottom: 4px;" id="spp-picwall-default" type="checkbox"
                            ${ (await getItem(KEY, {}, 'local'))[fid] ? 'checked' : '' } 
                        /> 
                        在该版块默认打开图墙模式 
                    </label>`,
        );
    $('#spp-picwall-default').on('change', async (e) => {
        const ele = <HTMLInputElement>e.target;
        if (ele.checked) {
            location.href = `${ location.protocol }//${ location.host }/thread_new.php${ location.search }`;
            setItem(KEY, { ...await getItem(KEY, {}, 'local'), [fid]: true }, 'local');
        } else {
            location.href = `${ location.protocol }//${ location.host }/thread.php${ location.search }`;
            setItem(KEY, { ...await getItem(KEY, {}, 'local'), [fid]: false }, 'local');
        }
    });
}

export async function TASK_PicwallDefaultRedirect() {
    if (!document.URL.includes('/thread.php') && !document.URL.includes('/thread_new.php')) return;
    const fid = Number(extract(document.URL, /fid[=-](\d+)/));
    if ((await getItem(KEY, {}, 'local'))[fid] && !document.URL.includes('/thread_new.php')) {
        location.href = `${ location.protocol }//${ location.host }/thread_new.php${ location.search }`;

    }

}