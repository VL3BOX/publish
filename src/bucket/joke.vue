<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">我的骚话</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布骚话
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bucket_joke',
    data: () => ({
        jokes: []
    }),
    methods: {
        getJokes() {
            
        }
    },
    computed: {
        publishLink: function () {
            return "./#/" + "joke";
        },
    }
}
</script>

<style lang="less" scoped>
@import "../assets/css/work.less";
</style>