<template>
    <div class="m-publish-facedat">
        <el-form-item label="数据">
            <input class="u-data-input" type="file" id="face_file" @change="uploadData" />
            <el-button type="primary" @click="selectData" icon="el-icon-upload2">上传脸型数据</el-button>
            <span class="u-data-ready" v-show="facedat.file">
                <i class="el-icon-success"></i>
                已上传
            </span>
        </el-form-item>

        <el-form-item label="分析结果">
            <el-input v-model="facedat.data" type="textarea" :rows="6" disabled></el-input>
        </el-form-item>

        <el-form-item label="图册">
            <UploadAlbum v-model="facedat.pics"></UploadAlbum>
        </el-form-item>

        <el-form-item label="作者">
            <el-input v-model="facedat.author" placeholder="请注明原作者"></el-input>
        </el-form-item>

        <slot></slot>
    </div>
</template>

<script>
import lodash from "lodash";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import { parse } from "lua-json";
import { uploadFacedata } from "@/service/share.js";

// META空模板
const default_meta = {
    author: "", //原作者
    pics: [], //图片
    file: "", //文件
    data: "", //解析数据
};
export default {
    name: "publishFacedat",
    props: ["data", "client"],
    components: { UploadAlbum },
    data: function () {
        return {
            facedat: this.data,
            object : ''
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.facedat = lodash.cloneDeep(default_meta);
                } else {
                    this.facedat = newval;
                }
            },
        },
        facedat: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        "facedat.author": function (val) {
            this.$emit("updateMeta", { key: "meta_1", val: val });
        },
        "facedat.data" : function (val){
            let body_type = this.object.nRoleType
            this.$emit("updateMeta", { key: "post_subtype", val: body_type });
        }
    },
    computed: {},
    methods: {
        // 数据
        selectData: function (i) {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadData: function (e) {
            let formdata = new FormData();
            let file = e.target.files[0];
            formdata.append("facedata", file);
            uploadFacedata(formdata).then((res) => {
                this.facedat.file = res.data.data[0];
                this.$message({
                    message: "上传成功",
                    type: "success",
                });
            });
            this.parseData(file);
        },
        // 解析数据
        parseData: function (facedata) {
            const vm = this;

            // 如果不支持本地读取
            if (!FileReader) return;

            let fr = new FileReader();
            fr.readAsText(facedata);
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");

                let data = e.target.result;
                data = "return" + data.slice(data.indexOf("{"));

                try {
                    vm.object = parse(data)
                    vm.facedat.data = JSON.stringify(parse(data));
                    vm.$notify({
                        title: "成功",
                        message: "脸型数据解析成功",
                        type: "success",
                    });
                } catch (e) {
                    vm.$notify.error({
                        title: "错误",
                        message: "无法解析脸型数据",
                    });
                }
            };
            fr.onerror = function (e) {
                vm.$notify.error({
                    title: "错误",
                    message: "无法解析脸型数据",
                });
            };
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

