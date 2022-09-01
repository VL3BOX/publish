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
                        <el-radio  :label="0">免费</el-radio>
                        <el-radio :label="1">盒币</el-radio>
                        <el-radio :label="2">金箔</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="价格" v-if="!!post.price_type">
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
                    <paid-attachment :body="post.body_type"></paid-attachment>
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

            <!-- 附加 -->
            <!-- <div class="m-publish-append">
                <el-divider content-position="left">附加</el-divider>
                <publish-excerpt v-model="post.post_excerpt"></publish-excerpt>
                <publish-collection v-model="post.post_collection"></publish-collection>
            </div>-->

            <!-- 扩展 -->
            <!-- <div class="m-publish-extend">
                <el-divider content-position="left">
                    <span class="u-toggle" @click="toggleSetting"><i :class="setting ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i> 设置</span>
                </el-divider>
                <div v-show="setting">
                    <publish-comment v-model="post.comment"></publish-comment>
                    <publish-visible v-model="post.visible"></publish-visible>
                </div>
            </div> -->

            <!-- 其它 -->
            <!-- <div class="m-publish-other">
                <publish-banner v-model="post.post_banner"></publish-banner>
            </div>-->

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
import publishHeader from "@/components/publish_header.vue";
import publishTitle from "@/components/publish_title.vue";
import publishOriginal from "@/components/publish_original.vue";
import publishClient from "@/components/publish_client.vue";
import paidAttachment from "@/components/paid_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish_banner.vue";
export default {
    name: 'face',
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        publishClient,
        paidAttachment,
        UploadAlbum,
        publishBanner
    },
    data() {
        return {
            post: {
                // 用户信息
                original: "", // 是否原创
                author_name: "", // 原作者名称
                author_link: "", // 原作者链接
                // 作品信息
                title: "", // 标题
                remark: "", // 描述
                banner: "", // 海报图
                // 数据信息
                client: "", // 客户端
                body_type: 2, // 体型
                data: "", // 解析lua的json数据
                file: "", // 关联的附件表uuid
                // 作者扩展
                cover: "", // 封面
                images: [], // 图片列表
                related: [], // 相关作品
                // 价格
                price_type: 0, // 价格类型 0:免费 1:盒币 2:金箔
                price_count: "" // 数量

            },

            loading: false,
            processing: false
        }
    }
}
</script>
