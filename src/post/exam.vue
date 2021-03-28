<template>
    <div class="m-publish-box m-publish-exam">
        <!-- 头部 -->
        <publish-header name="趣味题库" :localDraft="false"
            ><slot name="header"></slot
        ></publish-header>

        <div class="m-publish-exam-index">
            <el-card class="box-card">
                <router-link class="u-item" to="/exam/question">
                    <i class="el-icon-s-opportunity"></i>
                    <b>贡献题目</b>
                    <span>自定义一个任意类型的题目</span>
                </router-link>
            </el-card>
            <el-card class="box-card">
                <router-link class="u-item" to="/exam/paper">
                    <i class="el-icon-s-order"></i>
                    <b>制作试卷</b>
                    <span>从题库中选择10个题目组成一张试卷</span>
                </router-link>
            </el-card>
        </div>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
export default {
    name: "exam",
    props: [],
    data: function() {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {
        'publish-header':header,
    },
};
</script>

<style lang="less">
@import "../assets/css/exam.less";
</style>
