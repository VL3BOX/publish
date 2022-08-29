<template>
    <div class="m-publish-box m-publish-box-face" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="捏脸分享"></publish-header>

        <el-form label-position="left" label-width="80px">

            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>
            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 客户端 -->
                <publish-client v-model="post.client" :forbidAll="true"></publish-client>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <template v-if="post.original !== '' && !post.original">
                    <el-form-item label="原作者名称">
                        <el-input v-model="form.author_name" placeholder="输入原作者名称"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="描述">
                    <publish-title v-model="post.remark" :hideDiv="true" placeholder="请填写描述"></publish-title>
                </el-form-item>
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
export default {
    name: 'face',
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        publishClient,
    },
    data() {
        return {
            post: {
                // 用户信息
                original: "",
                author_name: "",
                author_link: "",
                // 作品信息
                title: "",
                remark: "",
                client: "",
            },

            loading: false,
            processing: false
        }
    }
}
</script>
