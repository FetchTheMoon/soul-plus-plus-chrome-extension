import { getItem } from '@/utilities/storage';

export default () => {
    getItem(undefined, undefined, 'sync').then((v) => {
        console.log('sync:', v);
    });
    getItem(undefined, undefined, 'local').then((v) => {
        console.log('local', v);
    });
}