<template>
    <div class="m-publish-tag">
        <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            effect="plain"
        >
            {{ tag }}
        </el-tag>
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
            >+ 标签</el-button
        >
    </div>
</template>

<script>
export default {
    name: "post_tag",
    props: ['tags'],
    data: function() {
        return {
            dynamicTags: this.tags,
            inputVisible: false,
            inputValue: "",
        };
    },
    computed: {},
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
    },
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
.m-dashboard-publish-tag {
    .el-tag{
        margin-right: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-right: 10px;
        vertical-align: bottom;
    }
}
</style>
