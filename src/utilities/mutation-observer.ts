import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import TASK_HideForumRuleImage from '@/tasks/hide-forum-rule-image';
import TASK_LinkToReplied from '@/tasks/link-to-replied';
import { DarkModeStylesReplacer } from '@/tasks/dark-mode';

export default async function MutationObserverProcess(
    options = {
        childList: true,
        subtree: true,
        attributes: false,
    },
    target: Node = document.documentElement,
) {

    const observer = new MutationObserver(callback);
    observer.observe(target, options);

    function callback(mutationList: MutationRecord[]) {
        mutationList
            .filter(mutation => mutation.type === 'childList')
            .forEach(mutation => [...mutation.addedNodes]
                .filter(node => node.nodeType === node.ELEMENT_NODE)
                .forEach(procAddedNodes),
            );
    }

    async function procAddedNodes(node: Node) {
        if ((node as HTMLElement).tagName === 'IMG') {
            TASK_HidePostImage(node as HTMLElement);
            TASK_ReplaceUserAvatar(node as HTMLElement);
            TASK_HideForumRuleImage(node as HTMLElement);
        }
        if ((node as HTMLElement).tagName === 'A') {
            TASK_LinkToReplied(node as HTMLElement);
        }
        if ((node as HTMLElement).tagName === 'STYLE') {
            DarkModeStylesReplacer(node as HTMLElement);
        }

    }

}

