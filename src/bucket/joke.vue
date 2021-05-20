<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">我的骚话</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布骚话
            </a>
        </div>
        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="keyword">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="m-joke-list">

        </div>
        <div class="m-joke-pages">
            <el-pagination
                background
                layout="total, prev, pager, next,jumper"
                :page-size="perPage"
                :total="total"
                :current-page.sync="page"
                :hide-on-single-page="true"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getJokes } from '@/service/joke'
export default {
    name: 'bucket_joke',
    data: () => ({
        jokes: [],
        keyword: '',
        page: 1,
        perPage: 10,
        total: 1,
        loading: false
    }),
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            this.loading = true
            getJokes()
                .then(res => {
                    this.jokes = res.data.data
                })
                .finally(() => {
                    this.loading = false
                })
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