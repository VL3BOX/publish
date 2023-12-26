<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="技能百科">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">选择技能 *</el-divider>
                <el-select class="u-source-id" v-model="post.source_id" :disabled="!!post.id" filterable
                    remote :remote-method="search_handle" :loading="options.loading">
                    <el-option
                        v-for="item in options.sources"
                        :key="item.SkillID"
                        :label="item.Name"
                        :value="item.SkillID"
                    >
                        <div class="m-selector-item">
                            <img class="u-icon" :src="icon_url_filter(item.IconID)" :alt="item.Name" />
                            <span class="u-name" v-text="item.Name"></span>
                        </div>
                    </el-option>
                </el-select>
            </div>

            <div class="m-publish-remark">
                <el-divider content-position="left">修订说明 *</el-divider>
                <el-input
                    v-model="post.remark"
                    :maxlength="200"
                    :minlength="1"
                    show-word-limit
                    required
                    placeholder="请简单描述一下本次修订的说明"
                ></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">百科正文 *</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" :height="400" />
            </div>

            <div class="m-publish-commit">
                <el-divider content-position="left"></el-divider>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="toPublish"
                    :disabled="processing"
                    >提交百科
                </el-button>
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
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getSkillList } from "@/service/node"
export default {
    name: "skill",
    data() {
        return {
            //选项 - 加载可选项
            options: {
                sources: null,
            },

            //文章 - 主表数据
            post: {
                id: "", // 文章ID
                content: "",
                source_id: "",
                remark: "",
            },

            // 状态控制
            loading: false,
            processing: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        id: function () {
            return this.$route.query?.post_id;
        },
    },
    methods: {
        toPublish: function () {
            if (!this.post.source_id) {
                this.$message({
                    message: "请选择要修订百科的技能",
                    type: "warning",
                });
                return;
            }

            if (!this.post.content) {
                this.$message({ message: "要编写百科正文哦", type: "warning" });
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
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            };
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
                            this.$router.push({ name: "wiki_post", params: { type: "skill" } });
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                wiki.post({ type: "skill", ...data, client: this.client })
                    .then((data) => {
                        data = data.data;
                        this.$message({
                            message: "提交成功，请等待审核",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "skill" } });
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
        // 技能搜索
        search_handle(keyword = "") {
            this.loading = true;
            getSkillList({ Name: keyword }).then((res) => {
                this.options.sources = res.data.list;
                this.loading = false;
            });
        },
        loadData: function (client) {
            if (!this.post.source_id) return;
            this.loading = true;
            return wiki
                .get({ type: "skill", id: this.post.source_id }, { client })
                .then((res) => {
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let skill = data.data.source;

                    if (post) {
                        this.post.source_id = parseInt(post.source_id);
                        this.post.remark = post.remark;
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? parseInt(this.post.source_id) : "";
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (skill) {
                        // 将选择项恢复至下拉框
                        let exist = false;
                        this.options.sources = this.options.sources || [];
                        for (let index in this.options.sources) {
                            if (this.options.sources[index].SkillID == skill.SkillID) {
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) this.options.sources.push(skill);
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadDataByPostId: function () {
            this.loading = true;
            return wiki
                .getById(this.id)
                .then((res) => {
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let skill = data.data.source;

                    if (post) {
                        this.post.source_id = parseInt(post.source_id);
                        this.post.remark = post.remark;
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? parseInt(this.post.source_id) : "";
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (skill) {
                        // 将选择项恢复至下拉框
                        let exist = false;
                        this.options.sources = this.options.sources || [];
                        for (let index in this.options.sources) {
                            if (this.options.sources[index].SkillID == skill.SkillID) {
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) this.options.sources.push(skill);
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    created() {
        this.search_handle();
        // 获取成就ID并通过watch获取攻略
        let id = this.$route.params.id;
        this.post.source_id = id ? parseInt(id) : null;
    },
    watch: {
        "post.source_id": {
            handler: function (val) {

                if (this.id) {
                    this.loadDataByPostId();
                    return;
                }

                if (this.client == "std") {
                    this.loadData("std");
                } else {
                    this.loadData("origin").then((post) => {
                        console.log("兼容获取");
                        if (!post) {
                            this.loadData("std");
                        }
                    });
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
@import "../assets/css/achievement.less";
</style>
