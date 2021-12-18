import { autoSave } from "@/utils/post_draft";
import {pull} from "@/service/cms";

export const AutoSaveMixin = {
    data() {
        return {
            // 定时器
            localTimer: '',
            webTimer: '',
        }
    },
    computed: {
        isDraft() {
            return this.$route.query?.mode === 'draft'
        },
        db() {
            return this.$store.state.db
        }
    },
    mounted() {
        if (!this.isDraft) {
            this.localTimer = setInterval(async () => {
                await this.autoSave()
            }, 30000)
        }
    },
    methods: {
        init: function () {
            this.loading = true;
            // 当 mode = draft 时，先加载本地 IndexedDB 内容
            if (this.isDraft) {
                const key = this.$route?.query?.key
                return this.db.getItem(key).then(res => {
                    this.post = res
                    this.loading = false
                })
            } else {
                // 加载文章
                if (this.$route.params.id) {
                    return pull(this.$route.params.id)
                        .then((res) => {
                            this.post = res.data.data;
                            return res.data.data;
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve();
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            }
        },
        async autoSave() {
            let key = ''
            try {
                if (!this.id) {
                    await this.publish('draft', false)
                    key = this.post.post_type + '_' + this.id
                }
            } catch(err) {
                key = this.post.post_type + '_temp-' + new Date().getTime()
            } finally {
                autoSave(this, key, this.post)
            }
        },

        async useDraft() {
            await this.$alert('是否使用该版本发布？', '确认信息', {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action === 'confirm') {
                        this.publish('publish', true)
                    }
                }
            })
        }
    },
    beforeDestroy() {
        if (!this.isDraft) {
            clearInterval(this.localTimer)
        }
    }
}