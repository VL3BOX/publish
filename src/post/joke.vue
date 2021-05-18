<template>
    <div class="m-publish-box">
        <publish-header name="骚话" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <joke-emotion @select="handleEmotionSelect"></joke-emotion>
        <el-form label-position="left" label-width="80px">
            <el-form-item label="内容">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="content" id="textarea"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import publish_header from "@/components/publish_header.vue";
import joke_emotion from '@/components/joke_emotion.vue';
export default {
    name: 'joke',
    components: {
        'publish-header': publish_header,
        'joke-emotion': joke_emotion
    },
    data: () => ({
        content: ''
    }),
    methods: {
        handleEmotionSelect(key) {
            this.insertVariable(key)
        },
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
    }
}
</script>

<style lang="less" scoped>

</style>