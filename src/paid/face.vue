<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">捏脸数据</h2>
            <a
                :href="publishLink"
                class="u-publish el-button el-button--primary el-button--small"
            >
                <i class="el-icon-document"></i> 发布数据
            </a>
        </div>

        <el-input
            class="m-dashboard-work-search"
            placeholder="请输入搜索内容"
            v-model.lazy="search"
        >
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i
                        class="u-item-icon el-icon-chat-dot-round"
                        v-if="item.status == 1"
                    ></i>
                    <i
                        class="u-item-icon el-icon-lock"
                        v-else
                        :title="item.status == 0 ? '待审核' : '审核未通过'"
                    ></i>
                    <a
                        class="u-title"
                        target="_blank"
                        :href="postLink(item.id)"
                        >{{ item.title || "未命名" }}</a
                    >
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ item.created_at }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ item.updated_at }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            @click="edit(item.id)"
                            title="编辑"
                        ></el-button>
                        <el-button size="mini" icon="el-icon-upload2" @click="handleOnline(item.id)" title="上架"></el-button>
                        <el-button size="mini" icon="el-icon-download" @click="handleOffline(item.id)" title="下架"></el-button>
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
import { getFaceList, faceOnline, faceOffline } from "@/service/face.js";
import dayjs from "dayjs";
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "face",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
        };
    },
    computed: {
        params: function () {
            return {
                pageIndex: this.page,
                pageSize: this.per,
                title: this.search,
            };
        },
        publishLink: function () {
            return '/#/face';
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            const _params = {
                ...this.params,
            }
            getFaceList(_params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (id) {
            location.href = "/#/face/" + id
        },
        postLink: function (id) {
            return "/face/" + id
        },
        handleOnline: function (id){
            faceOnline(id).then(res => {
                this.$message.success('上架成功');
                this.loadPosts();
            })
        },
        handleOffline: function (id){
            faceOffline(id).then(res => {
                this.$message.success('下架成功');
                this.loadPosts();
            })
        }
    }
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
</style>
