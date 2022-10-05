<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="任务百科">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">选择任务 *</el-divider>
                <el-select
                    class="u-source-id"
                    v-model="post.source_id"
                    filterable
                    remote
                    :disabled="!!post.id"
                    placeholder="输入任务名称（可适配中括号形式）「回车」进行搜索"
                    :remote-method="search_handle"
                    :loading="options.loading"
                >
                    <el-option
                        v-for="source in options.sources"
                        :key="source.id"
                        :label="source.Name"
                        :value="source.id"
                    >
                        <div class="m-selector-item">
                            <i class="el-icon-collection u-icon"></i>
                            <span class="u-name" v-text="source.Name"></span>
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
                    :maxlength="200"
                    :minlength="1"
                    show-word-limit
                    required
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
                >提交攻略</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
// import { WikiPost } from "@jx3box/jx3box-common/js/helper";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import User from "@jx3box/jx3box-common/js/user";
import { get_list } from "../service/quest";

export default {
    name: "quest",
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
                level: 0,
                remark: "",
            },

            // 状态控制
            loading: false,
            processing: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client
        }
    },
    methods: {
        toPublish: function () {
            if (!this.post.source_id) {
                this.$message({
                    message: "请选择要修订攻略的任务",
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
            /* WikiPost.save({
                type: "quest",
                source_id: this.post.source_id,
                level: this.post.level,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            }) */
            const data = {
                source_id: String(this.post.source_id),
                level: this.post.level,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            }
            wiki.post({ type: 'quest', data: data, client: this.client }, {})
                .then((data) => {
                    data = data.data;
                    if (data.code === 200) {
                        this.$message({
                            message: "提交成功，请等待审核",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({
                                name: "wiki_post",
                                params: { type: "quest" },
                            });
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
        },
        // 任务搜索
        search_handle(keyword = "") {
            this.loading = true;
            get_list({
                keyword: keyword,
                limit: 10,
            }).then((res) => {
                res = res.data;
                if (res.code === 200) this.options.sources = res.data.data;
                this.loading = false;
            });
        },
    },
    created() {
        // 初始化搜索列表
        this.search_handle("");
        // 获取任务ID并通过watch获取攻略
        let id = this.$route.params.source_id;
        this.post.source_id = id ? parseInt(id) : null;
    },
    watch: {
        "post.source_id": {
            handler() {
                if (!this.post.source_id) return;
                this.loading = true;
                // WikiPost.newest("quest", this.post.source_id, 0)
                wiki.get({ type: 'quest', id: this.post.source_id }, { supply: 0, client: this.client })
                    .then((res) => {
                        let data = res.data;
                        if (data.code === 200) {
                            // 数据填充
                            let post = data.data.post;
                            let source = data.data.source;

                            if (post) {
                                this.post.source_id = parseInt(post.source_id);
                                this.post.level = post.level || 1;
                                this.post.remark = "";
                                let content = post.content;
                                content = content.replace(
                                    /(<p>)?\s*◆任务难度 [★]+\s*(<\/p>)?/gi,
                                    ""
                                );
                                content = content.replace(
                                    /(<p>)?\s*◆花费时长 [★]+\s*(<\/p>)?/gi,
                                    ""
                                );
                                content = content.replace(
                                    /(<p>)?\s*◆任务攻略\s*(<\/p>)?/gi,
                                    ""
                                );
                                this.post.content = content;
                            } else {
                                this.post.source_id = this.post.source_id
                                    ? parseInt(this.post.source_id)
                                    : "";
                                this.post.level = 0;
                                this.post.remark = "";
                                this.post.content = "";
                            }

                            if (source) {
                                // 将选择项恢复至下拉框
                                let exist = false;
                                this.options.sources =
                                    this.options.sources || [];
                                for (let index in this.options.sources) {
                                    if (
                                        this.options.sources[index].id ==
                                        source.id
                                    ) {
                                        exist = true;
                                        break;
                                    }
                                }
                                if (!exist) {
                                    source.id = source?.QuestID
                                    source.Name = source?.QuestName
                                    this.options.sources.push(source);
                                }
                            }
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    });
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
@import "../assets/css/quest.less";
</style>
