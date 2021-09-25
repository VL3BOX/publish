<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki" v-loading="loading">

        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{typeLable}}百科</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small"><i class="el-icon-document"></i> 发布作品</a>
        </div>

        <el-input
            class="m-dashboard-work-search u-source-search"
            placeholder="请输入搜索内容"
            v-model="achievement_post.keyword"
            @change="search_post"
        >
            <template slot="prepend">关键词</template>
            <el-button slot="append" icon="el-icon-search" @click="search_post"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul
                class="m-dashboard-box-list"
                v-if="
                    achievement_post.data &&
                        achievement_post.data.length
                "
            >
                <li v-for="(post, key) in achievement_post.data" :key="key">
                    <span class="u-tab" v-text="getTypeLabel(post.type)"></span>
                    <a
                        class="u-title"
                        target="_blank"
                        :href="post.link"
                    >{{ post.title || "无标题" }}</a>
                    <span v-if="post.checked == 0" class="u-mark pending">⌛ 等待审核</span>
                    <span v-if="post.checked == 1" class="u-mark">✔ 审核通过</span>
                    <span v-if="post.checked == 2" class="u-mark reject">❌ 审核驳回</span>
                    <span v-if="post.checked == 3" class="u-mark hold">🔐 等待验证</span>
                    <div class="u-desc">
                        <span
                            v-if="
                                post.checked == 2 && post.check_remark
                            "
                            class="u-check_remark"
                            v-html="`驳回理由：${post.check_remark}`"
                        ></span>
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{
                            new Date(post.created * 1000)
                            | dateFormat
                            }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{
                            new Date(post.updated * 1000)
                            | dateFormat
                            }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <!-- <el-button
                            size="mini"
                            icon="el-icon-edit"
                            :disabled="post.checked != 0"
                            title="编辑"
                            @click="post_edit('achievement', post)"
                        ></el-button>-->
                        <el-button
                            size="mini"
                            icon="el-icon-delete"
                            title="删除"
                            @click="post_del(post)"
                        ></el-button>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                class="m-dashboard-box-pages"
                background
                :total="achievement_post.total"
                hide-on-single-page
                layout="total, prev, pager, next, jumper"
                :current-page="post_page"
                :page-size="length"
                @current-change="post_page_change"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __wikiType } from "@jx3box/jx3box-common/data/jx3box.json";
import dateFormat from "@/utils/dateFormat";
import {
    get_posts,
    remove_post,
} from "@/service/wiki";
export default {
    name: "wiki",
    props: [],
    data: function () {
        return {
            loading : false,

            active_name: this.$route.query.type
                ? this.$route.query.type
                : "wiki_post",
            achievement_post: {
                data: null,
                total: 0,
                keyword: null,
            },
            post_page: 1,
            length: 10,
        };
    },
    computed : {
        type: function () {
            return this.$route.params.type;
        },
        typeLable: function () {
            return __wikiType[this.type];
        },
        publishLink : function (){
            return './#/' + this.type
        }
    },
    methods: {
        getTypeLabel: function (val) {
            return val ? __wikiType[val] : "未知";
        },
        post_page_change(i = 1) {
            this.post_page = i;
            this.loading = true
            get_posts({
                type: this.type,
                keyword: this.achievement_post.keyword,
                page: i,
                limit: this.length,
            }).then(
                (data) => {
                    data = data.data;
                    this.achievement_post.data =
                        data.code === 200 ? data.data.data : false;
                    this.achievement_post.total =
                        data.code === 200 ? data.data.total : 0;
                },
                () => {
                    this.achievement_post.data = false;
                }
            ).finally(() => {
                this.loading = false
            })
        },
        search_post() {
            this.post_page_change(1);
        },
        post_edit(type, post) {
            switch (type) {
                case "achievement":
                    this.$message("即将开放");
                    break;
            }
        },
        post_del(post) {
            this.$alert("确定要删除吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        remove_post(post.type, post.id).then(
                            (data) => {
                                data = data.data;
                                if (data.code === 200) {
                                    this.$notify({
                                        title: "删除成功",
                                        type: "success",
                                    });
                                    this.post_page_change(this.post_page);
                                } else {
                                    this.$notify({
                                        title: "删除失败",
                                        type: "error",
                                    });
                                }
                            },
                            () => {
                                this.$notify({
                                    title: "删除失败",
                                    type: "error",
                                });
                            }
                        );
                    }
                },
            });
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (this.$route.params.type) {
                    switch (this.$route.query.type) {
                        case "wiki_post":
                            this.achievement_post.keyword = this.$route.params.type;
                            break;
                        case "wiki_comment":
                            this.achievement_comment.keyword = this.$route.params.type;
                            break;
                    }

                    // 置空输入框ID
                    this.$nextTick(() => {
                        let input_doms = document.querySelectorAll(
                            ".u-source-search input"
                        );
                        for (let i = 0; i < input_doms.length; i++)
                            input_doms[i].value = "";
                    });
                } else {
                    this.achievement_post.keyword = "";
                    this.achievement_comment.keyword = "";
                }

                // 列表获取
                this.post_page_change();
            },
        },
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/wiki.less";
</style>
