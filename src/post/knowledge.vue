<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="通识百科">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">选择通识 *</el-divider>
                <el-select
                    class="u-source-id"
                    v-model="post.source_id"
                    filterable
                    remote
                    :disabled="!!post.id"
                    placeholder="通过输入通识名称进行搜索"
                    :remote-method="search_handle"
                    :loading="options.loading"
                >
                    <el-option
                        v-for="item in options.sources"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                        <div class="u-option">
                            <span class="u-type" v-text="item.label"></span>
                            <span class="u-name" v-text="item.name"></span>
                        </div>
                    </el-option>
                </el-select>
                <p class="m-knowledge-add">
                    <span>如没有合适的通识选择，可点击此处</span>
                    <el-button
                        type="success"
                        @click="dialogVisible = true"
                        size="mini"
                        >添加通识</el-button
                    >
                    <span
                        >Note：添加完成后的通识需要经过管理员审核通过后才会在通识百科上展示哦</span
                    >
                </p>
            </div>

            <div class="m-publish-remark">
                <el-divider content-position="left">修订说明 *</el-divider>
                <el-input
                    v-model="post.remark"
                    :maxlength="200"
                    :minlength="1"
                    show-word-limit
                    required
                    placeholder="请简单描述一下本次修订说明"
                ></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">通识正文 *</el-divider>
                <Tinymce
                    v-model="post.content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    :height="600"
                />
            </div>

            <div class="m-publish-tags">
                <el-divider content-position="left">通识标签</el-divider>
                <el-tag
                    :key="key"
                    v-for="(tag, key) in post.tags"
                    closable
                    :disable-transitions="false"
                    @close="post.tags.splice(key, 1)"
                    >{{ tag }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    placeholder="回车以添加"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ 添加标签
                </el-button>
            </div>

            <div class="m-publish-commit">
                <el-divider content-position="left"></el-divider>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="publish"
                    :disabled="processing"
                    >提交通识
                </el-button>
            </div>
        </el-form>

        <!-- 通识创建表单 -->
        <el-dialog
            title="通识添加"
            :visible.sync="dialogVisible"
            width="640px"
            @open="knowledge = { type: '', name: '' }"
        >
            <el-form class="m-publish-knowledge" v-if="knowledge">
                <div class="m-publish-type">
                    <el-divider content-position="left">类别 *</el-divider>
                    <el-radio-group v-if="types" v-model="knowledge.type">
                        <el-radio
                            :label="key"
                            border
                            v-for="(type, key) in types"
                            :key="type.name"
                            >{{ type.label }}
                        </el-radio>
                    </el-radio-group>
                </div>

                <div class="m-publish-name">
                    <el-divider content-position="left">名称 *</el-divider>
                    <el-input
                        v-model="knowledge.name"
                        placeholder="请输入通识名称"
                        :minlength="1"
                        :maxlength="50"
                        show-word-limit
                    ></el-input>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    :disabled="processing"
                    @click="create_knowledge"
                    >添加通识</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
import {JX3BOX} from "@jx3box/jx3box-common";
import {WikiPost} from "@jx3box/jx3box-common/js/helper";
import User from "@jx3box/jx3box-common/js/user";
import {get_menus, get_list, create_knowledge} from "../service/knowledge";

export default {
    name: "knowledge",
    data() {
        return {
            dialogVisible: false,
            knowledge: null,
            post: {
                id: "",
                content: "",
                source_id: "",
                remark: "",
                tags: [],
            },
            types: null,
            options: {
                sources: null,
                loading: false,
            },
            inputVisible: false,
            inputValue: "",
        };
    },
    computed: {
        processing() {
            return this.$store.state.processing;
        },
    },
    methods: {
        create_knowledge() {
            this.$store.commit("startProcess");
            create_knowledge({
                type: this.knowledge.type,
                name: this.knowledge.name,
            }).then((res) => {
                res = res.data;
                if (res.code === 200) {
                    // 自动选择已添加项
                    this.post.source_id = res.data.id;
                    this.$message({ message: "通识添加成功", type: "success" });
                    this.dialogVisible = false;
                } else {
                    this.$message({
                        message: `${res.message}`,
                        type: "warning",
                    });
                }
            }).finally(()=>{
                this.$store.commit('endProcess');
            });
        },
        // 通识搜索
        search_handle(keyword = '') {
            this.options.loading = true;
            get_list({
                keyword: keyword,
                include_pending: 1,
                limit: 10,
            }).then((res) => {
                res = res.data;
                if (res.code === 200) this.options.sources = res.data.data;
                this.options.loading = false;
            });
        },
        validate() {
            let result = ["source_id", "content", "remark"].every((prop) => {
                return !!this.post[prop];
            });
            if (!result) this.$message.error("请完成必填项");
            return result;
        },
        publish: function() {
            // 表单校验
            if (!this.validate()) return;
            this.$store.commit("startProcess");
            WikiPost.save({
                type: "knowledge",
                source_id: this.post.source_id,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
                tags: this.post.tags,
            }).then((res) => {
                res = res.data;
                if (res.code === 200) {
                    this.$message({message: "提交成功，请等待审核", type: "success"});
                    setTimeout(() => {
                        location.href = JX3BOX.__Root + '/dashboard/#/wiki';
                    }, 500);
                } else {
                    this.$message({message: `${res.message}`, type: "warning"});
                    this.$store.commit('endProcess');
                }
            }).catch(()=>{
                this.$store.commit('endProcess');
            });
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue.trim();
            if (inputValue) {
                this.post.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
    },
    created() {
        // 初始化搜索列表
        this.search_handle('');
        // 获取百科ID并通过watch获取攻略
        let id = this.$route.params.source_id;
        this.post.source_id = id ? id : "";

        get_menus().then((res) => {
            res = res.data;
            if (res.code === 200) this.types = res.data.menus;
        });
    },
    watch: {
        "post.source_id": {
            handler() {
                if (!this.post.source_id) return;
                WikiPost.newest("knowledge", this.post.source_id, 0).then(
                    (res) => {
                        let data = res.data;
                        if (data.code === 200) {
                            // 数据填充
                            let post = data.data.post;
                            let source = data.data.source;

                            if (post) {
                                this.post.source_id = parseInt(post.source_id);
                                this.post.remark = "";
                                this.post.content = post.content;
                                this.post.tags = post.tags || [];
                            } else {
                                this.post.source_id = this.post.source_id
                                    ? parseInt(this.post.source_id)
                                    : "";
                                this.post.remark = "";
                                this.post.content = "";
                                this.post.tags = [];
                            }

                            if (source) {
                                // 将选择项恢复至下拉框
                                let exist = false;
                                this.options.sources =
                                    this.options.sources || [];
                                for (let index in this.options.sources) {
                                    if (this.options.sources[index].id == source.id) {
                                        exist = true;
                                        break;
                                    }
                                }
                                if (!exist) this.options.sources.push(source);
                            }
                        }
                    }
                );
            },
        },
    },
    components: {
        'publish-header':header,
        Tinymce,
    },
};
</script>

<style lang="less">
@import "../assets/css/knowledge.less";
</style>
