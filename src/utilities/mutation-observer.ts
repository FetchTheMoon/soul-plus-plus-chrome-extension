import TASK_HidePostImage from '@/tasks/hide-post-image';
import TASK_ReplaceUserAvatar from '@/tasks/replace-user-avatar';
import TASK_HideForumRuleImage from '@/tasks/hide-forum-rule-image';

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

    }

}

