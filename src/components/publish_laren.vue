<template>
    <div class="m-jx3data-box">
        <div class="m-lanren-header">
            <el-button
                class="m-jx3dat-addbutton"
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="addLanren"
            >添加数据</el-button>
        </div>

        <el-tabs v-model="activeTab" type="card" closable @tab-remove="delLanren">
            <el-tab-pane v-for="(item, i) in lanrenDat.data" :key="item.name + i" :name="i + 1 + ''">
                <span slot="label" class="m-jx3dat-tab-label">
                    <i class="el-icon-box"></i>
                    {{ item.name }}
                </span>
                <div class="m-jx3dat-item">
                    <h5 class="u-title">订阅名</h5>
                    <div class="u-group">
                        <div class="u-subblock">
                            <el-input
                                v-model="item.name"
                                :minlength="1"
                                :maxlength="10"
                                show-word-limit
                                @change="checkDataName(item)"
                                :disabled="i == 0"
                                :placeholder="i == 0 ? '默认版': '版本名称'"
                            >
                                <template slot="prepend">
                                    <b
                                        class="u-feed"
                                    >{{ user.name}}{{item.name =="默认版"? "": "#" +item.name}}</b>
                                </template>
                            </el-input>
                        </div>
                        <div class="u-subblock u-status-wrapper">
                            <el-switch
                                v-model="item.status"
                                active-color="#49C10F"
                                inactive-color="#ff4949"
                            ></el-switch>

                            <el-tooltip
                                effect="dark"
                                content="设置不公开后,仍然可以通过订阅名下载,仅不做展示"
                                placement="top"
                            >
                                <span class="u-status">{{item.status? "公开": "私有"}}</span>
                            </el-tooltip>
                        </div>
                        <div class="u-subblock u-type-wrapper">
                            <el-select v-model="item.lanren_type" placeholder="选择数据类型">
                                <el-option v-for="(item, i) in lanren_types" :key="item" :label="item" :value="i"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
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
                        <b>{{ item.name }}</b>的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                    </div>
                    <input
                        class="u-data-input"
                        type="file"
                        :id="'jx3dat_' + i"
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
import cloneDeep from 'lodash/cloneDeep';
import { sterilizer } from "sterilizer/index.js";
import { lanren_types } from "@/assets/data/jx3dat.json";
export default {
    name: 'publish_lanren',
    props: ['data', 'user', 'is-vip'],
    data: () => ({
        activeTab: '1',
        lanrenDat: {},
        tabs: [],
        lanren_types
    }),
    watch: {
        'data': {
            handler(val) {
                if (val) {
                    this.lanrenDat = cloneDeep(val)
                }
            },
            deep: true,
            immediate: true
        },
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
        addLanren() {
            // 目前设置最多3个版本
            if (this.lanrenDat.data.length >= 3 && !this.isVIP) {
                this.$alert(
                    '默认只能设置3个版本，<a href="/vip/premium?from=jx3dat_feed" target="_blank">开通高级版账号</a>无限制',
                    "消息",
                    {
                        dangerouslyUseHTMLString: true,
                    }
                );
                return;
            }

            this.lanrenDat.data.push({
                name: "版本" + this.totalVersions,
                desc: "",
                status: true,
                file: "",
            });
        },
        delLanren(name) {
            // this.lanrenDat.data.splice(i, 1);

            if (name == 1) {
                this.$alert("✘ 必须保留默认数据", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }

            if (this.lanrenDat.data.length < 2) {
                this.$alert("✘ 必须保留默认数据", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个数据吗，删除后无法找回", "提醒", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.lanrenDat.data.splice(i, 1);
                        // 调整focus位置
                        this.activeTab = i + "";
                    }
                },
            });
        },
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            this.$set(data, "name", name);
        },
        selectLanren: function (i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadLaren: function (item, i) {
            let fileInput = document.getElementById("jx3dat_" + i);
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