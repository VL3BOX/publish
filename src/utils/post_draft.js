import throttle from 'lodash/throttle'
/**
 * 是否可以自动保存
 * @param ctx vue实例对象
 * @returns {boolean}
 */
export  const canAutoSave = (ctx) => {
    const _routeNames = ['macro', 'jx3dat', 'fb', 'bps', 'tool', 'bbs']

    if (!_routeNames.includes(ctx.$route.name)) return false

    return (!ctx.$route.query?.mode || ctx.$route.query?.mode === 'default')
}

const autoSave = (ctx, key, value) => {
    if (canAutoSave(ctx)) {
        const db = ctx.$store.state.db;

        db.setItem(key, value).then(() => {
            ctx.$notify({
                title: "保存成功",
                message: "本地草稿保存成功",
                type: "success",
            });
        })
    }
}

const autoSavePost = throttle(autoSave, 3000)

export {
    autoSave,
    autoSavePost
}
