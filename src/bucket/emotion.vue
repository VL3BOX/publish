<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">剑三表情</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布表情
            </a>
        </div>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="待审核"
                        placement="top-start"
                        v-if="!item.status"
                    >
                        <i class="u-item-icon u-icon-pending">
                            <img svg-inline src="../assets/img/works/pending.svg" />
                        </i>
                    </el-tooltip>
                    <i class="u-item-icon el-icon-picture-outline-round" v-else></i>
                    <a
                        class="u-title"
                        target="_blank"
                        :href="postLink(type, item.id)"
                    >{{ item.desc || "未命名" }}</a>
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ item.created_at | dateFormat }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ item.updated_at | dateFormat }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                            <el-button size="mini" icon="el-icon-edit" @click="edit(type, item.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                            <el-button size="mini" icon="el-icon-delete" @click="del(item.id,i)"></el-button>
                        </el-tooltip>
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
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMyEmotions, deleteEmotion } from "@/service/pvx.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
import dateFormat from "../utils/dateFormat";
export default {
    name: "emotion",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            type: "emotion",
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
                search: this.search,
            };
        },
        publishLink: function () {
            return "./#/" + this.type;
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getMyEmotions(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "./#/" + type + "/" + id;
        },
        del: function (id, i) {
            this.$alert("确定要删除吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteEmotion(id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                message: "表情删除成功",
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
</style>