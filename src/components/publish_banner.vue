<template>
    <div class="m-publish-banner">
        <el-divider content-position="left">海报</el-divider>
        <uploadImage v-model="banner" info="首页海报尺寸1100*300，非必选，部分栏目不会展示海报，分享功能将使用该图作为预览图"></uploadImage>
    </div>
</template>

<script>
import uploadImage from '@jx3box/jx3box-common-ui/src/upload/upload_banner.vue'

export default {
    name: "post_banner",
    components: {
        uploadImage
    },
    props: ["data"],
    data() {
        return {
            banner: this.data,
        };
    },
    model: {
        prop: "data",
        event: "update",
    },
    watch: {
        data : function (newval){
            this.banner = newval
        },
        banner: function(newval) {
            this.$emit("update", newval);
        },
    },
};
</script>

<style lang="less">
.m-publish-banner {
    .u-tip{
        padding:5px 15px;
    }
    img {
        max-width: 180px;
    }
    .avatar-uploader{
        .mt(10px);
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .u-remove{
        background-color: #c2c2c2;
        border-color:#c2c2c2;
        &:hover{
            background-color: #fc3c3c;
            border-color:#fc3c3c;
        }
    }
}
</style>
