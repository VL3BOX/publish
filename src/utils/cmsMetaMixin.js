import {setCommentConfig, getCommentConfig, setCommentVisible} from "@/service/next"
export const cmsMetaMixin = {
    data: function() {
        return {
            hasRead: 0,

            open_white_list: 0,
            visible_for_self: 0,
        };
    },
    mounted: function() {
        this.initExtend();
    },
    methods: {
        initExtend() {
            // 从localStorage中获取hasRead
            this.hasRead = ~~localStorage.getItem("jx3box_has_read") || 0;
        },
        setHasRead() {
            // 设置hasRead
            localStorage.setItem("jx3box_has_read", this.hasRead);
        },
        loadCommentConfig(category, id) {
            getCommentConfig(category, id).then((res) => {
                this.open_white_list = res.data.data?.open_white_list || 0;
                this.visible_for_self = res.data.data?.visible_for_self || 0;
            });
        },
        setCommentConfig(category, id) {
            setCommentConfig(category, id, this.open_white_list ? 'open': 'close');
            setCommentVisible(category, id, this.visible_for_self ? 'open': 'close');
        },
    },
    created: function() {
        // 根据访问域名设置默认客户端版本
        this.post.client = this.$store.state.client;
    },
    watch: {
        $route: {
            immediate: true,
            deep: true,
            handler() {
                this.init();
            },
        },
        // 当为一个新作品时，根据用户偏好修改默认编辑器
        "$store.state.user_conf.editor_mode": {
            immediate : true,
            handler : function(mode) {
                if (!this.id) {
                    this.post.post_mode = mode || "tinymce";
                }
            },
        }
    },
};
