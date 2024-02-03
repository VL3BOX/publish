<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="物品百科">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">选择物品 *</el-divider>
                <el-select
                    class="u-source-id"
                    v-model="post.source_id"
                    filterable
                    remote
                    :disabled="!!post.id"
                    placeholder="输入物品名称/物品描述并按『回车』进行搜索"
                    :remote-method="search_handle"
                    :loading="options.loading"
                >
                    <el-option v-for="item in options.sources" :key="item.id" :label="item.Name" :value="item.id">
                        <div class="m-selector-item">
                            <img class="u-icon" :src="icon_url_filter(item.IconID)" :alt="item.Name" />
                            <span class="u-name" v-text="item.Name"></span>
                        </div>
                    </el-option>
                </el-select>
            </div>

            <div class="m-publish-level">
                <el-divider content-position="left">综合难度 *</el-divider>
                <el-rate v-model="post.level" class="u-level"></el-rate>
            </div>

            <div class="m-publish-remark">
                <el-divider content-position="left">修订说明 *</el-divider>
                <el-input v-model="post.remark" placeholder="请简单描述一下本次修订的说明"></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">攻略正文 *</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" :height="400" />
            </div>

            <div class="m-publish-commit">
                <el-divider content-position="left"></el-divider>
                <el-button class="u-publish" icon="el-icon-s-promotion" type="primary" @click="toPublish" :disabled="processing">{{ $t('提交攻略') }}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";

import User from "@jx3box/jx3box-common/js/user";
import { search_items } from "../service/item";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import {uniqBy,pick} from 'lodash';
export default {
    name: "item",
    data() {
        return {
            //选项 - 加载可选项
            options: {
                sources: [],
            },

            //文章 - 主表数据
            post: {
                id: "", // 文章ID
                content: "",
                source_id: "",
                level: 0,
                remark: "",
            },

            // 状态控制
            loading: false,
            processing: false,

            compatible: false, // 是否兼容模式
        };
    },
    computed : {
        client : function (){
            return this.$store.state.client
        },
        id : function (){
            return this.$route.query?.post_id
        }
    },
    methods: {
        toPublish: function() {
            if (!this.post.source_id) {
                this.$message({
                    message: "请选择要修订攻略的物品",
                    type: "warning",
                });
                return;
            }

            if (!this.post.content) {
                this.$message({ message: "要编写攻略正文哦", type: "warning" });
                return;
            }

            if (!(this.post.level >= 1 && this.post.level <= 5)) {
                this.$message({
                    message: "请选择适合的综合难度",
                    type: "warning",
                });
                return;
            }

            if (!this.post.remark) {
                this.$message({
                    message: "请简单描述本次修订说明",
                    type: "warning",
                });
                return;
            }

            this.processing = true;
            const data = {
                source_id: String(this.post.source_id),
                level: this.post.level,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            }
            if (this.id) {
                const _data = pick(data, ["level", "content", "remark"]);
                wiki.update(this.id, { ..._data, client: this.client })
                    .then((data) => {
                        data = data.data;
                        this.$message({
                            message: "提交成功，请等待审核",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "item" } });
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else{
                wiki.post({ type: 'item', ...data, client: this.client })
                    .then((data) => {
                        data = data.data;
                        this.$message({
                            message: "提交成功，请等待审核",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "item" } });
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            }
        },
        icon_url_filter(icon_id) {
            return iconLink(icon_id);
        },
        // 物品搜索
        search_handle(keyword = "") {
            this.loading = true;
            search_items(keyword, 10).then((res) => {
                res = res.data;
                this.options.sources = res.data.data;
                this.loading = false;
            });
        },
        loadData: function(client) {
            if (!this.post.source_id) return;
            this.loading = true;
            return wiki.get({ type: "item", id: this.post.source_id }, { client })
                .then((res) => {
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let item = data.data.source;

                    if (post) {
                        this.post.source_id = post.source_id;
                        this.post.level = post.level || 1;
                        this.post.remark = post.remark || "";
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? this.post.source_id : "";
                        this.post.level = 0;
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (item) {
                        // 将选择项恢复至下拉框
                        if (this.compatible) {
                            // 兼容模式下，客户端为正式服的物品，不放入下拉框
                            if (client !== 'std') this.options.sources = uniqBy([this.options.sources, item], "id");
                        } else {
                            // 非兼容模式下的物品直接放入下拉框
                            this.options.sources = uniqBy([this.options.sources, item], "id");
                        }
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadDataByPostId: function() {
            this.loading = true;
            return wiki.getById(this.id)
                .then((res) => {
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let item = data.data.source;

                    if (post) {
                        this.post.source_id = post.source_id;
                        this.post.level = post.level || 1;
                        this.post.remark = post.remark || "";
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? this.post.source_id : "";
                        this.post.level = 0;
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (item) {
                        // 将选择项恢复至下拉框
                        if (this.compatible) {
                            // 兼容模式下，客户端为正式服的物品，不放入下拉框
                            if (client !== 'std') this.options.sources = uniqBy([this.options.sources, item], "id");
                        } else {
                            // 非兼容模式下的物品直接放入下拉框
                            this.options.sources = uniqBy([this.options.sources, item], "id");
                        }
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    created() {
        // 初始化搜索列表
        this.search_handle("");

        // 获取物品ID并通过watch获取攻略
        let id = this.$route.params.source_id;
        this.post.source_id = id ? id : null;
    },
    watch: {
        "post.source_id": {
            handler: function() {
                if (this.id) {
                    this.loadDataByPostId();
                    return;
                }
                if(this.client == 'std'){
                    this.loadData('std')
                }else{
                    this.loadData('origin').then((post) => {
                        this.compatible = true
                        console.log('兼容获取')
                        if(!post){
                            this.loadData('std')
                        }
                    })
                }
            },
        },
    },
    components: {
        "publish-header": header,
        Tinymce,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/item.less";
</style>
