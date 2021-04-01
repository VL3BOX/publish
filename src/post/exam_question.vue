<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="趣味题库·题目" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <!-- <h1 class="m-publish-exam-header">贡献题目</h1> -->
        <el-form label-position="left" label-width="80px" class="m-publish-exam">
            <el-form-item label="题目" class="m-publish-exam-title">
                <el-input
                    v-model="primary.title"
                    :maxlength="500"
                    :minlength="2"
                    show-word-limit
                    required
                    :rows="3"
                    type="textarea"
                    placeholder="请填写题目内容 (支持html)"
                ></el-input>
            </el-form-item>
            <el-form-item label="题型" class="m-publish-exam-type">
                <el-radio-group v-model="primary.type">
                    <el-radio label="radio" border>单选题</el-radio>
                    <el-radio label="checkbox" border>多选题</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选项" class="m-publish-exam-options">
                <el-input placeholder="选项1 (支持html)" v-model="primary.options[0]">
                    <template slot="prepend">A</template>
                </el-input>
                <el-input placeholder="选项2 (支持html)" v-model="primary.options[1]">
                    <template slot="prepend">B</template>
                </el-input>
                <el-input placeholder="选项3 (支持html)" v-model="primary.options[2]">
                    <template slot="prepend">C</template>
                </el-input>
                <el-input placeholder="选项4 (支持html)" v-model="primary.options[3]">
                    <template slot="prepend">D</template>
                </el-input>
            </el-form-item>
            <el-form-item label="答案" class="m-publish-exam-answer">
                <el-checkbox-group v-model="primary.answer">
                    <el-checkbox :label="0">A</el-checkbox>
                    <el-checkbox :label="1">B</el-checkbox>
                    <el-checkbox :label="2">C</el-checkbox>
                    <el-checkbox :label="3">D</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="难度" class="m-publish-exam-level">
                <el-rate
                    v-model="primary.hardStar"
                    show-score
                    text-color="#ff9900"
                    score-template="{value} 星"
                ></el-rate>
            </el-form-item>

            <exam_tags class="m-publish-exam-tags" v-model="primary.tags" />

            <el-form-item label="答案解析" class="m-publish-exam-content">
                <Tinymce
                    v-model="primary.whyami"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    :height="400"
                />
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="publish"
                    :disabled="processing"
                >提交题目</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
import exam_tags from "@/components/exam_tags.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import User from "@jx3box/jx3box-common/js/user";
import { getQuestion, createQuestion, updateQuestion } from "../service/exam";
import {getLink} from '@jx3box/jx3box-common/js/utils'
export default {
    name: "exam_question",
    props: [],
    data: function () {
        return {
            primary: {
                title: "",
                type: "radio",
                options: ["", "", "", ""],
                answer: [],
                hardStar: 0,
                tags: [],
                whyami: "",
                pool: "common",
            },
            processing: false,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        isNew: function () {
            return !this.id;
        },
    },
    watch: {},
    methods: {
        publish: function () {
            this.processing = true;
            if (this.id) {
                updateQuestion(this.id, this.primary, this)
                    .then((res) => {
                        this.success(res);
                        getLink('question',this.id)
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                createQuestion(this.primary, this)
                    .then((res) => {
                        this.success(res);
                        getLink('question',res.data.data.id)
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            }
        },
        success: function (res) {
            this.$message({
                message: res.data.msg || "提交成功",
                type: "success",
            });
        },
        loadData: function () {
            getQuestion(this.id, this).then((res) => {
                let data = res.data;
                this.primary.title = data.title;
                this.primary.type = data.type;
                this.primary.options = JSON.parse(data.options);
                this.primary.answer = data.answerList;
                this.primary.hardStar = data.hardStar;
                this.primary.tags = JSON.parse(data.tags);

                this.primary.pool = data.pool;

                this.primary.whyami = data.whyami;
            });
        },
        updateTags: function (val) {
            this.tags = val;
        },
    },
    created: function () {
        if (this.id) {
            this.loadData();
        }
    },
    components: {
        "publish-header": header,
        Tinymce,
        exam_tags,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/exam.less";
</style>