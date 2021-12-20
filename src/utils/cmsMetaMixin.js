export const cmsMetaMixin = {
    data: function() {
        return {};
    },

    methods: {},
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
