<template>
    <div class="m-publish-box">
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
                    v-show="post.post_mode == 'tinymce'"
                />
            </div>

            <!-- 附加 -->
            <div class="m-publish-append">
                <el-divider content-position="left">附加</el-divider>
                <publish-collection v-model="post.post_collection"></publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">扩展</el-divider>
            </div>

            <!-- 其它 -->
            <div class="m-publish-other">
                <publish-banner v-model="post.post_banner"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons"></div>
        </el-form>
    </div>
</template>

<script>
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

// 数据逻辑
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
    },
    props: [],
    data: function () {
        return {
            post: {
                // 文章ID
                ID: "", 
                // 状态：publish公开、private私有、draft草稿、dustbin删除
                post_status: "",
                // 类型
                post_type: "macro",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "通用",
                // 自定义字段
                post_meta: '',
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
            },
        };
    },
    computed: {},
    methods: {
        // 加载
        init: function () {
            return this.doLoad(this).then(() => {
                
                console.log("Init Post:", this.post);
            });
        },
        // 发布
        toPublish: function () {
            this.postData();
        },
        // 草稿
        toDraft: function () {
            this.postData();
        },
        // 提交
        postData: function () {
            this.check();
            this.doPublish(this.build(), this, false).then((res) => {
                syncRedis(res.data.data, this).then((redis_result) => {
                    this.finish(res.data.msg, res.data.data.ID);
                });
            });
        },
        // 跳转
        finish: function (msg, id) {
            this.$message({
                message: msg,
                type: "success",
            });
            setTimeout(() => {
                location.href = "/" + this.type + "/" + id;
            }, 500);
        },

        // 设置检索meta
        build: function () {
            let data = this.$store.state;
            // data.post.meta_1 = data.post.post_meta.zlp; //资料片
            // data.post.meta_2 = ~~lodash.get(
            //     xfmap[data.post.post_subtype],
            //     "id"
            // ); //心法id
            // data.post.meta_4 = data.post.post_meta.lang; //语言
            return data;
        },
    },
    mounted: function () {
        // 初始化默认文章数据
        this.init();
    },
};
</script>

<style lang="less">
@import "../assets/css/macro.less";
</style>
