import { getItem } from '@/utilities/storage';
import $ from 'jquery';
import CSS from '@/css/add-img-upload.styl';
import { addStyle, extract } from '@/utilities/misc';
import { blobToBase64 } from '@/utilities/blob-base64';
import { Progress } from 'rsup-progress';

export default async function TASK_AddImgUpload() {
    if (!document.URL.match(/\/(read|post)\.php/)) return;
    if (!await getItem('Switch::add-pic-upload')) return;

    addStyle(`.spp-progress-bar{ position:absolute !important; top:0 !important, left:0 !important }`, 'spp-progress-bar');
    addStyle(CSS, 'add-img-upload');
    const $editor = $('textarea').last();
    $(`
<div class="spp-img-upload">
    <div class="drop-zone">
        <input type="file" accept="image/*" id="file-input" multiple>
        <div class="status">拖拽图片至此处，或点此上传</div>
    </div>
</div>`).insertAfter($editor);
    const $container = $('.spp-img-upload');
    $container.css({ width: $editor.css('width'), position: 'relative' });
    const $dropZone = $('.drop-zone>input[type="file"]');
    const progress = new Progress({
        height: '4px',
        color: '#2995ff',
        container: $container[0],
        className: 'spp-progress-bar',
    });

    const token = new Promise((resolve) => {
        chrome.runtime.sendMessage(
            [
                'request_cors',
                'https://freeimage.host/',
            ],
            function (txt) {
                resolve(extract(txt, /PF\.obj\.config\.auth_token = "([a-f0-9]{40})"/i));
            },
        );
    });
    const uploadHandler = async (files: FileList | null | undefined) => {

        console.log(files);
        if (!files) return;
        if (files.length === 0) return;

        const t = (await token) as string;
        if (!t) {
            setStatusText(`未能获取到token, 无法上传, 请向作者反馈`);
            return;
        }
        let all = [];
        for (const file of [...files]) {
            setStatusText(`正在上传[${ file.name }]...`);
            const fB64 = await blobToBase64(file);
            console.log(fB64);
            all.push(new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    [
                        // [0]
                        'upload_img',
                        // `https://p.sda1.dev/api_dup8/v1/upload_noform?ts=${ Date.now() }&rand=${ Math.random() }&batch_size=${ files?.length }&filename=${ file.name }`,
                        // [1]
                        `https://freeimage.host/json`,
                        // [2]
                        {
                            type: 'file',
                            action: 'upload',
                            timestamp: Date.now(),
                            auth_token: t,
                            nsfw: 0,
                            source: fB64,
                        },
                    ], response => {
                        console.log(response);
                        if (response?.status_code === 200) {
                            const $editor = $('textarea').last();
                            $editor.val(
                                $editor.val()
                                + `${ $editor.val() ? '\n' : '' }`
                                + `[img]${ response['image']['image']['url'] }[/img]`,
                            );
                            setStatusText(`${ file.name }上传成功`);
                            resolve(response['image']['image']['url']);
                        } else if (response?.status_code === 400) {
                            setStatusText(`上传失败, ${ response?.error?.message }`);
                            reject();
                        } else {
                            setStatusText(`上传失败`);
                            reject();
                        }
                    });
            }));

        }

        await progress.promise(Promise.allSettled(all));
    };
    $dropZone.on('change', e => uploadHandler((e!.currentTarget as HTMLInputElement).files));
    $editor.on('paste', e => uploadHandler((e.originalEvent as ClipboardEvent).clipboardData?.files));
}

function setStatusText(txt: string) {
    $('.spp-img-upload .status').text(txt);
}