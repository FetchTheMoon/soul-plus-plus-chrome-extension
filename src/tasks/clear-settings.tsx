import React from 'react';
import { clearItems } from '@/utilities/storage';

export default function ClearSettings() {

    if (confirm(
        `
                【警告】
                这将会清空你在所有的数据和设置，包括：
                - 已读的帖子
                - 可拖放按钮的位置
                - 已经MARK过的帖子
                
                你确定要这样做？`,
    )) {
        clearItems('local');
        clearItems('sync');
        document.location.reload();
    }
}