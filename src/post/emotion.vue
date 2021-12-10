<template>
    <div class="m-publish-box m-publish-box-emotion" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="剑三表情"></publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 编辑 -->
            <div class="m-publish-emotion m-publish-emotion-edit" v-if="id">
                <el-form-item label="图片">
                    <div class="u-pic">
                        <img class="u-img" :src="data.url | showThumbnail" />
                        <i class="u-mask"></i>
                        <i class="u-preview" @click="previewHandle(data)">
                            <i class="el-icon-zoom-in"></i>
                        </i>
                        <!-- TODO:替换图片 -->
                    </div>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="data.desc" placeholder="图片说明"></el-input>
                </el-form-item>
                <el-form-item label="原创">
                    <el-switch v-model.number="data.original" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="原作者">
                    <el-input v-model="data.author" placeholder="（非必填）"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <div class="m-publish-buttons">
                    <el-button
                        type="primary"
                        @click="update"
                        :disabled="processing"
                    >更 &nbsp;&nbsp; 新</el-button>
                </div>
            </div>

            <!-- 新建 -->
            <div class="m-publish-emotion m-publish-emotion-create" v-else>
                <!-- 上传 -->
                <div class="m-publish-emotion-bulk">
                    <h1 class="u-title">上传表情</h1>
                    <UploadImages
                        @insert="updateFileList"
                        text="批量上传图片"
                        :onlyImage="true"
                        desc="一次最多同时上传10个文件（不超过5M）"
                        :accept="supportTypes"
                    />
                </div>

                <!-- 列表 -->
                <div class="m-publish-emotion-list" v-if="list && list.length">
                    <div class="u-list">
                        <div class="u-item" v-for="(item,i) in list" :key="i">
                            <div class="u-div">
                                <i class="u-order">{{i + 1}}</i>
                                <div class="u-op">
                                    <el-button
                                        class="u-delete"
                                        icon="el-icon-delete"
                                        @click="deleteHandle(i)"
                                        type="info"
                                        size="mini"
                                    >删除</el-button>
                                </div>
                            </div>
                            <div class="u-pic">
                                <img class="u-img" :src="item.url | showThumbnail" />
                                <i class="u-mask"></i>
                                <i class="u-preview" @click="previewHandle(item)">
                                    <i class="el-icon-zoom-in"></i>
                                </i>
                            </div>
                            <div class="u-desc">
                                <el-input v-model="item.desc" placeholder="图片说明">
                                    <span slot="prepend">描述</span>
                                </el-input>
                            </div>
                            <div class="u-extend">
                                <el-switch
                                    v-model.number="item.original"
                                    inactive-text="原创"
                                    :active-value="1"
                                    :inactive-value="0"
                                ></el-switch>
                                <el-input
                                    class="u-author"
                                    v-model="item.author"
                                    placeholder="（非必填）"
                                    v-if="!item.original"
                                    size="mini"
                                >
                                    <span slot="prepend">原作者</span>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <!-- 按钮 -->
                    <div class="m-publish-buttons">
                        <el-button
                            type="primary"
                            @click="publish"
                            :disabled="processing"
                        >发 &nbsp;&nbsp; 布</el-button>
                    </div>
                </div>

                <!-- 预览 -->
                <el-dialog class="m-publish-emotion-preview" :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import { getLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";

// 本地模块
import publish_header from "@/components/publish_header.vue";
import UploadImages from "@jx3box/jx3box-editor/src/Upload.vue";

// 数据逻辑
import { postEmotions, getEmotion, updateEmotion } from "@/service/pvx.js";

export default {
    name: "emotion",
    components: {
        UploadImages,
        "publish-header": publish_header,
    },
    data: function () {
        return {
            // 加载状态
            loading: false,
            // 发布状态
            processing: false,

            // 图片类型
            supportTypes:
                "image/png, image/jpeg, image/gif, image/bmp, image/webp",

            // 图片列表
            list: [
                // {
                //     desc: "test",
                //     url: "https://console.cnyixun.com/2019/09/logo.png",
                //     original: 0,
                //     author: "",
                // },
                // {
                //     desc: "test",
                //     url: "https://console.cnyixun.com/2019/09/logo.png",
                //     original: 0,
                //     author: "",
                // },
            ],
            data: {
                // desc: "test",
                // url: "https://console.cnyixun.com/2019/09/logo.png",
                // original: 0,
                // author: "111",
            },

            // 预览
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
    },
    methods: {
        // 加载
        init: function () {
            this.loading = true;
            getEmotion(this.id)
                .then((res) => {
                    this.data = res?.data?.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 批量上传成功
        updateFileList: function (data) {
            let upload_list = data.list;
            let img_list = [];
            upload_list.forEach((item) => {
                if (item.is_img) {
                    img_list.push({
                        desc: item.name,
                        url: item.url,
                        original: 0,
                        author: "",
                    });
                }
            });
            this.list = this.list.concat(img_list);
        },
        // 预览
        previewHandle: function (item) {
            this.dialogImageUrl = item.url;
            this.dialogVisible = true;
        },
        // 删除
        deleteHandle: function (i) {
            this.list.splice(i, 1);
        },
        // 发布
        publish: function () {
            this.processing = true;
            postEmotions(this.list).then((res) => {
                this.$message({
                    message: "发布成功",
                    type: "success",
                });
                // 跳转
                setTimeout(() => {
                    location.href = getLink("emotion");
                }, 500);
            }).finally(() => {
                this.processing = false
            })
        },
        // 更新
        update: function () {
            this.processing = true;
            updateEmotion(this.id, this.data).then((res) => {
                this.$message({
                    message: "更新成功",
                    type: "success",
                });
                // 跳转
                setTimeout(() => {
                    location.href = getLink("emotion", this.id);
                }, 500);
            }).finally(() => {
                this.processing = false
            })
        },
    },
    watch: {
        "$route.params.id": {
            immediate: true,
            handler: function (val) {
                val && this.init();
            },
        },
    },
    filters: {
        showThumbnail: function (val) {
            return getThumbnail(val, 146);
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/emotion.less";
</style>
