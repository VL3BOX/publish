<template>
    <div class="c-upload">
        <!-- 上传触发按钮 -->
        <el-button type="primary" @click="dialogVisible = true"
            ><i class="el-icon-upload el-icon--right"></i> 上传附件</el-button
        >

        <!-- 弹出界面 -->
        <el-dialog
            class="c-large-dialog"
            title="上传"
            :visible.sync="dialogVisible"
        >
            <!-- 清空按钮 -->
            <el-button
                class="u-upload-clear"
                plain
                icon="el-icon-delete"
                size="small"
                @click="clear"
                >清空</el-button
            >

            <!-- 限制提示 -->
            <el-alert
                class="u-upload-tip"
                :title="tip"
                type="info"
                show-icon
                :closable="false"
            >
            </el-alert>

            <!-- 文件区 -->
            <el-upload
                :action="API"
                list-type="picture-card"
                :auto-upload="false"
                :limit="10"
                multiple
                with-credentials
                :file-list="fileList"
                :on-change="change"
                ref="uploadbox"
            >
            <!-- :accept="accept" -->
                <i slot="default" class="el-icon-plus"></i>

                <!-- 文件项 -->
                <div
                    slot="file"
                    slot-scope="{ file }"
                    class="u-file-wrapper"
                    @click="select(file)"
                    :class="{
                        isSelected: file.selected,
                        disabled: file.status != 'success',
                    }"
                >
                    <!-- 图片类型 -->
                    <img
                        v-if="file.is_img"
                        class="el-upload-list__item-thumbnail u-imgbox"
                        :src="file.url"
                        alt=""
                    />
                    <!-- 其他类型 -->
                    <div v-else class="u-filebox">
                        <img
                            class="u-fileplaceholder"
                            svg-inline
                            src="../../assets/img/publish/file.svg"
                        />
                        <span class="u-filename">{{ file.name }}</span>
                    </div>
                    <!-- 勾选角标 -->
                    <label v-show="file.selected" class="u-file-select-label"
                        ><i class="el-icon-upload-success el-icon-check"></i
                    ></label>
                </div>
            </el-upload>

            <!-- 插入按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insert">{{
                    buttonTXT
                }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import allow_types from "@jx3box/jx3box-common/data/conf";
import { JX3BOX } from "@jx3box/jx3box-common";
import axios from "axios";
const imgtypes = ["jpg", "png", "gif", "bmp"];
const API = JX3BOX.__server + "upload";
// const API = "http://localhost:5160/" + "publish/upload";

export default {
    name: "upload",
    data: function() {
        return {
            API: API,
            dialogVisible: false,
            tip:
                "一次最多同时上传10个文件（不超过5M），格式限常见的图片、文档、数据表及压缩包",

            fileList: [],
            selectedCount: 0,

            // accept: allow_types.accept,
            // sizeLimit: allow_types.sizeLimit,
        };
    },
    computed: {
        buttonTXT: function() {
            return this.selectedCount ? "插 入" : "确 定";
        },
    },
    methods: {
        change: function(file, fileList) {
            if (file.status != "success") {
                // 判断大小
                // if (file.size > this.sizeLimit) {
                //     this.$message.error("文件超出大小限制");
                //     this.removeFile(fileList, file.uid);
                //     return;
                // }

                // 构建数据
                let fdata = new FormData();
                fdata.append("file", file.raw);

                // 异步上传
                axios
                    .post(API, fdata, {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true,
                    })
                    .then((res) => {
                        // 提醒
                        this.$message({
                            message: "上传成功",
                            type: "success",
                        });

                        // 修改path
                        file.url = res.data.data.list[0];

                        // 分析文件类型
                        let ext = file.name.split(".").pop();
                        let is_img = imgtypes.includes(ext);

                        // 额外赋值
                        file.is_img = is_img;
                        file.selected = true;

                        // 修改状态加入仓库
                        file.status = "success";
                        this.fileList.push(file);
                        this.selectedCount++
                    })
                    .catch((err) => {
                        if (err.response.data.code) {
                            this.$message.error(
                                `[${err.response.data.code}] ${err.response.data.msg}`
                            );
                        } else {
                            this.$message.error("请求异常");
                        }
                    });
            }
        },
        select: function(file) {
            if (file.status == "success") {
                this.$set(file,'selected',!file.selected)
                file.selected ? this.selectedCount++ : this.selectedCount--;
            }
        },
        insert: function() {
            this.dialogVisible = false;

            //为空不执行插入
            if (!this.selectedCount) return;

            if (this.$store.state.post.post_mode == "markdown") {
                // tinymce
            } else {
                tinyMCE.editors["tinymce"].insertContent(this.insertList());
            }

            //移除所有选择状态
            this.resetSelectStatus();
            
        },
        resetSelectStatus: function() {
            this.fileList.forEach((file,i) => {
                this.$set(this.fileList[i],'selected',false)
            });
            this.selectedCount = 0
        },
        clear: function() {
            this.$refs.uploadbox.clearFiles();
            this.fileList = []
        },
        removeFile: function(fileList, uid) {
            fileList.forEach((file, i) => {
                if (file.uid == uid) {
                    fileList.splice(i, 1);
                }
            });
        },
        insertList: function() {
            let list = [];
            this.fileList.forEach((file) => {
                if (file.selected) {
                    file.is_img
                        ? list.push(`<img src="${file.url}" />`)
                        : list.push(
                              `<a target="_blank" href="${file.url}">${file.name}</a>`
                          );
                }
            });
            return list.join(" \n");
        },
    },
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/components/large-dialog.less";

.c-upload {
    .u-upload-clear {
        .pa;
        .lt(70px, 16px);
    }
    .u-upload-tip {
        padding-right: 10px;
        .el-alert__content {
            line-height: 16px;
            padding-right: 20px;
            .db;
            .nobreak;
        }
        .mb(20px);
    }

    .el-dialog__body {
        padding-top: 0;
    }

    .el-upload-list li {
        outline: none;
    }

    .el-upload-list__item {
        &:hover {
            border: 1px solid #13ce66;
        }
    }

    // 列表
    .u-file-wrapper {
        .size(100%);
        &.isSelected {
        }
        &.disabled {
            cursor: default;
            opacity: 0.38;
            border-color: #eee;
            .u-fileplaceholder {
                fill: #aaa;
            }
        }
        .pointer;
    }
    .u-filebox {
        .x;
        padding: 37px;
    }
    .u-fileplaceholder {
        width: 40px;
        height: 40px;
        fill: @primary;
    }
    .u-filename {
        .db;
        .nobreak;
    }

    // 勾选
    .u-file-select-label {
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

        i {
            font-size: 12px;
            margin-top: 12px;
            transform: rotate(-45deg);
        }
    }
}
</style>
