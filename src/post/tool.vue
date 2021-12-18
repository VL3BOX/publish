<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="教程工具"></publish-header>

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
                <!-- 类型 -->
                <publish-subtype v-model="post.post_subtype" :options="tool_types"></publish-subtype>
            </div>

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
                <el-divider content-position="left">摘要</el-divider>
                <publish-excerpt v-model="post.post_excerpt"></publish-excerpt>
            </div>
            <div class="m-publish-append">
                <el-divider content-position="left">合集</el-divider>
                <publish-collection
                    v-model="post.post_collection"
                    :defaultCollapse="post.collection_collapse"
                >
                    <publish-collection-collapse v-model="post.collection_collapse"></publish-collection-collapse>
                </publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <publish-comment v-model="post.comment"></publish-comment>
                <publish-visible v-model="post.visible"></publish-visible>
                <publish-authors :id="id" :uid="post.post_author"></publish-authors>
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
import { getLink } from "@jx3box/jx3box-common/js/utils";
import tool_types from "@/assets/data/tool.json";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import publish_header from "@/components/publish_header.vue";
import publish_title from "@/components/publish_title.vue";
import publish_original from "@/components/publish_original.vue";
import publish_client from "@/components/publish_client.vue";
import publish_collection from "@/components/publish_collection";
import publish_collection_collapse from "@/components/publish_collection_collapse";
import publish_excerpt from "@/components/publish_excerpt";
import publish_banner from "@/components/publish_banner";
import publish_comment from "@/components/publish_comment";
import publish_visible from "@/components/publish_visible";
import publish_subtype from "@/components/publish_subtype";
import publish_authors from "@/components/publish_authors";

// 数据逻辑
import { push, pull } from "@/service/cms.js";
import { appendToCollection } from "@/service/collection.js";
import {AutoSaveMixin} from "@/utils/autoSaveMixin";

export default {
    name: "bps",
    mixins: [AutoSaveMixin],
    components: {
        Tinymce,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        "publish-client": publish_client,
        "publish-excerpt": publish_excerpt,
        "publish-collection": publish_collection,
        "publish-collection-collapse": publish_collection_collapse,
        "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-visible": publish_visible,
        "publish-subtype": publish_subtype,
        "publish-authors": publish_authors,
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
                post_type: "tool",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "1",
                // 自定义字段
                post_meta: {},
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
                collection_collapse: 0,

                // 评论开关（0开启|默认，1关闭）
                comment: 0,

                // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
                visible: 0,
            },

            // 选项
            tool_types,
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
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;
            return push(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    return result
                })
                .then((result) => {
                    this.afterPublish(result).finally(() => {
                        this.done(skip, result);
                    });
                })
                .finally(() => {
                    this.processing = false;
                });
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
        // 跳转前操作
        afterPublish: function (result) {
            if (!~~result.post_collection)
                return new Promise((resolve, reject) => {
                    resolve(true);
                });
            return appendToCollection({
                post_type: result.post_type,
                post_id: result.ID,
                post_collection: result.post_collection,
                post_title: result.post_title,
            });
        },
    },
    created: function () {
        this.post.client = this.$store.state.client;
        this.init();
    },
    watch: {
        "$route.params.id": function (val) {
            val && this.init();
        },
    },
};
</script>
