<template>
    <div class="m-publish-box">
        <publish-header name="骚话" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <joke-emotion @select="handleEmotionSelect"></joke-emotion>

        <el-form :model="info" ref="jokeForm" label-position="left" :rules="rules" label-width="80px">
            <el-form-item label="内容" prop="content">
                <el-input
                    v-model="info.content"
                    type="textarea"
                    :rows="3"
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
import joke_emotion from '@/components/joke_emotion.vue';
import { saveJoke } from '../service/joke'
export default {
    name: 'joke',
    components: {
        'publish-header': publish_header,
        'joke-emotion': joke_emotion
    },
    data: () => ({
        info: {
            content: ''
        },
        saveLoading: false,
        rules: {
            content: [
                { required: true, message: '请输入内容', trigger: 'blur' }
            ]
        }
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
            this.saveLoading = true

            this.$refs['jokeForm'].validate((valid) => {
                if (valid) {
                    const { content } = this.info
                    saveJoke({ content })
                    .then(res => {
                        this.$message({
                            type: res.data.message ||  'success',
                            message: '提交成功'
                        })
                    }).finally(() => {
                        this.saveLoading = false
                    })
                } else {
                    this.saveLoading = false
                    return false
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>