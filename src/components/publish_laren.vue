<template>
    <div class="m-jx3data-box">

        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane v-for="(item, i) in lanrenDat.data" :key="item.lanren_type + i" :name="i + 1 + ''">
                <span slot="label" class="m-jx3dat-tab-label">
                    <i class="el-icon-box"></i>
                    {{ item.lanren_type }}
                </span>
                <!-- 数据标题 -->
                <div class="m-jx3dat-item">
                    <h5 class="u-title">数据标题</h5>
                    <el-input
                        v-model="item.desc"
                        placeholder="数据描述"
                        :maxlength="50"
                        show-word-limit
                    ></el-input>
                </div>

                <div class="m-jx3dat-item m-jx3data-jx3dat">
                    <h5 class="u-title">数据文件</h5>
                    <div class="u-warning">
                        <i class="el-icon-warning-outline"></i>
                        当前数据文件将作为
                        <b>{{ item.lanren_type }}</b> 的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                    </div>
                    <input
                        class="u-data-input"
                        type="file"
                        :id="'lanren_' + i"
                        @change="uploadLaren(item, i)"
                    />
                    <el-button
                        type="primary"
                        icon="el-icon-s-promotion"
                        plain
                        size="small"
                        @click="selectLanren(i)"
                    >上传数据文件</el-button>
                    <span class="u-data-remark">{{item.origin_name}}</span>
                    <!-- <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="uploadLaren(item, i)"
                        icon="el-icon-s-promotion"
                        >开始上传</el-button
                    >-->
                    <el-input
                        class="u-fileurl"
                        :class="{ isUploaded: item.isUploaded }"
                        @change="aniLanren(item)"
                        placeholder="数据地址"
                        :disabled="true"
                        :value="item.file"
                        v-if="item.file"
                    >
                        <template slot="prepend">
                            <span class="u-status">当前文件地址</span>
                        </template>
                        <template slot="append">
                            <span
                                class="u-copy"
                                v-clipboard:copy="item.file"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError"
                            >
                                <i class="el-icon-document-copy"></i>
                                <span>点击复制</span>
                            </span>
                        </template>
                    </el-input>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { uploadHub } from "@/service/jx3dat.js";
import { lanren_types } from "@/assets/data/jx3dat.json";
export default {
    name: 'publish_lanren',
    props: ['data', 'user'],
    data: () => ({
        activeTab: '1',
        lanrenDat: {
            data: []
        },
        tabs: [],
    }),
    created() {
        this.initData()
    },
    watch: {
        'lanrenDat': {
            deep: true,
            handler(val) {
                this.$emit('update-lanren', val)
            }
        }
    },
    computed: {
        totalVersions: function () {
            return (
                this.lanrenDat &&
                this.lanrenDat.data &&
                this.lanrenDat.data.length + 1
            );
        },
    },
    methods: {
        initData() {
            lanren_types.forEach((la) => {
                const obj = {
                    lanren_type: la,
                    desc: "",
                    status: true,
                    file: "",
                    version: "", //已失效，由redis托管 -- 20210430小版本patch
                    _version: "", //真实文件版本号
                    // 源文件名
                    origin_name: "",
                    upload_status: false,
                    pop: false,
                }
                this.lanrenDat.data.push(obj)

            })
        },
        selectLanren: function (i) {
            let fileInput = document.getElementById("lanren_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadLaren: function (item, i) {
            let fileInput = document.getElementById("lanren_" + i);
            let file = fileInput.files[0];
            if (!file) {
                this.$alert("请先选择文件", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }
            item.origin_name = file.name;

            let formdata = new FormData();
            formdata.append("jx3dat", file);
            formdata.append("version", item.name);
            uploadHub(formdata).then((res) => {
                if (res) {
                    item.file = res.data.download_url;
                    this.$message({
                        message: "数据上传成功",
                        type: "success",
                    });
                    item._version = Date.now();
                    item.upload_status = true;
                }
            });
        },
        aniLanren: function (item) {
            item.isUploaded = true;
            setTimeout(() => {
                item.isUploaded = false;
            }, 2000);
        },
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: "复制成功",
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "复制失败",
            });
        },
    },
}
</script>

<style lang="less" scoped>
.m-jx3data-box {
    .m-lanren-header {
        margin-bottom: 10px;
    }
    .u-type-wrapper {
        margin-left: 20px;
    }
}
</style>