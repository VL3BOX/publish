import {canAutoSave} from '@/utils/post_draft'

export const saveLocalRevision = (ctx, key, value) => {
    if (canAutoSave(ctx)) {
        sessionStorage.setItem(key, JSON.stringify(value))
    }
}
