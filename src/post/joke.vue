<template>
    <div class="m-publish-box">
        <publish-header name="剑三骚话" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <div class="m-publish-joke-emotion">
            <div>
                <template v-for="emotion in sortedEmotions">
                    <span :key="emotion.key" class="emotion-item" @click="handleEmotionClick(emotion.key)">
                        <img :src="emotion.path" :alt="emotion.key" :title="emotion.key">
                    </span>
                </template>
            </div>
        </div>

        <el-form label-position="left" label-width="80px">
            <el-form-item label="内容">
                <el-input
                    v-model="content"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入内容" 
                    id="textarea">
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="publish"
                    :loading="saveLoading"
                >发布骚话</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import publish_header from "@/components/publish_header.vue";
import emotion from '@jx3box/jx3box-data/data/jokes/default.json'
import { __imgPath } from '@jx3box/jx3box-common/data/jx3box.json'
import { saveJoke } from '../service/joke'
export default {
    name: 'joke',
    components: {
        'publish-header': publish_header,
    },
    data: () => ({
        content: '',
        sortedEmotions: [],
        saveLoading: false,
    }),
    methods: {
        handleEmotionSelect(key) {
            this.insertVariable(key)
        },
        /**
         * add emotion to textarea
         * @parma {string} value emotion key
         */
        async insertVariable(value) {
            const myField = document.querySelector('#textarea');
            if (myField.selectionStart || myField.selectionStart === 0) {

                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;

                this.content = myField.value.substring(0, startPos) + value
                    +
                    myField.value.substring(endPos, myField.value.length);

                await this.$nextTick()

                myField.focus();
                myField.setSelectionRange(endPos + value.length, endPos + value.length);
            } else {
                this.content = value;
            }
        },
        publish() {
            const { content } = this
            if (!content) {
                this.$message({
                    message: '请输入骚话内容',
                    type: 'error'
                })
                return false
            }
            this.saveLoading = true

            saveJoke({ content })
            .then(res => {
                this.$message({
                    type: res.data.message ||  'success',
                    message: '提交成功'
                })
            }).finally(() => {
                this.saveLoading = false
            })
        },
        // 表情排序
        emotionSort() {
            const keys = Object.keys(emotion)
            keys.sort((item1, item2) => {
                return item1.localeCompare(item2)
            })
            keys.forEach(key => {
                const pathKey = key.slice(1)
                const obj = {
                    key,
                    value: emotion[key],
                    path: __imgPath + `image/emotion/${pathKey}.gif`
                }
                // console.log(key)
                this.sortedEmotions.push(obj)
            })
        },
        /**
         * 点击表情触发事件
         * @param {string} key 表情key
         */
        handleEmotionClick(key) {
            this.insertVariable(key)
        }
    },
    created() {
        this.emotionSort()
    }
}
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
</style>