<template>
    <div class="m-archive" v-loading="loading">
        <listbox
            :data="data"
            :total="total"
            :pages="pages"
            :per="per"
            :page="page"
            @appendPage="appendPage"
            @changePage="changePage"
        >
            <template slot="filter">
                <a
                    :href="publish_link"
                    class="u-publish el-button el-button--primary el-button--small"
                >
                    + 发布作品
                </a>
                <!-- 角标过滤 -->
                <markBy @filter="filter"></markBy>
                <!-- 排序过滤 -->
                <orderBy @filter="filter"></orderBy>
            </template>

            <!-- 搜索 -->
            <div class="m-archive-search" slot="search-before">
                <el-input
                    placeholder="请输入关键词"
                    v-model="search"
                    class="input-with-select"
                >
                    <span slot="prepend">关键词</span>
                    <!-- <el-select
                        v-model="searchType"
                        slot="prepend"
                        placeholder="请选择"
                    >
                        <el-option label="标题" value="title"></el-option>
                        <el-option label="作者" value="authorname"></el-option>
                    </el-select> -->
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>

            <!-- 列表 -->
            <div class="m-archive-list" v-if="data.length">
                <ul class="u-list">
                    <li class="u-item" v-for="(item, i) in data" :key="i">
                        <!-- Banner -->
                        <a
                            class="u-banner"
                            :href="item.post.ID | postLink"
                            :target="target"
                            ><img
                                :src="
                                    showBanner(
                                        item.post.post_banner,
                                        item.post.post_subtype
                                    )
                                "
                        /></a>

                        <h2
                            class="u-post"
                            :class="{ isSticky: item.post.sticky }"
                        >
                            <img
                                class="u-icon"
                                svg-inline
                                src="../assets/img/list/post.svg"
                            />

                            <!-- 标题文字 -->
                            <a
                                class="u-title"
                                :style="item.post.color | isHighlight"
                                :href="item.post.ID | postLink"
                                :target="target"
                                >{{ item.post.post_title || "无标题" }}</a
                            >

                            <!-- 角标 -->
                            <span
                                class="u-marks"
                                v-if="item.post.mark && item.post.mark.length"
                            >
                                <i
                                    v-for="mark in item.post.mark"
                                    class="u-mark"
                                    :class="mark | markcls"
                                    :key="mark"
                                    >{{ mark | showMark }}</i
                                >
                            </span>
                        </h2>

                        <!-- 字段 -->
                        <div class="u-content u-desc">
                            {{ item.post.post_excerpt || item.post.post_title }}
                        </div>

                        <!-- 作者 -->
                        <div class="u-misc">
                            <img
                                class="u-author-avatar"
                                :src="item.author.avatar | showAvatar"
                                :alt="item.author.name"
                            />
                            <a
                                class="u-author-name"
                                :href="item.author.uid | authorLink"
                                target="_blank"
                                >{{ item.author.name }}</a
                            >
                            <span class="u-date">
                                Updated on
                                <time>{{
                                    item.post.post_modified | dateFormat
                                }}</time>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </listbox>
    </div>
</template>

<script>
import listbox from "@jx3box/jx3box-page/src/cms-list.vue";
import { cms as mark_map } from "@jx3box/jx3box-common/js/mark.json";
import _ from "lodash";
import { getPosts } from "../service/post";
import dateFormat from "../utils/dateFormat";
import {
    __ossMirror,
    __imgPath,
    __ossRoot,
    __Root
} from "@jx3box/jx3box-common/js/jx3box";
import {
    showAvatar,
    authorLink,
    showMinibanner,
    publishLink,
    buildTarget,
    getAppType
} from "@jx3box/jx3box-common/js/utils";
export default {
    name: "list",
    props: [],
    data: function() {
        return {
            loading: false, //加载状态

            data: [], //数据列表
            page: 1, //当前页数
            total: 1, //总条目数
            pages: 1, //总页数
            per: 10, //每页条目
            appendMode : false, //追加模式

            search: "",
            searchType: "title",

            order: "", //排序模式
            mark: "", //筛选模式
        };
    },
    computed: {
        subtype: function() {
            // return this.$store.state.subtype;
            return this.$route.params.subtype
        },
        params: function() {
            let params = {
                per: this.per,
                subtype: this.subtype,
                page : ~~this.page || 1
            };
            if (this.search) {
                params.search = this.search;
            }
            if (this.order) {
                params.order = this.order;
            }
            if (this.mark) {
                params.mark = this.mark;
            }
            return params;
        },
        target: function() {
            return buildTarget();
        },
        // 根据栏目定义
        defaultBanner: function() {
            return __imgPath + "image/banner/null.png";
        },
        publish_link: function(val) {
            return publishLink("bbs");
        },
    },
    methods: {
        loadPosts: function() {
            this.loading = true;
            getPosts(this.params, this)
                .then((res) => {
                    if (this.appendMode) {
                        this.data = this.data.concat(res.data.data.list);
                    } else {
                        this.data = res.data.data.list;
                    }
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function(i) {
            this.appendMode = false
            this.page = i
            window.scrollTo(0, 0);
        },
        appendPage: function(i) {
            this.appendMode = true
            this.page = i
        },
        filter: function(o) {
            this.appendMode = false
            this[o["type"]] = o["val"];
        },
        showBanner: function(val, subtype) {
            if (val) {
                return showMinibanner(val);
            } else {
                return __imgPath + "image/banner/bbs" + subtype + ".png?v=1";
            }
            return this.defaultBanner;
        },
    },
    filters: {
        dateFormat: function(val) {
            return dateFormat(new Date(val));
        },
        showAvatar: function(val) {
            return showAvatar(val);
        },
        authorLink: function(val) {
            return authorLink(val);
        },
        postLink: function(val) {
            return location.origin + '/' + getAppType() + '/' + val;
        },
        isHighlight: function(val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        showMark: function(val) {
            return mark_map[val];
        },
        markcls : function (val){
            return 'u-mark-' + val
        }
    },
    watch : {
        params : {
            deep : true,
            handler : function (){
                this.loadPosts()
            }
        },
        '$route.query.page' : function (val){
            this.page = ~~val
        }
    },
    created: function() {
        this.page = ~~this.$route.query.page || 1
        this.loadPosts()
    },
    components: {
        listbox
    },
};
</script>

<style lang="less">
@import "../assets/css/list.less";
</style>
