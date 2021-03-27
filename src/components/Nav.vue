<template>
    <nav class="m-nav">
        <router-link class="m-nav-publish el-button el-button--primary" to="/">
            <i class="el-icon-edit-outline"></i>
            <span>创作台</span>
        </router-link>
        <router-link class="m-nav-bucket el-button el-button--primary is-plain" to="/bucket">
            <!-- <img class="u-bucket" svg-inline src="../assets/img/bucket.svg" /> -->
            <i class="el-icon-receiving"></i>
            <span>草稿箱</span>
        </router-link>

        <el-collapse v-model="group" class="m-nav-group">
            <el-collapse-item title="独立创作" name="cms">
                <template slot="title">
                    <span class="u-title">独立创作</span>
                </template>
                <router-link :to="item.path" v-for="item in cms" :key="item.name">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="多人百科" name="wiki">
                <template slot="title">
                    <span class="u-title">多人百科</span>
                </template>
                <router-link :to="item.path" v-for="item in wiki" :key="item.name">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="应用功能" name="app">
                <template slot="title">
                    <span class="u-title">应用功能</span>
                </template>
                <router-link :to="item.path" v-for="item in app" :key="item.name">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="评论留言" name="comment">
                <template slot="title">
                    <span class="u-title">评论留言</span>
                </template>
                <router-link :to="item.path" v-for="item in comment" :key="item.name">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
        </el-collapse>
    </nav>
</template>

<script>
// TODO:count
export default {
    name: "Nav",
    data: function () {
        return {
            group: [],
            cms: [
                { path: "/macro", name: "剑三宏", count: 10 },
                { path: "/jx3dat", name: "插件数据", count: 0 },
                { path: "/fb", name: "副本攻略", count: 0 },
                { path: "/bps", name: "职业攻略", count: 0 },
                { path: "/tool", name: "教程工具", count: 0 },
                { path: "/bbs", name: "茶馆交流", count: 0 },
                { path: "/share", name: "捏脸分享", count: 0 },
            ],
            wiki: [
                { path: "/achievement", name: "成就百科", count: 0 },
                { path: "/item", name: "物品百科", count: 0 },
                { path: "/knowledge", name: "通识百科", count: 0 },
                { path: "/quest", name: "任务百科", count: 0 },
            ],
            app: [
                { path: "/colletion", name: "文集小册", count: 0 },
                { path: "/item/plan", name: "物品清单", count: 0 },
                { path: "/namespace", name: "剑三铭牌", count: 0 },
                { path: "/exam/question", name: "剑三题目", count: 0 },
                { path: "/exam/paper", name: "剑三试卷", count: 0 },
            ],
            comment: [
                { path: "/comment/cms", name: "通用评论", count: 0 },
                { path: "/comment/wiki", name: "百科评论", count: 0 },
            ],
        };
    },
    computed: {},
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "../assets/css/nav.less";
</style>
