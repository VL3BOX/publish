<template>
    <nav class="m-nav">
        <router-link class="m-nav-publish el-button el-button--primary" to="/">
            <i class="el-icon-s-home"></i>
            <span>创作</span>
        </router-link>
        <router-link class="m-nav-bucket el-button el-button--primary is-plain" to="/bucket">
            <img class="u-bucket" svg-inline src="../assets/img/bucket.svg" />
            <span>草稿</span>
        </router-link>

        <h5 class="u-title">独立创作</h5>
        <div class="m-nav-group">
            <router-link to="/macro">
                <i class="el-icon-collection"></i>
                <span>剑三宏</span>
            </router-link>
            <router-link to="/jx3dat">
                <i class="el-icon-collection"></i>
                <span>插件数据</span>
            </router-link>
            <router-link to="/fb">
                <i class="el-icon-collection"></i>
                <span>副本攻略</span>
            </router-link>
            <router-link to="/bps">
                <i class="el-icon-collection"></i>
                <span>职业攻略</span>
            </router-link>
            <router-link to="/tool">
                <i class="el-icon-collection"></i>
                <span>教程工具</span>
            </router-link>
            <router-link to="/bbs">
                <i class="el-icon-collection"></i>
                <span>茶馆交流</span>
            </router-link>
            <router-link to="/share">
                <i class="el-icon-collection"></i>
                <span>捏脸分享</span>
            </router-link>
        </div>
        <h5 class="u-title">多人百科</h5>
        <div class="m-nav-group">
            <router-link to="/achievement">
                <i class="el-icon-collection"></i>
                <span>成就百科</span>
            </router-link>
            <router-link to="/item">
                <i class="el-icon-collection"></i>
                <span>物品百科</span>
            </router-link>
            <router-link to="/knowledge">
                <i class="el-icon-collection"></i>
                <span>通识百科</span>
            </router-link>
        </div>
        <h5 class="u-title">应用功能</h5>
        <div class="m-nav-group">
            <router-link to="/colletion">
                <i class="el-icon-collection"></i>
                <span>文集小册</span>
            </router-link>
            <router-link to="/item/plan">
                <i class="el-icon-collection"></i>
                <span>物品清单</span>
            </router-link>
            <router-link to="/namespace">
                <i class="el-icon-collection"></i>
                <span>剑三铭牌</span>
            </router-link>
            <router-link to="/exam/question">
                <i class="el-icon-collection"></i>
                <span>剑三题目</span>
            </router-link>
            <router-link to="/exam/paper">
                <i class="el-icon-collection"></i>
                <span>剑三试卷</span>
            </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Nav",
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "../assets/css/nav.less";
</style>
