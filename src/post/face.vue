<template>
    <div class="m-publish-box m-publish-box-face" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="捏脸分享"></publish-header>

        <el-form label-position="left" label-width="90px">
            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>
            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 客户端 -->
                <publish-client v-model="post.client" :forbidAll="true"></publish-client>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <template v-if="!post.original">
                    <el-form-item label="原作者名称" prop="author_name">
                        <el-input v-model="post.author_name" placeholder="输入原作者名称"></el-input>
                    </el-form-item>
                    <el-form-item label="原作者链接" prop="author_link">
                        <el-input v-model="post.author_link" placeholder="输入原作者链接"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="价格">
                    <el-radio-group v-model="post.price_type">
                        <el-radio label="0">免费</el-radio>
                        <!-- <el-radio label="1">盒币</el-radio> -->
                        <el-radio label="2">金箔</el-radio>
                    </el-radio-group>
                    <el-input-number
                        class="u-price"
                        v-model="post.price_count"
                        v-if="post.price_type != '0'"
                        size="small"
                        :max="3000"
                        :min="0"
                    ></el-input-number>
                    <div class="u-tip-box" v-if="post.price_type != '0' && post.price_count > 0">
                        <div class="u-warning">
                            <el-checkbox
                                v-model="promise"
                                disabled
                                >我承诺该上传属于自己的原创作品或已得到原作者授权，且相关信息中不带有非授权的元素（比如贴图、字体）等，若违反法律规定我将承担全部责任，魔盒有权下架作品。</el-checkbox
                            >
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="体型">
                    <el-radio-group v-model="post.body_type">
                        <el-radio :label="~~body_type" v-for="(body_label, body_type) in bodyMap" :key="body_type">{{
                            body_label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="数据">
                    <face-attachment v-if="!post.file" :body="post.body_type" @update:data="handleFaceChange" />
                    <div class="u-attachment" v-else>
                        <span class="u-attachment-text">当前数据唯一标识符：<b>{{ post.file }}</b></span>
                        <el-button type="primary" icon="el-icon-delete" circle @click="removeFile" size="mini"/>
                    </div>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="post.remark" placeholder="请填写描述" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-divider content-position="left">扩展</el-divider>
                <el-form-item label="图片列表">
                    <UploadAlbum v-model="post.images"></UploadAlbum>
                </el-form-item>
                <!-- TODO: 关联作品 -->
                <!-- <el-form-item label="关联作品"></el-form-item> -->
                <publish-banner v-model="post.banner"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button type="primary" @click="publish" :disabled="processing">发 &nbsp;&nbsp; 布</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";

import { attachmentRelatePost, addFace, getFace, updateFace } from "@/service/face";
import publishHeader from "@/components/publish_header.vue";
import publishTitle from "@/components/publish_title.vue";
import publishOriginal from "@/components/publish_original.vue";
import publishClient from "@/components/publish_client.vue";
import faceAttachment from "@/components/face_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish_banner.vue";
import { bodyMap } from "@jx3box/jx3box-facedat/assets/data/index.json";
export default {
    name: "face",
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        publishClient,
        faceAttachment,
        UploadAlbum,
        publishBanner,
    },
    data() {
        return {
            post: {
                // 用户信息
                original: 1, // 是否原创
                author_name: "", // 原作者名称
                author_link: "", // 原作者链接
                // 作品信息
                title: "", // 标题
                remark: "", // 描述
                banner: "", // 海报图
                // 数据信息
                client: "std", // 客户端
                body_type: 1, // 体型
                data: "", // 解析lua的json数据
                file: "", // 关联的附件表uuid
                // 作者扩展
                cover: "", // 封面
                images: [], // 图片列表
                related: [], // 相关作品
                // 价格
                price_type: "0", // 价格类型 0:免费 1:盒币 2:金箔
                price_count: 0, // 数量
            },

            loading: false,
            processing: false,

            fileId: "", // 附件id
            postId: "", // 帖子id
            postType: "face", // 帖子类型
            bodyMap,
            promise: true,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        client() {
            return this.$store.state.client;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.id) {
                this.getData();
            } else {
                this.post.client = this.client;
            }
        },
        getData() {
            this.loading = true;
            getFace(this.id).then((res) => {
                this.post = res.data.data;
                this.post.images = this.post.images.map((item) => {
                    return {
                        name: item,
                        url: item,
                    };
                });
                this.loading = false;
            });
        },
        handleFaceChange({ json = "", uuid = "", id = "" }) {
            this.post.data = json;
            this.post.file = uuid;
            this.fileId = id;
        },
        validator() {
            // 必填字段 title file
            const required = ["title", "file"];
            const requiredMsg = ["请填写标题", "请上传数据"];
            let message;
            for (let i = 0; i < required.length; i++) {
                if (!this.post[required[i]]) {
                    message = requiredMsg[i];
                    break;
                }
            }
            if (message) {
                this.$message.warning(message);
                return false;
            }
            return true;
        },
        publish() {
            this.processing = true;
            const data = {
                ...this.post,
                images: this.post.images.map((item) => item.url || item),
            };
            if (!this.validator()) {
                this.processing = false;
                return;
            }
            if (this.id) {
                updateFace(this.id, data).then((res) => {
                    this.processing = false;
                    this.$message.success("修改成功");
                    this.afterPublish(this.id).finally(() => {
                        this.processing = false;
                        // 跳转
                        setTimeout(() => {
                            location.href = `/face/${this.id}`;
                        }, 500);
                    });
                });
            } else {
                addFace(data).then((res) => {
                    this.$message({
                        message: "发布成功",
                        type: "success",
                    });
                    this.afterPublish(res.data.data.id).finally(() => {
                        this.processing = false;
                        // 跳转
                        setTimeout(() => {
                            location.href = `/face/${res.data.data.id}`;
                        }, 500);
                    });
                });
            }
        },
        afterPublish(id) {
            if (!this.fileId) {
                return Promise.resolve();
            }
            return attachmentRelatePost(this.fileId, this.postType, id);
        },
        // 移除文件标识
        removeFile() {
            this.post.file = "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face.less";
</style>
