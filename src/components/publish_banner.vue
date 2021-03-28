<template>
    <div class="m-publish-banner">
        <el-alert class="u-tip" title="首页海报尺寸1100*300，非必选，部分栏目不会展示海报，分享功能将使用该图作为预览图" type="info" show-icon> </el-alert>
        <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            :on-success="done"
            :on-error="fail"
            with-credentials
            accept="image/jpg,image/jpeg,image/gif,image/png,image/bmp"
        >
            <img v-if="post_banner" :src="post_banner | showBanner" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button class="u-remove" type="info" size="mini" icon="el-icon-circle-close" @click="clearBanner">移除海报</el-button>
    </div>
</template>

<script>
import { __server } from "@jx3box/jx3box-common/data/jx3box.json";
import { showMinibanner } from "@jx3box/jx3box-common/js/utils";
const API = __server + "upload";
// const API = "http://localhost:5160/" + "upload";

export default {
    name: "post_banner",
    props: ["banner"],
    data() {
        return {
            post_banner: this.banner,
            url: API,
        };
    },
    model: {
        prop: "banner",
        event: "update",
    },
    watch: {
        post_banner: function(newval) {
            this.$emit("update", newval);
        },
        banner : function (newval){
            this.post_banner = newval
        }
    },
    methods: {
        done(res, file) {
            this.post_banner = res.data.list[0];
            this.$store.commit("editBanner", this.post_banner);
        },
        fail(err, file, fileList) {
            try {
                let response = JSON.parse(err.message);
                this.$message.error(`[${response.code}]${response.msg}`);
            } catch {
                this.$message.error("网络请求异常");
            }
        },
        clearBanner : function (){
            this.post_banner = ''
            this.$store.commit("editBanner", this.post_banner);
        }
    },
    filters : {
        showBanner : function (val){
            return showMinibanner(val)
        }
    }
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
