<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <pubheader :name="name" :localDraft="localDraft"
            ><slot name="header"></slot
        ></pubheader>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <post_title :title="post.post_title"
                ><slot name="title"></slot
            ></post_title>

            <!-- 栏目特定字段 -->
            <div class="m-publish-info" v-if="infoEnable">
                <el-divider content-position="left">信息</el-divider>
                <slot></slot>
            </div>

            <!-- 正文之前 -->
            <div class="m-publish-prepend" v-show="contentEnable">
                <el-divider content-position="left">正文</el-divider>
                <slot name="prepend"></slot>
            </div>

            <!-- 正文区域 -->
            <div class="m-publish-content" v-show="contentEnable">
                <Tinymce
                    v-model="post.post_content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    v-show="mode == 'tinymce'"
                    @update="updateContent"
                />
            </div>

            <!-- 正文之后 -->
            <div class="m-publish-append" v-if="tagEnable || excerptEnable || collectionEnable">
                <el-divider content-position="left">附加</el-divider>
                <post_tag :tags="post.post_tags" v-if="tagEnable"></post_tag>
                <post_excerpt :excerpt="post.post_excerpt" v-if="excerptEnable"></post_excerpt>
                <post_collection v-model="post.post_collection" v-if="collectionEnable"></post_collection>
                <slot name="append"></slot>
            </div>

            <!-- 扩展功能 -->
            <div class="m-publish-extend" v-if="notifyEnable">
                <el-divider content-position="left">扩展</el-divider>
                <post_notify :notify="extend" />
                <slot name="extend"></slot>
            </div>

            <!-- 海报 -->
            <div class="m-publish-admin" v-if="bannerEnable">
                <el-divider content-position="left">海报</el-divider>
                <post_banner :banner="post.post_banner" />
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button
                    type="primary"
                    @click="publish"
                    :disabled="processing"
                    >{{ publish_text || "发 &nbsp;&nbsp; 布" }}</el-button
                >
                <el-button type="plain" @click="draft" :disabled="processing">{{
                    draft_text || "保存为草稿"
                }}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import pubheader from "./pubheader.vue";
import upload from "./upload.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
// import tinymce from "./tinymce.vue";
import markdown from "./markdown.vue";
import post_title from "./post_title.vue";
import post_excerpt from "./post_excerpt.vue";
import post_tag from "./post_tag.vue";
import post_notify from "./post_notify.vue";
import post_banner from "./post_banner.vue";
import post_collection from "./post_collection.vue";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "boilerplate",
    props: [
        "name",
        "type",
        "post",
        "meta",
        "extend",

        "localDraft",
        "infoEnable",
        "contentEnable",
        "markdownEnable",
        "excerptEnable",
        "tagEnable",
        "notifyEnable",
        "bannerEnable",
        "collectionEnable",

        "publish_text",
        "draft_text",
    ],
    data: function() {
        return {
            mode: this.post.post_mode || "tinymce",
            draft_key: "",
            isAdmin: User.getInfo().group > 30,
            
        };
    },
    computed: {
        processing:function (){
            return this.$store.state.processing
        }
    },
    watch: {
        // 修改本地字段时
        "post.post_meta": {
            handler: function(val) {
                this.$store.commit("editPostMeta", val);
            },
            deep: true,
        },
        meta: {
            handler: function(val) {
                this.$store.commit("editMeta", val);
            },
            deep: true,
        },
        // 编辑模式切换
        mode: function(val) {
            this.$store.commit("changeMode", val);
        },
    },
    methods: {
        publish: function() {
            this.$store.commit("changeStatus", "publish");
            this.$emit("publish");
            this.$store.commit('startProcess')
        },
        draft: function() {
            this.$store.commit("changeStatus", "draft");
            this.$emit("draft");
            this.$store.commit('startProcess')
        },
        updateContent: function(val) {
            this.$store.commit("editContent", val);
        },
    },
    mounted: function() {
        // this.draft_key = new Date().toUTCString();
        this.$store.commit("changeType", this.type);
        this.$store.commit("changeSubtype", this.post.post_subtype);
    },
    components: {
        pubheader,
        // upload,
        // tinymce,
        // markdown,
        Tinymce,
        post_title,
        post_tag,
        post_excerpt,
        post_notify,
        post_banner,
        post_collection
    },
};
</script>

<style lang="less">
.m-publish-box {
    padding: 30px 40px;
    .el-divider__text {
        color: #888;
        font-weight: 300;
    }
}
@media screen and (max-width: @ipad) {
    .m-publish-box {
        padding: 20px;
    }
}

@media screen and (max-width: @phone) {
    .el-form-item__label {
        float: none;
    }
    .el-form-item__content {
        margin-left: 0 !important;
    }
}

.m-publish-prepend {
    .mb(10px);
    .u-editor-mode {
        .clearfix;
        .fr;
    }
    .clearfix;
}
@media screen and (max-width: @ip5) {
    .m-publish-prepend {
        .u-editor-mode {
            float: none;
            .mb(10px);
        }
    }
}

.m-publish-buttons {
    padding: 40px 0;
    .x;

    button {
        .w(120px);
    }
}
</style>
