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

                <el-form-item label="价格类型">
                    <el-radio-group v-model="post.price_type">
                        <el-radio  label="0">免费</el-radio>
                        <el-radio label="1">盒币</el-radio>
                        <el-radio label="2">金箔</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="价格" v-if="post.price_type  != '0'">
                    <el-input-number v-model="post.price_count"></el-input-number>
                </el-form-item>

                <el-form-item label="体型">
                    <el-radio-group v-model="post.body_type">
                        <el-radio :label="1">成男</el-radio>
                        <el-radio :label="2">成女</el-radio>
                        <el-radio :label="5">正太</el-radio>
                        <el-radio :label="6">小女孩</el-radio>
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
                <publish-banner v-model="post.banner"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button
                    type="primary"
                    @click="publish"
                    :disabled="processing"
                >发 &nbsp;&nbsp; 布</el-button>
                <!-- <el-button type="plain" @click="publish('draft',false)" :disabled="processing">保存为草稿</el-button> -->
            </div>
        </el-form>
    </div>
</template>

<script>
import { attachmentRelatePost, addFace, getFace } from "@/service/face";
import publishHeader from "@/components/publish_header.vue";
import publishTitle from "@/components/publish_title.vue";
import publishOriginal from "@/components/publish_original.vue";
import publishClient from "@/components/publish_client.vue";
import faceAttachment from "@/components/face_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish_banner.vue";
export default {
    name: 'face',
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        publishClient,
        faceAttachment,
        UploadAlbum,
        publishBanner
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
                body_type: 2, // 体型
                data: "{\"tBone\":{\"CHEEK_Y\":-32,\"CHEEK_Z\":-5,\"EYEBOW_DIRC\":42,\"EYEBOW_OUT\":46,\"EYEBOW_POS\":-56,\"EYECROW_Y\":-7,\"EYE_DIRC\":-42,\"EYE_DIST\":38,\"EYE_OPEN\":14,\"EYE_POS\":-18,\"EYE_SIZE\":18,\"FACE_SCALE\":-50,\"FACE_Y\":113,\"FACE_Z\":-57,\"JAW_END\":-39,\"JAW_LENGTH\":-14,\"JAW_POS\":-31,\"JAW_ROT\":-4,\"JAW_WIDTH\":-10,\"LOW_FACE\":23,\"LOW_LID_POS\":34,\"LOW_LIP\":-39,\"LOW_LIP_OUT\":-6,\"LOW_LIP_POS\":89,\"MOUTH_END\":4,\"MOUTH_END_L\":6,\"MOUTH_END_R\":6,\"MOUTH_OPEN\":-14,\"MOUTH_OUT\":-68,\"MOUTH_POS\":13,\"MOUTH_ROT\":0,\"MOUTH_SIZE\":-8,\"NOSEBOW_BEND\":55,\"NOSEBOW_WIDTH\":-78,\"NOSETOP_POS_Y\":14,\"NOSETOP_POS_Z\":-77,\"NOSETOP_UP\":62,\"NOSETOP_WIDTH\":-67,\"NOSE_HEIGHT\":-44,\"NOSE_SIZE\":-92,\"OUT\":-110,\"PUPIL_DIRC\":15,\"PUPIL_SIZE\":-63,\"RIDGE_Y\":-9,\"UP_FACE\":-107,\"UP_LID_POS\":18,\"UP_LIP\":-23,\"UP_LIP_OUT\":10,\"UP_LIP_POS\":25},\"nDecorationID\":0,\"tDecal\":{\"EYE_SHADOW_FLASH2\":{\"fValue1\":-1,\"nColorID\":0,\"fValue2\":-1,\"fValue3\":-1,\"nShowID\":0,\"bUse\":false},\"EYE_SHADOW1\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":0,\"fValue3\":-1,\"fValue2\":-1},\"LIP_LIGHT\":{\"fValue1\":-1,\"nColorID\":0,\"fValue2\":-1,\"fValue3\":-1,\"nShowID\":0,\"bUse\":false},\"BLUSHER_MOUSTACHE\":{\"fValue1\":-0.0099999997764826,\"nColorID\":0,\"fValue2\":-0.0099999997764826,\"fValue3\":-0.0099999997764826,\"nShowID\":0,\"bUse\":false},\"EYE_LINE\":{\"fValue1\":2,\"nColorID\":3,\"fValue2\":0.5,\"fValue3\":1,\"nShowID\":2,\"bUse\":true},\"EYE_SHADOW_FLASH1\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":0,\"fValue3\":-1,\"fValue2\":-1},\"DECAL\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":0,\"fValue3\":-1,\"fValue2\":-1},\"BROW\":{\"fValue1\":2,\"nColorID\":9,\"bUse\":true,\"nShowID\":25,\"fValue3\":1,\"fValue2\":0.55},\"EYE_LIGHT\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":7,\"fValue3\":-1,\"fValue2\":-1},\"LIP_FLASH\":{\"fValue1\":-1,\"nColorID\":0,\"fValue2\":-1,\"fValue3\":-1,\"nShowID\":0,\"bUse\":false},\"EYE_SHADOW4\":{\"fValue1\":-0.0099999997764826,\"nColorID\":0,\"fValue2\":-0.0099999997764826,\"fValue3\":-0.0099999997764826,\"nShowID\":0,\"bUse\":false},\"IRIS_RIGHT\":{\"fValue1\":2,\"nColorID\":2,\"fValue2\":0.6,\"fValue3\":1,\"nShowID\":4,\"bUse\":true},\"EYE_SHADOW\":{\"fValue1\":1,\"nColorID\":17,\"bUse\":true,\"nShowID\":2,\"fValue3\":1,\"fValue2\":0.4},\"IRIS_LEFT\":{\"fValue1\":2,\"nColorID\":2,\"bUse\":true,\"nShowID\":4,\"fValue3\":1,\"fValue2\":0.6},\"EYE_SHADOW2\":{\"fValue1\":1,\"nColorID\":20,\"fValue2\":0.7,\"fValue3\":0,\"nShowID\":15,\"bUse\":true},\"BASE\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":3,\"fValue3\":-1,\"fValue2\":-1},\"EYE_SHADOW_FLASH3\":{\"fValue1\":-0.0099999997764826,\"nColorID\":0,\"fValue2\":-0.0099999997764826,\"fValue3\":-0.0099999997764826,\"nShowID\":0,\"bUse\":false},\"LIP_GLOSS\":{\"fValue1\":1,\"nColorID\":4,\"fValue2\":0.7,\"fValue3\":0,\"nShowID\":8,\"bUse\":true},\"EYE_SHADOW_FLASH4\":{\"fValue1\":-0.0099999997764826,\"nColorID\":0,\"fValue2\":-0.0099999997764826,\"fValue3\":-0.0099999997764826,\"nShowID\":0,\"bUse\":false},\"EYE_SHADOW3\":{\"fValue1\":-1,\"nColorID\":0,\"bUse\":false,\"nShowID\":0,\"fValue3\":-1,\"fValue2\":-1},\"LIP_OVERLAP\":{\"fValue1\":-0.0099999997764826,\"nColorID\":0,\"fValue2\":-0.0099999997764826,\"fValue3\":-0.0099999997764826,\"nShowID\":0,\"bUse\":false}},\"nMajorVersion\":1,\"nRoleType\":1,\"nVersion\":5}", // 解析lua的json数据
                file: "d8a1319dbb424e47950339c42c6fd527", // 关联的附件表uuid
                // 作者扩展
                cover: "", // 封面
                images: [], // 图片列表
                related: [], // 相关作品
                // 价格
                price_type: "0", // 价格类型 0:免费 1:盒币 2:金箔
                price_count: 0 // 数量

            },

            loading: false,
            processing: false,

            fileId: "", // 附件id
            postId: "", // 帖子id
            postType: "face", // 帖子类型
        }
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
            getFace(this.id).then(res => {
                this.post = res.data.data;
                this.loading = false;
            });
        },
        handleFaceChange({ json, uuid, id }) {
            this.post.data = json || '';
            this.post.file = uuid || '';
            this.fileId = id || '';
        },
        publish() {
            this.processing = true;
            addFace(this.post).then(res => {
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
        },
        afterPublish(id) {
            if (!this.fileId) {
                return Promise.resolve();
            }
            return attachmentRelatePost(this.fileId, this.postType, id)
        },
    }
}
</script>
