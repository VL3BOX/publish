<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header :name="name">
            <slot name="header"></slot>
        </publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title">
                <slot name="title"></slot>
            </publish-title>

            <!-- 栏目特定字段 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <!-- 客户端 -->
                <publish-client v-model="post.client"></publish-client>
                <slot></slot>
            </div>

            <!-- 正文之前 -->
            <div class="m-publish-prepend">
                <el-divider content-position="left">正文</el-divider>
                <slot name="prepend"></slot>
            </div>

            <!-- 正文区域 -->
            <div class="m-publish-content">
                <Tinymce
                    v-model="post.post_content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    v-show="mode == 'tinymce'"
                />
            </div>

            <!-- 正文之后 -->
            <div class="m-publish-append">
                <el-divider content-position="left">附加</el-divider>
                <slot name="append"></slot>
            </div>

            <!-- 扩展功能 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">扩展</el-divider>
                <slot name="extend"></slot>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <slot name="buttons"></slot>
            </div>
        </el-form>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import publish_header from "./publish_header.vue";
import publish_title from "./publish_title.vue";
import publish_original from "./publish_original.vue";
import publish_client from "./publish_client.vue";

export default {
    name: "boilerplate",
    components: {
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        "publish-client": publish_client,
        Tinymce,
    },
    props: ["name", "post", "type"],
    data: function () {
        return {
            mode: this.post.post_mode || "tinymce",
        };
    },
    watch: {
        post: {
            deep: true,
            handler: function (val) {
                this.$store.state.post = val;
            },
        },
    },
    methods: {
        publish: function () {
            this.$store.commit("changeStatus", "publish");
            this.$emit("publish");
            this.$store.commit("startProcess");
        },
        draft: function () {
            this.$store.commit("changeStatus", "draft");
            this.$emit("draft");
            this.$store.commit("startProcess");
        },
    },
    mounted: function () {
        // this.draft_key = new Date().toUTCString();
        this.$store.commit("changeType", this.type);
        this.$store.commit("changeSubtype", this.post.post_subtype);
    },
};
</script>

<style lang="less">
@import "../assets/css/boilerplate.less";
</style>