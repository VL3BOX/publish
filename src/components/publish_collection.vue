<template>
    <div class="m-publish-collection">
        <h5 class="u-schema">
            <span class="u-label">关联小册</span>
            <slot></slot>
            <a class="u-help u-icon-links" href="/tool/20891" target="_blank">
                <i class="el-icon-question"></i> 小册帮助指南
            </a>
        </h5>
        <el-select
            class="u-collection"
            v-model="post_collection"
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            filterable
            clearable
            placeholder="请选择一个小册（可选，非必填，可搜索）"
            @blur="handleBlur"
        >
            <el-option
                v-for="(item, index) in collections"
                :key="index"
                :label="item.title"
                :value="item.id"
            ></el-option>
        </el-select>
    </div>
</template>
<script>
import { get_my_collections } from "@/service/collection";
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "publish_collection",
    props: ["data"],
    data: function () {
        return {
            post_collection: "",

            collections: [],
            copyCollections: [],

            isInit: true,
            loading: false,
            search: "",
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    computed: {
    },
    watch: {
        data: {
            immediate: true,
            handler(newval) {
                this.post_collection = Number(newval) || "";
            },
        },
        post_collection: {
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    methods: {
        loadCollections: function (keyword = "") {
            const params = {
                keyword,
            };
            get_my_collections(params).then((res) => {
                this.collections = res.data.data.data;

                if (this.isInit) {
                    this.copyCollections = cloneDeep(this.collections);
                    this.isInit = false;
                }
            });
        },
        remoteMethod: function (keyword = "") {
            this.search = keyword;
            this.loading = true;
            if (keyword !== "") {
                const params = {
                    keyword,
                };
                get_my_collections(params).then((res) => {
                    this.collections = res.data.data.data;
                    this.loading = false;
                });
            } else {
                this.collections = cloneDeep(this.copyCollections);
            }
        },
        handleBlur: function () {
            this.collections = cloneDeep(this.copyCollections);
        },
    },
    mounted: function () {
        this.loadCollections();
    },
    components: {},
};
</script>


<style lang="less">
@import "../assets/css/publish_collection.less";
</style>
