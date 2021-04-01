<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other" v-loading="loading">

        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{typeLable}}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布作品
            </a>
        </div>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box" v-loading="loading">
            <template v-if="data && data.length">
                <collection
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="type === 'collection'"
                />
                <item_plan
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="type === 'item_plan'"
                    @refresh="loadPosts(type)"
                />
                <question
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="type === 'question'"
                />
                <paper class="m-dashboard-box-list" :data="data" v-if="type === 'paper'" />
            </template>
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
import { __otherType } from "@jx3box/jx3box-common/data/jx3box.json";
import { getQuestions, getPapers } from "@/service/exam";
import { get_my_item_plans } from "@/service/item_plan";
import { get_my_collections } from "@/service/collection";
import question from "@/bucket/question.vue";
import paper from "@/bucket/paper.vue";
import item_plan from "@/bucket/item_plan.vue";
import collection from "@/bucket/collection.vue";
const fn = {
    question: getQuestions,
    item_plan: get_my_item_plans,
    paper: getPapers,
    collection: get_my_collections,
};
const next_list = ["question", "paper"];
const helper_list = ["collection", "item_plan"];
export default {
    name: "ideas",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",

            types: {
                collection: "我的小册",
                item_plan: "我的清单",
                question: "我的题目",
                paper: "我的试卷",
            },
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        typeLable: function () {
            return this.types[this.type];
        },
        params: function () {
            if (next_list.includes(this.type)) {
                return {
                    pageIndex: this.page,
                    title: this.search,
                    pageSize: this.per,
                };
            } else if (helper_list.includes(this.type)) {
                return {
                    page: this.page,
                    keyword: this.search,
                    limit: this.per,
                };
            }
            return {
                page: this.page,
                query: this.search,
                per: this.per,
            };
        },
        publishLink : function (){
            return './#/' + this.type
        }
    },
    watch: {
        type: function () {
            this.page = 1;
        },
        params: {
            deep: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            if(!this.type) return

            this.loading = true;
            fn[this.type](this.params)
                .then((res) => {
                    if (helper_list.includes(this.type)) {
                        res = res.data;
                        if (res.code === 200) {
                            this.data = res.data.data;
                            this.total = res.data.total;
                        }
                    } else {
                        this.data = res.data.data;
                        this.total = res.data.page.total;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function () {
        this.loadPosts();
    },
    components: {
        question,
        item_plan,
        paper,
        collection,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
.m-dashboard-other {
    padding: 20px;
}
.m-dashboard-work-search {
    .mb(10px);
}

.m-dashboard-box-pages {
    .mt(10px);
}
</style>
