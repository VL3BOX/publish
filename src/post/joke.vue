<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="剑三骚话"></publish-header>

        <div class="m-publish-joke-emotion">
            <div>
                <template v-for="emotion in sortedEmotions">
                    <span
                        :key="emotion.key"
                        class="emotion-item"
                        @click="handleEmotionClick(emotion.key)"
                    >
                        <img :src="emotion.path" :alt="emotion.key" :title="emotion.key" />
                    </span>
                </template>
            </div>
        </div>

        <el-form label-position="left" label-width="80px">
            <el-form-item label="门派">
                <el-select v-model="post.post_subtype" placeholder="请选择门派">
                    <el-option v-for="s in schools" :key="s.value" :value="s.value" :label="s.key">
                        <span style="float: left;">{{ s.key }}</span>
                        <span style="float: right;">
                            <img :src="s.path" width="32" :alt="s.key">
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="内容">
                <el-input
                    v-model="post.post_title"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入内容"
                    id="textarea"
                    :maxlength="158"
                    :minlength="1"
                    show-word-limit
                ></el-input>
            </el-form-item>

            <el-form-item label="标签">
                <div style="display: flex;margin-top:5px;">
                    <el-tag 
                        v-for="tag in post.tags"
                        :key="tag" 
                        closable 
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                    >{{ tag }}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                </div>
            </el-form-item>

            <div class="m-publish-buttons">
                <el-button
                    type="primary"
                    @click="publish('publish',true)"
                    :disabled="processing"
                >发 &nbsp;&nbsp; 布</el-button>
                <el-button type="plain" @click="publish('draft',false)" :disabled="processing">保存为草稿</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import { getLink } from "@jx3box/jx3box-common/js/utils";
import emotion from "@jx3box/jx3box-data/data/jokes/default.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { school } from "@jx3box/jx3box-data/data/xf/school.json";

// 本地模块
import publish_header from "@/components/publish_header.vue";

// 数据逻辑
import { push, pull } from "@/service/cms.js";

export default {
    name: "joke",
    components: {
        "publish-header": publish_header,
    },
    data: () => ({
        // 加载状态
        loading: false,
        // 发布状态
        processing: false,

        inputVisible: false,
        inputValue: '',
        contentLength: 0,

        // 内容
        post: {
            // 文章ID
            ID: "",
            // 状态：publish公开、private私有、draft草稿、dustbin删除
            post_status: "publish",
            // 类型
            post_type: "joke",

            // 标题
            post_title: "",
            // 子类型：心法、副本名等
            post_subtype: "0",
            // 自定义字段
            post_meta: {},
            // 内容
            post_content: "",
            // 编辑模式(会影响文章详情页渲染规则)
            post_mode: "joke",

            // 是否原创
            original: 1,
            // 客户端：std正式服、origin怀旧服
            client: "all",
            // 语言：cn简体、tr繁体
            lang: "cn",
            // 资料片
            zlp: "",

            // 摘要
            post_excerpt: "",
            // 海报
            post_banner: "",
            // 小册
            post_collection: "",

            // 评论开关（0开启|默认，1关闭）
            comment: 0,

            // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
            visible: 0,
            // 自定义标签 10上限
            tags: []
        },

        // 表情
        sortedEmotions: [],
        // 门派
        schools: []
    }),
    computed: {
        id: function () {
            return ~~this.post.ID;
        },
        data: function () {
            if (this.id) {
                return [this.id, this.post];
            } else {
                return [this.post];
            }
        },
    },
    methods: {
        handleEmotionSelect(key) {
            this.insertVariable(key);
        },
        handleClose(tag) {
            this.post.tags = this.post.tags.filter(t => t !== tag)
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.post.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        /**
         * add emotion to textarea
         * @parma {string} value emotion key
         */
        async insertVariable(value) {
            const myField = document.querySelector("#textarea");
            if (myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;

                this.post.post_title =
                    myField.value.substring(0, startPos) +
                    value +
                    myField.value.substring(endPos, myField.value.length);

                await this.$nextTick();

                myField.focus();
                myField.setSelectionRange(
                    endPos + value.length,
                    endPos + value.length
                );
            } else {
                this.post.post_title = value;
            }
        },
        // 表情排序
        emotionSort() {
            const keys = Object.keys(emotion);
            keys.sort((item1, item2) => {
                return item1.localeCompare(item2);
            });
            keys.forEach((key) => {
                const pathKey = key.slice(1);
                const obj = {
                    key,
                    value: emotion[key],
                    path: __imgPath + `image/emotion/${pathKey}.gif`,
                };
                // console.log(key)
                this.sortedEmotions.push(obj);
            });
        },
        formatSchool() {
            const arr = []
            for (const [key, value] of Object.entries(school)) {
                const obj = {
                    key,
                    value: String(value),
                    path: __imgPath + `image/school/${value}.png`
                }
                arr.push(obj)
            }
            this.schools = arr
        },
        /**
         * 点击表情触发事件
         * @param {string} key 表情key
         */
        handleEmotionClick(key) {
            this.insertVariable(key);
        },
        // 加载
        init: function () {
            this.loading = true;
            // 加载文章
            if (this.$route.params.id) {
                return pull(this.$route.params.id)
                    .then((res) => {
                        this.post = res.data.data;
                        return res.data.data;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        // 发布
        publish: function (status, skip) {
            if (!this.check()) return;

            this.post.post_status = status;
            this.processing = true;
            push(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    this.done(skip, result);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 完成
        done: function (skip, result) {
            if (skip) {
                // 提醒
                this.$message({
                    message: "发布成功",
                    type: "success",
                });
                // 跳转
                setTimeout(() => {
                    location.href = getLink(result.post_type, result.ID);
                }, 500);
            } else {
                // 提醒
                this.$notify({
                    title: "保存成功",
                    message: "云端草稿保存成功",
                    type: "success",
                });
                // 路由
                this.post = result;
                if (!this.$route.params.id) {
                    this.$router.push({
                        params: {
                            id: result.ID,
                        },
                    });
                }
            }
        },
        // 检查内容合法性
        // 纯数字 纯英文 纯汉字 纯符号长度均为128 表情个数限制在10个
        check: function () {
            // 表情 key
            const emotionKeys = Object.keys(emotion);

            let str = this.post.post_title.trim();

            const regex_1 = /(#[\u4e00-\u9fa5]{1})/g;
            const regex_2 = /(#[\u4e00-\u9fa5]{2})/g;
            const regex_3 = /(#[\u4e00-\u9fa5]{3})/g;

            if (!str.length) {
                this.$alert("内容不能为空", "消息", {
                    confirmButtonText: "确定",
                    callback: (action) => {
                    },
                });
                return false;
            }

            /**
             * 依次判定表情字符为1，2，3个的情况
             */
            const emotion_1 = str.match(regex_1) ? str.match(regex_1).filter(emotion => emotionKeys.includes(emotion)) : [];

            emotion_1.forEach(emotion => str.replace(emotion, ''));

            const emotion_2 = str.match(regex_2) ? str.match(regex_2).filter(emotion => emotionKeys.includes(emotion)) : [];

            emotion_2.forEach(emotion => str.replace(emotion, ''));

            const emotion_3 = str.match(regex_3) ? str.match(regex_3).filter(emotion => emotionKeys.includes(emotion)) : [];

            emotion_3.forEach(emotion => str.replace(emotion, ''));

            const emotionLength = emotion_1.length + emotion_2.length + emotion_3.length;

            this.contentLength = emotionLength;

            if (emotionLength > 10) {
                this.$alert("表情个数不能超过10个", "消息", {
                    confirmButtonText: "确定",
                    callback: (action) => {}
                })
                return false
            }

            if (str.length > 128) {
                this.$alert("内容长度不能超过128个字符", "消息", {
                    confirmButtonText: "确定",
                    callback: (action) => {}
                })
                return false
            }
            return true;
        },
    },
    created() {
        this.emotionSort();
        this.init();
        this.formatSchool();
    },
    watch: {
        "$route.params.id": function (val) {
            val && this.init();
        },
    },
};
</script>

<style lang="less" scoped>
.m-publish-joke-emotion {
    margin: 16px 0;

    .emotion-item {
        display: inline-flex;
        padding: 4px;
        margin: 2px;
        border: 1px solid #fff;
        .pointer;

        &:hover {
            border-color: #ccc;
        }
    }
}
.el-tag {
    margin-right: 10px;
}
.button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>