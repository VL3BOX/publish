<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <pubheader name="物品百科">
            <slot name="header"></slot>
        </pubheader>

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
                    <el-option
                        v-for="item in options.sources"
                        :key="item.id"
                        :label="item.Name"
                        :value="item.id"
                    >
                        <div class="m-selector-item">
                            <img
                                class="u-icon"
                                :src="icon_url_filter(item.IconID)"
                                :alt="item.Name"
                            />
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
                <el-input
                    v-model="post.remark"
                    placeholder="请简单描述一下本次修订的说明"
                ></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">攻略正文 *</el-divider>
                <Tinymce
                    v-model="post.content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    :height="400"
                />
            </div>

            <div class="m-publish-commit">
                <el-divider content-position="left"></el-divider>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="toPublish"
                    :disabled="processing"
                    >提交攻略
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import pubheader from "@/components/publish/pubheader.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
import { JX3BOX } from "@jx3box/jx3box-common";
import { WikiPost } from "@jx3box/jx3box-common/js/helper";
import User from "@jx3box/jx3box-common/js/user";
import { search_items } from "../service/item";

export default {
    name: "item",
    data() {
        return {
            //选项 - 加载可选项
            options: {
                sources: null,
                loading: false,
            },

            //文章 - 主表数据
            post: {
                id: "", // 文章ID
                content: "",
                source_id: "",
                level: 0,
                remark: "",
            },
        };
    },
    computed: {
        processing: function() {
            return this.$store.state.processing;
        },
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

            this.$store.commit("startProcess");
            WikiPost.save({
                type: "item",
                source_id: this.post.source_id,
                level: this.post.level,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            })
                .then((data) => {
                    data = data.data;
                    if (data.code === 200) {
                        this.$message({
                            message: "提交成功，请等待审核",
                            type: "success",
                        });
                        setTimeout(() => {
                            location.href = JX3BOX.__Root + "/dashboard/#/wiki";
                        }, 500);
                    } else {
                        this.$message({
                            message: `${data.message}`,
                            type: "warning",
                        });
                        this.$store.commit("endProcess");
                    }
                })
                .catch(() => {
                    this.$store.commit("endProcess");
                });
        },
        icon_url_filter(icon_id) {
            if (isNaN(parseInt(icon_id))) {
                return `${JX3BOX.__imgPath}image/common/nullicon.png`;
            } else {
                return `${JX3BOX.__iconPath}icon/${icon_id}.png`;
            }
        },
        // 物品搜索
        search_handle(keyword = "") {
            this.options.loading = true;
            search_items(keyword, 10).then((res) => {
                res = res.data;
                if (res.code === 200) this.options.sources = res.data.data;
                this.options.loading = false;
            });
        },
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
            handler() {
                if (!this.post.source_id) return;
                WikiPost.newest("item", this.post.source_id, 0).then((res) => {
                    let data = res.data;
                    if (data.code === 200) {
                        // 数据填充
                        let post = data.data.post;
                        let item = data.data.source;

                        if (post) {
                            this.post.source_id = post.source_id;
                            this.post.level = post.level || 1;
                            this.post.remark = "";
                            this.post.content = post.content;
                        } else {
                            this.post.source_id = this.post.source_id
                                ? this.post.source_id
                                : "";
                            this.post.level = 0;
                            this.post.remark = "";
                            this.post.content = "";
                        }

                        if (item) {
                            // 将选择项恢复至下拉框
                            let exist = false;
                            this.options.sources = this.options.sources || [];
                            for (let index in this.options.sources) {
                                if (this.options.sources[index].id == item.id) {
                                    exist = true;
                                    break;
                                }
                            }
                            if (!exist) this.options.sources.push(item);
                        }
                    }
                });
            },
        },
    },
    components: {
        pubheader,
        Tinymce,
    },
};
</script>

<style lang="less">
@import "../assets/css/item.less";
</style>
