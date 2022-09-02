<template>
    <div class="m-paid_attachment">
        <input class="u-data-input" type="file" id="face_file" @change="uploadData" />
        <el-button type="primary" @click="selectData" icon="el-icon-upload2">上传脸型数据</el-button>
        <span class="u-data-ready" v-show="data.uuid">
            <i class="el-icon-success"></i>
            已上传
        </span>
    </div>
</template>

<script>
import { uploadFile } from "@/service/face.js";
import { parse } from "lua-json";
export default {
    name: 'paid_attachment',
    props: {
        body: {
            type: Number,
            default: 2
        },
        describe: {
            type: String,
            default: '个人收藏',
        }
    },
    data() {
        return {
            data: {
                id: '',
                uuid: '',
                json: '',
            }
        }
    },
    methods: {
        uploadData(e) {
            let formdata = new FormData();
            let file = e.target.files[0];
            formdata.append("jx3dat", file, "data.jx3dat");
            formdata.append("body", this.body);
            formdata.append("describe", this.describe);
            uploadFile(formdata).then((res) => {
                this.data.uuid = res.data.data.uuid;
                this.data.id = res.data.data.id
                this.$message({
                    message: "上传成功",
                    type: "success",
                });
                this.$emit("update:data", this.data);
            });
            e.target.value = "";
            this.parseData(file);
        },
        selectData() {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        // 解析数据
        parseData (facedata) {
            const vm = this;

            // 如果不支持本地读取
            if (!FileReader) return;

            let fr = new FileReader();
            fr.readAsText(facedata);
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");

                let data = e.target.result;
                data = data.slice(data.indexOf("return {"));

                try {
                    console.log(0)
                    vm.object = parse(data)
                    vm.data.json = JSON.stringify(parse(data));
                    vm.$notify({
                        title: "成功",
                        message: "脸型数据解析成功",
                        type: "success",
                    });
                    vm.$emit("update:data", this.data);
                } catch (e) {
                    console.log(e)
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
    }
}
</script>

<style lang="less" scoped>
.m-paid_attachment {
    .u-data-input {
        display: none;
    }

    .u-data-ready {
        margin-left: 10px;
        i {
            color: #67c23a;
        }
    }
}
</style>
