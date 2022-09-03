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
                <template v-if="post.original">
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
                        :max="10000"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="体型">
                    <el-radio-group v-model="post.body_type">
                        <el-radio :label="body_type" v-for="(body_label, body_type) in bodyMap" :key="body_type">{{
                            body_label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="数据">
                    <face-attachment :body="post.body_type" @update:data="handleFaceChange"></face-attachment>
                </el-form-item>

                <el-form-item label="描述">
                    <publish-title v-model="post.remark" :hideDiv="true" placeholder="请填写描述"></publish-title>
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
                <!-- <el-button type="plain" @click="publish('draft',false)" :disabled="processing">保存为草稿</el-button> -->
            </div>
        </el-form>
    </div>
</template>

<script>
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
                original: 0, // 是否原创
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

            fileId: 4, // 附件id
            postId: "", // 帖子id
            postType: "face", // 帖子类型
            bodyMap,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.id && this.getData();
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
        handleFaceChange({ json, uuid, id }) {
            this.post.data = json || "";
            this.post.file = uuid || "";
            this.fileId = id || "";
        },
        publish() {
            this.processing = true;
            const data = {
                ...this.post,
                images: this.post.images.map((item) => item.url || item),
            };
            if (this.id) {
                updateFace(this.id, data).then((res) => {
                    this.processing = false;
                    this.$message.success("修改成功");
                    this.afterPublish(this.id).finally(() => {
                        this.processing = false;
                        // 跳转
                        setTimeout(() => {
                            location.href = getLink(this.postType, this.id);
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
                            location.href = getLink(this.postType, res.data.data.id);
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face.less";
</style>
