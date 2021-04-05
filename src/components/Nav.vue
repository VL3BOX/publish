<template>
    <nav class="m-nav">
        <router-link class="m-nav-publish el-button el-button--primary" to="/">
            <i class="el-icon-edit-outline"></i>
            <span>创作台</span>
        </router-link>
        <router-link class="m-nav-bucket el-button el-button--primary is-plain" to="/draft">
            <!-- <img class="u-bucket" svg-inline src="../assets/img/bucket.svg" /> -->
            <i class="el-icon-receiving"></i>
            <span>草稿箱</span>
        </router-link>

        <el-collapse v-model="group" class="m-nav-group" @click.native.stop>
            <el-collapse-item title="独立创作" name="cms">
                <template slot="title">
                    <span class="u-title">独立创作</span>
                </template>
                <router-link :to="item.path" v-for="(item,key) in cms" :key="key">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="多人创作" name="wiki">
                <template slot="title">
                    <span class="u-title">多人百科</span>
                </template>
                <router-link :to="item.path" v-for="(item,key) in wiki" :key="key">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="应用功能" name="app">
                <template slot="title">
                    <span class="u-title">应用扩展</span>
                </template>
                <router-link :to="item.path" v-for="(item,key) in app" :key="key">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="评论留言" name="comment">
                <template slot="title">
                    <span class="u-title">评论留言</span>
                </template>
                <router-link :to="item.path" v-for="(item,key) in comment" :key="key">
                    <i class="el-icon-collection"></i>
                    <span>{{item.name}}</span>
                    <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span>
                </router-link>
            </el-collapse-item>
        </el-collapse>
    </nav>
</template>

<script>
import { getMyPostsCount } from "@/service/cms.js";
import { get_my_post_total } from "@/service/post.js";
export default {
    name: "Nav",
    data: function () {
        return {
            group: [],
            cms: {
                macro: { path: "/cms/macro", name: "剑三宏", count: 0 },
                jx3dat: { path: "/cms/jx3dat", name: "插件数据", count: 0 },
                fb: { path: "/cms/fb", name: "副本攻略", count: 0 },
                bps: { path: "/cms/bps", name: "职业攻略", count: 0 },
                tool: { path: "/cms/tool", name: "教程工具", count: 0 },
                bbs: { path: "/cms/bbs", name: "茶馆交流", count: 0 },
                share: { path: "/cms/share", name: "捏脸分享", count: 0 },
            },
            wiki: {
                achievement: {
                    path: "/wiki/achievement",
                    name: "成就百科",
                    count: 0,
                },
                item: { path: "/wiki/item", name: "物品百科", count: 0 },
                knowledge: {
                    path: "/wiki/knowledge",
                    name: "通识百科",
                    count: 0,
                },
                quest: { path: "/wiki/quest", name: "任务百科", count: 0 },
            },
            app: {
                namespace: {
                    path: "/bucket/namespace",
                    name: "剑三铭牌",
                    count: 0,
                },
                collection: {
                    path: "/bucket/collection",
                    name: "文集小册",
                    count: 0,
                },
                item_plan: {
                    path: "/bucket/item_plan",
                    name: "物品清单",
                    count: 0,
                },
                exam_question: {
                    path: "/bucket/question",
                    name: "剑三题目",
                    count: 0,
                },
                exam_paper: {
                    path: "/bucket/paper",
                    name: "剑三试卷",
                    count: 0,
                },
            },
            comment: {
                // comment_cms: {
                //     path: "/comment/cms",
                //     name: "通用评论",
                //     count: 0,
                // },
                comment_wiki: {
                    path: "/comment/wiki",
                    name: "百科评论",
                    count: 0,
                },
            },
        };
    },
    computed: {},
    methods: {
        loadCmsCount: function () {
            getMyPostsCount().then((res) => {
                let count = res.data.data;
                for (let key in count) {
                    if (this.cms[key]) {
                        this.cms[key]["count"] = count[key];
                    }
                }
            });
        },
        loadHelperCount() {
            get_my_post_total().then((res) => {
                res = res.data;
                if (res.code === 200) {
                    let count = res.data;

                    for (let key in this.wiki) {
                        let tmp = count[`${key}_post`];
                        if (tmp) this.wiki[key]["count"] = tmp;
                    }

                    for (let key in this.app) {
                        let tmp = count[key];
                        if (tmp) this.app[key]["count"] = tmp;
                    }

                    for (let key in this.comment) {
                        let k = key;
                        if (k === 'comment_wiki') k = 'wiki_comment';
                        let tmp = count[k];
                        if (tmp) this.comment[key]["count"] = tmp;
                    }
                }
            });
        },
        init: function () {
            this.loadCmsCount();
            this.loadHelperCount();
        },
    },
    created: function () {
        this.init();
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "../assets/css/nav.less";
</style>
