<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other">
        <el-tabs v-model="searchType">
            <el-tab-pane
                :label="item"
                :name="key"
                v-for="(item, key) in types"
                :key="key"
            >
            </el-tab-pane>
        </el-tabs>
        <el-input
            class="m-dashboard-work-search"
            placeholder="请输入搜索内容"
            v-model="search"
            v-if="searchType != 'namespace'"
        >
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="m-dashboard-box" v-loading="loading">
            <template v-if="data && data.length">
                <collection
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="searchType === 'collection'"
                />
                <item_plan
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="searchType === 'item_plan'"
                    @refresh="loadPosts(searchType)"
                />
                <question
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="searchType === 'question'"
                />
                <paper
                    class="m-dashboard-box-list"
                    :data="data"
                    v-if="searchType === 'paper'"
                />
            </template>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            >
            </el-alert>
            <el-pagination
                class="m-dashboard-box-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getQuestions, getPapers } from "@/service/exam";
import { get_my_item_plans } from "@/service/item_plan";
import { get_my_collections } from "@/service/collection";
import question from "./question.vue";
import paper from "./paper.vue";
import item_plan from "./item_plan.vue";
import collection from "./collection.vue";

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
    data: function() {
        return {
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            searchType: "collection",
            types: {
                collection: "我的小册",
                item_plan: "我的清单",
                question: "我的题目",
                paper: "我的试卷",
            },
            loading: false,
        };
    },
    computed: {
        params: function() {
            if (next_list.includes(this.searchType)) {
                return {
                    pageIndex: this.page,
                    title: this.search,
                    pageSize: this.per,
                };
            } else if (helper_list.includes(this.searchType)) {
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
    },
    watch: {
        searchType: function() {
            this.page = 1;
        },
        params: {
            deep: true,
            handler: function(val) {
                this.loadPosts(this.searchType);
            },
        },
    },
    methods: {
        loadPosts: function(searchType) {
            this.loading = true;
            fn[searchType](this.params)
                .then((res) => {
                    if (helper_list.includes(searchType)) {
                        res = res.data;
                        if (res.code === 200) {
                            this.data = res.data.data;
                            this.total = res.data.total;
                        }
                    } else {
                        this.data = res.data.data;
                        this.total = res.data.page.total;
                    }
                    // this.$router.push({ query: { subtype: searchType } });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function() {
        if (this.$route.query.subtype) {
            this.searchType = this.$route.query.subtype;
        }
        this.loadPosts(this.searchType);
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
