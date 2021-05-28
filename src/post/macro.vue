<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="云端宏"></publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <!-- 客户端 -->
                <publish-client v-model="post.client"></publish-client>
                <!-- 语言：简体/繁体 -->
                <publish-lang v-model="post.lang"></publish-lang>
                <!-- 资料片 -->
                <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
                <!-- 心法 -->
                <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
            </div>

            <!-- 宏区域 -->
            <publish-macro v-model="post.post_meta" :client="post.client"></publish-macro>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">正文</el-divider>
                <Tinymce
                    v-model="post.post_content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    v-show="!post.post_mode || post.post_mode == 'tinymce'"
                />
            </div>

            <!-- 附加 -->
            <div class="m-publish-append">
                <el-divider content-position="left">附加</el-divider>
                <publish-collection v-model="post.post_collection"></publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <publish-comment v-model="post.comment"></publish-comment>
                <publish-visible v-model="post.visible"></publish-visible>
            </div>

            <!-- 其它 -->
            <div class="m-publish-other">
                <publish-banner v-model="post.post_banner"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button
                    type="primary"
                    @click="publish('publish',true)"
                    :disabled="processing"
                >发 &nbsp;&nbsp; 布</el-button>
                <el-button type="plain" @click="publish('draft',false)" :disabled="processing">保存为草稿</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import lodash from "lodash";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import publish_header from "@/components/publish_header.vue";
import publish_title from "@/components/publish_title.vue";
import publish_original from "@/components/publish_original.vue";
import publish_client from "@/components/publish_client.vue";
import publish_lang from "@/components/publish_lang";
import publish_zlp from "@/components/publish_zlp";
import publish_xf from "@/components/publish_xf";
import publish_macro from "@/components/publish_macro";
import publish_collection from "@/components/publish_collection";
import publish_banner from "@/components/publish_banner";
import publish_comment from "@/components/publish_comment";
import publish_visible from "@/components/publish_visible";

// 数据逻辑
import { push, pull } from "@/service/cms.js";
import { syncRedis } from "@/service/macro.js";

export default {
    name: "macro",
    components: {
        Tinymce,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        "publish-client": publish_client,
        "publish-lang": publish_lang,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
        "publish-macro": publish_macro,
        "publish-collection": publish_collection,
        "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-visible": publish_visible,
    },
    data: function () {
        return {
            // 加载状态
            loading: false,
            // 发布状态
            processing: false,

            // 内容
            post: {
                // 文章ID
                ID: "",
                // 状态：publish公开、private私有、draft草稿、dustbin删除
                post_status: "publish",
                // 类型
                post_type: "macro",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "通用",
                // 自定义字段
                post_meta: {
                    data: [
                        {
                            name: "",
                            icon: 13,
                            talent: "",
                            macro: "",
                            speed: "",
                            equip: "",
                            equip_type: "jx3box",
                            desc: "",
                        },
                    ],
                },
                // 内容
                post_content: "",
                // 编辑模式(会影响文章详情页渲染规则)
                post_mode: "tinymce",

                // 是否原创
                original: 0,
                // 客户端：std正式服、origin怀旧服
                client: "std",
                // 语言：cn简体、tr繁体
                lang: "cn",
                // 资料片
                zlp: "",

                // 摘要
                post_excerpt: "",
                // 海报
                post_banner: "",
                // 小册
                post_collection: "",

                // 评论开关（0开启|默认，1关闭）
                comment: 0,

                // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
                visible: 0,
            },
        };
    },
    computed: {
        id: function () {
            return ~~this.post.ID;
        },
        data: function () {
            if (this.id) {
                return [this.id, this.post];
            } else {
                return [this.post];
            }
        },
    },
    methods: {
        // 加载
        init: function () {
            this.loading = true;
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
        },
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;

            // 补充心法id
            this.build();

            push(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    syncRedis(result).then((res) => {
                        this.done(skip, result);
                    });
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        build: function () {
            this.post.meta_2 = ~~lodash.get(xfmap[this.post.post_subtype], "id") || 0;
        },
        // 完成
        done: function (skip, result) {
            if (skip) {
                // 提醒
                this.$message({
                    message: "发布成功",
                    type: "success",
                });
                // 跳转
                setTimeout(() => {
                    location.href = getLink(result.post_type, result.ID);
                }, 500);
            } else {
                // 提醒
                this.$notify({
                    title: "保存成功",
                    message: "云端草稿保存成功",
                    type: "success",
                });
                // 路由
                this.post = result;
                if (!this.$route.params.id) {
                    this.$router.push({
                        params: {
                            id: result.ID,
                        },
                    });
                }
            }
        },
    },
    created: function () {
        this.post.client = this.$store.state.client;
        this.init().then((data) => {
            if (!data) return;

            // 迁移兼容
            if (!this.post.zlp && data.meta_1) {
                this.post.zlp = data.meta_1;
            }
            if (!this.post.lang && data.meta_4) {
                this.post.lang = data.meta_4;
            }
        });
    },
    watch: {
        "$route.params.id": function (val) {
            val && this.init();
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/macro.less";
</style>