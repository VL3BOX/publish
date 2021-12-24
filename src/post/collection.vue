<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="剑三小册" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <el-form label-position="left" class="m-publish-collection">
            <!-- 💛 栏目字段 -->
            <div class="m-publish-title">
                <el-divider content-position="left">标题</el-divider>
                <el-input
                    v-model="collection.title"
                    placeholder="请输入小册标题"
                    maxlength="30"
                    show-word-limit
                ></el-input>
            </div>

            <div class="m-publish-primary">
                <div class="m-publish-primary-block">
                    <el-divider content-position="left">可见性</el-divider>
                    <el-radio v-model.number="collection.public" :label="this.public.PUBLIC">公开</el-radio>
                    <el-radio v-model.number="collection.public" :label="this.public.PRIVATE">私有</el-radio>
                </div>
                <div class="m-publish-primary-block m-publish-collection-posts">
                    <el-divider content-position="left">内容</el-divider>
                    <draggable
                        class="m-list-style"
                        tag="ul"
                        v-if="collection.posts && collection.posts.length"
                        :list="collection.posts"
                        handle=".u-move"
                    >
                        <li v-for="(item, key) in collection.posts" :key="key" class="c-posts-item">
                            <i class="u-move el-icon-more"></i>
                            <i
                                class="u-delete el-icon-close"
                                @click="collection.posts.splice(key, 1)"
                            ></i>
                            <el-row class="m-posts-item" :gutter="10">
                                <el-col :span="4" class="u-collection-type">
                                    <el-select
                                        class="u-item-key"
                                        v-model="item.type"
                                        placeholder="请选择作品类型"
                                        @change="
                                            () => {
                                                search_handle(null, item);
                                                item.url = item.title = '';
                                            }
                                        "
                                    >
                                        <el-option
                                            v-for="(type, k) in source_types"
                                            :label="type"
                                            :key="k"
                                            :value="k"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8" class="u-collection-id">
                                    <el-select
                                        v-if="item.type !== 'custom'"
                                        class="u-item-value"
                                        v-model="item.id"
                                        filterable
                                        remote
                                        placeholder="通过输入作品标题进行搜索"
                                        :remote-method="
                                            (query) => {
                                                search_handle(query, item);
                                            }
                                        "
                                        @change="
                                            (post_id) => {
                                                title_fill(post_id, item);
                                            }
                                        "
                                    >
                                        <template v-for="post in item.posts">
                                            <el-option
                                                v-if="post.id && post.title"
                                                :key="post.id"
                                                :value="post.id"
                                                :label="post.title"
                                            ></el-option>
                                        </template>
                                    </el-select>
                                    <el-input
                                        class="u-item-value"
                                        placeholder="请输入完整网页链接（需以HTTP或HTTPS开头）"
                                        v-else
                                        v-model="item.url"
                                    ></el-input>
                                </el-col>
                                <el-col :span="12" class="u-collection-url" v-if="item.url">
                                    <el-input v-model="item.title" placeholder="请输入自定义标题"></el-input>
                                </el-col>
                            </el-row>
                        </li>
                    </draggable>
                    <div v-else class="u-posts-items-empty">暂无作品信息，请进行作品添加</div>
                    <div class="u-posts-add" @click="add_posts_item">
                        <i class="el-icon-plus"></i>
                        <span>添加作品</span>
                    </div>
                </div>

                <div class="m-publish-primary-block m-publish-description">
                    <el-divider
                        content-position="left"
                        @click="show_description = !show_description"
                    >描述（选填）</el-divider>
                    <span
                        v-if="!show_description"
                        @click="show_description = true"
                        class="u-show"
                    >▼ 展开</span>
                    <span
                        v-if="show_description"
                        @click="show_description = false"
                        class="u-hide"
                    >▲ 收起</span>
                    <Tinymce
                        v-show="show_description"
                        v-model="collection.description"
                        :attachmentEnable="true"
                        :resourceEnable="true"
                        :height="300"
                    />
                </div>
                <div class="m-publish-primary-block">
                    <publish-banner v-model="collection.image"></publish-banner>
                </div>

                <!-- <div class="m-publish-primary-block m-publish-tags">
                    <el-divider content-position="left">标签（选填）</el-divider>
                    <ul class="m-list-style">
                        <li v-for="(t, key) in collection.tags" :key="key" class="m-tag">
                            <span v-text="t"></span>
                            <i class="el-icon-close" @click="collection.tags.splice(key, 1)"></i>
                        </li>
                    </ul>
                    <div class="m-tag-add" v-if="collection.tags.length < 5">
                        <el-autocomplete
                            class="u-tag-add-value"
                            placeholder="请输入标签（最多为5个）"
                            v-model="tag"
                            :fetch-suggestions="tags_search"
                        ></el-autocomplete>
                        <el-button
                            class="u-tag-add"
                            @click="
                                () => {
                                    if (tag) collection.tags.push(tag);
                                    tag = '';
                                }
                            "
                        >
                            <i class="el-icon-plus"></i>
                        </el-button>
                    </div>
                </div>-->
            </div>

            <el-form-item>
                <el-button
                    class="m-publish-collection-publish u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="submit"
                    :loading="processing"
                >提交小册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    __Root,
    __postType,
    __otherType,
} from "@jx3box/jx3box-common/data/jx3box.json";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import CollectionPublic from "@jx3box/jx3box-editor/service/enum/CollectionPublic";
import header from "@/components/publish_header.vue";
import publish_banner from "@/components/publish_banner.vue";
import draggable from "vuedraggable";

// 本地依赖
import {
    get_legal_tags,
    get_collection,
    submit_collection,
} from "../service/collection";
import { get_posts_by_type } from "../service/post";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import qs from "qs";
import lodash from "lodash";

export default {
    name: "collection",
    props: [],
    data() {
        // 作品类型加载
        let source_types = Object.assign(__postType, __otherType);
        source_types["custom"] = "自定义";
        delete source_types["item_plan"];

        return {
            source_types: source_types,
            public: CollectionPublic,
            // 剑三小册主体
            collection: {
                id: "",
                title: "",
                public: 1,
                image: "",
                description: "",
                tags: [],
                posts: [],
            },
            tag: "",
            legal_tags: null,
            show_description: false,
            processing: false,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.collection_id;
        },
    },
    methods: {
        // 合法标签搜索仅请求数据一次
        tags_search(query, cb) {
            if (this.legal_tags === null) {
                get_legal_tags().then((res) => {
                    res = res.data;
                    this.legal_tags = res.code === 200 ? res.data.tags : [];
                    cb(this.tags_filters(query));
                });
            } else cb(this.tags_filters(query));
        },
        tags_filters(query) {
            let output = [];
            for (let tag of this.legal_tags) {
                if (tag.split(query).length > 1) output.push({ value: tag });
            }
            return output;
        },
        // 帖子标题填充
        title_fill(post_id, item) {
            let post = item.posts[post_id];
            item.title = post && post.title ? post.title : "";
        },
        add_posts_item() {
            this.collection.posts.push({
                title: "",
                type: "",
                id: "",
                url: "",
                posts: null,
            });
        },
        search_handle(queryString, item) {
            if (queryString === null) item.id = queryString = "";
            get_posts_by_type(item.type, {
                public: 1,
                keyword: queryString,
            }).then((res) => {
                res = res.data;
                if (res.code === 200) {
                    item.posts = res.data.posts;
                }
            });
        },
        init: function () {
            get_collection(this.id).then((res) => {
                res = res.data;
                if (res.code === 200) {
                    let collection = res.data.collection;
                    if (collection) {
                        for (let i in collection.posts) {
                            let item = collection.posts[i];
                            collection.posts[i].posts =
                                item.type === "custom"
                                    ? null
                                    : [{ id: item.id, title: item.title }];
                        }
                        this.collection = collection;
                    } else {
                        this.$message({
                            message: "该剑三小册已被删除或无权限访问",
                            type: "warning",
                        });
                    }
                }
            });
        },
        submit: function () {
            // this.$confirm("确定提交剑三小册信息？", "提示", {
            //     type: "info",
            // }).then(() => {
            // 标题长度限制
            // this.collection.title = this.collection.title.slice(0,40);

            let collection = JSON.parse(JSON.stringify(this.collection));

            if (!collection.posts) {
                collection.posts = [];
            }

            // 去除多余字段
            for (let i in collection.posts) delete collection.posts[i].posts;
            collection.posts = JSON.stringify(collection.posts);

            this.processing = true;
            submit_collection(collection)
                .then((data) => {
                    data = data.data;
                    if (data.code === 200) {
                        this.$message({
                            message: data.message,
                            type: "success",
                        });
                        let collection_id = lodash.get(
                            data,
                            "data.collection.id"
                        );
                        let id = this.id || collection_id;
                        setTimeout(() => {
                            location.href = getLink("collection", id);
                        }, 500);
                    } else {
                        this.$message({
                            message: `${data.message}`,
                            type: "warning",
                        });
                    }
                })
                .finally(() => {
                    this.processing = false;
                });
            // });
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                val && this.init();
            },
        },
    },
    components: {
        Tinymce,
        draggable,
        "publish-header": header,
        "publish-banner": publish_banner,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/collection.less";
</style>
