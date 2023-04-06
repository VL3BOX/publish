<template>
    <div class="m-publish-box p-publish-macro" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="云端宏">
            <publish-revision :enable="true" :post-id="id"></publish-revision>
        </publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <!-- 客户端 -->
                <!-- <publish-client v-model="post.client" :forbidAll="true"></publish-client> -->
                <!-- 语言：简体/繁体 -->
                <publish-lang v-model="post.lang"></publish-lang>
                <!-- 资料片 -->
                <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
                <!-- 心法 -->
                <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
            </div>

            <!-- 宏区域 -->
            <publish-macro v-model="post.post_meta" :client="post.client">
                <!-- 配装 -->
                <publish-pz v-model="post.pz" :limit="8" :query="pz_query">
                    <span class="u-pz-tip" slot="prepend">
                        <i class="el-icon-warning-outline"></i> 展示你推荐的配装（不超过8个，非必选）
                    </span>
                </publish-pz>
            </publish-macro>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">正文</el-divider>
                <el-radio-group class="m-publish-editormode" size="small" v-model="post.post_mode" >
                    <el-radio-button label="tinymce">可视化编辑器</el-radio-button>
                    <el-radio-button label="markdown">Markdown</el-radio-button>
                </el-radio-group>
                <Markdown v-model="post.post_content" :editable="true" :readOnly="false" v-show="post.post_mode == 'markdown'"></Markdown>
                <Tinymce v-model="post.post_content" :attachmentEnable="true" :resourceEnable="true" v-show="!post.post_mode || post.post_mode == 'tinymce'" />
            </div>

            <!-- 附加 -->
            <div class="m-publish-append">
                <el-divider content-position="left">小册</el-divider>
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

            <!-- 临时 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">临时</el-divider>
                <publish-at-authors></publish-at-authors>
            </div>

            <!-- 其它 -->
            <div class="m-publish-other" v-if="isSuperAuthor">
                <publish-banner v-model="post.post_banner"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <template v-if="isDraft || isRevision">
                    <el-button type="primary" @click="useDraft" :disabled="processing">使用此版本</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="publish('publish', true)" :disabled="processing">发 &nbsp;&nbsp; 布</el-button>
                    <el-button type="plain" @click="publish('draft', false)" :disabled="processing">保存为草稿</el-button>
                </template>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import lodash from "lodash";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import User from "@jx3box/jx3box-common/js/user.js";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import Markdown from "@jx3box/jx3box-editor/src/Markdown";
import publish_header from "@/components/publish_header.vue";
import publish_title from "@/components/publish_title.vue";
import publish_original from "@/components/publish_original.vue";
import publish_client from "@/components/publish_client.vue";
import publish_lang from "@/components/publish_lang";
import publish_zlp from "@/components/publish_zlp";
import publish_xf from "@/components/publish_xf";
import publish_macro from "@/components/publish_macro";
import publish_collection from "@/components/publish_collection";
import publish_collection_collapse from "@/components/publish_collection_collapse";
import publish_banner from "@/components/publish_banner";
import publish_comment from "@/components/publish_comment";
import publish_visible from "@/components/publish_visible";
import publish_authors from "@/components/publish_authors";
import publish_pz from "@/components/publish_pz";
import publish_revision from '@/components/publish_revision.vue'
import publish_at_authors from '@/components/publish_at_authors.vue'

// 数据逻辑
import { push, pull } from "@/service/cms.js";
import { syncRedis } from "@/service/macro.js";
import { appendToCollection } from "@/service/collection.js";
import { AutoSaveMixin } from "@/utils/autoSaveMixin";
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";

export default {
    name: "macro",
    mixins: [AutoSaveMixin, cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        Markdown,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        // "publish-client": publish_client,
        "publish-lang": publish_lang,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
        "publish-macro": publish_macro,
        "publish-collection": publish_collection,
        "publish-collection-collapse": publish_collection_collapse,
        "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-visible": publish_visible,
        "publish-authors": publish_authors,
        "publish-pz": publish_pz,
        'publish-revision' : publish_revision,
        'publish-at-authors': publish_at_authors
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
                // 关联的配装
                pz: [],
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
        };
    },
    computed: {
        id: function () {
            return this.isRevision ? ~~this.post.post_id : ~~this.post.ID;
        },
        data: function () {
            if (this.id) {
                return [this.id, this.post];
            } else {
                return [this.post];
            }
        },
        pz_query: function () {
            let mount_id = xfmap[this.post.post_subtype]?.id;
            let _query = {};
            if (mount_id) _query = { mount: mount_id };
            return _query;
        },
        isSuperAuthor() {
            return User.isSuperAuthor();
        }
    },
    methods: {
        // 初始化
        init: function() {
            sessionStorage.removeItem("atAuthor")
            // 尝试加载
            return this.loadData().then(() => {
                // 加载成功后执行自动保存逻辑（含本地草稿、本地缓存、云端历史版本）
                this.autoSave();
            });
        },
        // 宏数据验证
        checkMacro: function () {
            let data = this.post.post_meta.data;
            let result = true;
            data.forEach((item, index) => {
                if (!item.name) {
                    this.$message.error(`${index+1}号位 宏名称不能为空`);
                    result = false;
                }
            });
            return result;
        },
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;

            // 验证
            if (!this.checkMacro()) {
                this.processing = false;
                return;
            }

            // 补充心法id
            this.build();

            return push(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    syncRedis(result).catch((err) => {
                        console.log("[Redis同步作业失败]", err);
                    });
                    this.atUser(result.ID)
                    return result;
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
        // 搜索扩展
        build: function () {
            this.post.meta_2 =
                ~~lodash.get(xfmap[this.post.post_subtype], "id") || 0;
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
        // this.init().then((data) => {
        //     if (!data) return;

        //     // 迁移兼容
        //     if (!this.post.zlp && data.meta_1) {
        //         this.post.zlp = data.meta_1;
        //     }
        //     if (!this.post.lang && data.meta_4) {
        //         this.post.lang = data.meta_4;
        //     }
        // });
    },
};
</script>

<style lang="less">
@import "../assets/css/macro.less";
</style>
