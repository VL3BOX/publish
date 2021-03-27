<template>
    <div class="m-dashboard-publish-share">
        <!-- 💛 预设选项 -->
        <!-- 
            localDraft : 是否显示本地草稿按钮
            infoEnable : 是否包含自定义字段
            markdownEnable : 是否开启markdown编辑器
            excerptEnable : 是否开启摘要
            tagEnable : 是否开启标签
            notifyEnable : 是否开启通知等扩展功能
            bannerEnable : 是否开启头条图功能,开启后仍旧需要签约作者及管理员才可见
         -->
        <boilerplate
            v-if="loaded"
            :name="name"
            :type="type"
            :post="post"
            :meta="meta"
            :extend="extend"
            :infoEnable="true"
            :contentEnable="false"
            :markdownEnable="false"
            :excerptEnable="true"
            :tagEnable="false"
            :notifyEnable="false"
            :bannerEnable="false"
            @publish="toPublish"
            @draft="toDraft"
        >
            <template>
                <el-form-item label="原创">
                    <el-switch v-model="post.original" active-color="#13ce66">
                    </el-switch>
                </el-form-item>

                <el-form-item label="版本">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std">正式服</el-radio>
                        <el-radio label="origin">怀旧服</el-radio>
                        <el-radio label="all">全部</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="类型">
                    <el-radio-group v-model="post.post_subtype">
                        <el-radio
                            border
                            v-for="(type, i) in options.types"
                            :label="type"
                            :key="i"
                            >{{ type }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="作者">
                    <el-input
                        v-model="post.post_meta.author"
                        placeholder="请注明原作者"
                    ></el-input>
                </el-form-item>

                <el-form-item label="图册">
                    <album
                        :imgList="post.post_meta.pics"
                        @albumChange="updateAlbum"
                    ></album>
                </el-form-item>

                <el-form-item label="数据">
                    <input
                        class="u-data-input"
                        type="file"
                        id="face_file"
                        @change="uploadData"
                    />
                    <el-button
                        type="primary"
                        @click="selectData"
                        icon="el-icon-upload2"
                        >上传脸型数据</el-button
                    >
                    <span class="u-data-ready" v-show="post.post_meta.file">
                        <i class="el-icon-success"></i>
                        已上传
                    </span>
                </el-form-item>

                <el-form-item label="分析结果">
                    <el-input
                        v-model="post.post_meta.data"
                        type="textarea"
                        :rows="6"
                    ></el-input>
                </el-form-item>
            </template>
        </boilerplate>
    </div>
</template>

<script>
import boilerplate from "@/components/publish/boilerplate";
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box.json";
import album from "@/components/publish/album.vue";
// import lodash from "lodash";
import { uploadData, parseData } from "../service/share.js";
const types = ["成男", "成女", "正太", "萝莉"];
const { parse } = require("lua-json");

export default {
    name: "share",
    props: [],
    data: function() {
        return {
            //基本 - 类型设置
            type: "share",
            name: "捏脸分享",
            loaded: false,

            //选项
            options: {
                types: types,
            },

            //字段
            meta: {},

            //文章 - 主表数据
            post: {
                ID: "", //文章ID
                // post_author               //无需设置,由token自动获取
                // post_type:"",             //类型(默认由boilerplate托管)
                post_subtype: "成男", //子类型(过滤查询用)
                post_title: "", //标题
                post_content: "", //主表内容字段,由后端接口配置是否双存储至meta表
                post_meta: {
                    author: "", //原作者
                    pics: [], //图片
                    file: "", //文件
                    data: "", //解析数据
                },
                post_excerpt: "", //主表摘要
                post_mode: "tinymce", //编辑模式(会影响文章详情页渲染规则)
                post_banner: "", //头条图,管理员可见
                post_status: "", //由发布按钮、草稿按钮决定
                // post_tags: [],            //标签列表
                original: 0, //是否原创
                client: "std", //空为正式服,origin为怀旧服
            },

            //扩展 - 部分栏目文章不应启用该功能
            extend: {
                feedEnable: false, //是否通知订阅用户
                followEnable: false, //是否通知粉丝
                tencentEnable: false, //是否同步至腾讯文档
                weiboEnable: false, //是否同步至微博头条文章
                tuilanEnable: false, //是否同步至推栏
            },
        };
    },
    computed: {},
    methods: {
        // 加载
        init: function() {
            return this.doLoad(this).then((data) => {});
        },
        // 发布
        toPublish: function() {
            // console.log(this.build());
            this.doPublish(this.build(), this).then((res) => {});
        },
        // 草稿
        toDraft: function() {
            this.doDraft(this.build(), this).then((res) => {});
        },
        // 设置检索meta
        build: function() {
            let data = this.$store.state;
            data.post.meta_1 = data.post.post_meta.author; //原作者
            return data;
        },

        // 图集
        updateAlbum: function(filelist) {
            let imglist = [];
            filelist.forEach((img) => {
                imglist.push({
                    name: img.name,
                    url: img.url,
                });
            });
            this.post.post_meta.pics = imglist;
        },
        // 数据
        selectData: function(i) {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadData: function(e) {
            let formdata = new FormData();
            let file = e.target.files[0];
            formdata.append("file", file);
            uploadData(formdata, this).then((res) => {
                this.post.post_meta.file = res.data.data.list[0];
                this.$message({
                    message: '上传成功',
                    type: "success",
                });
            });
            this.parseData(file);
        },
        // 解析数据
        parseData: function(facedata) {

            const vm = this

            // 如果不支持本地读取
            if (!FileReader) return;

            let fr = new FileReader();
            fr.readAsText(facedata);
            fr.onload = function(e) {
                console.log("读取成功...开始执行分析...");

                let data = e.target.result;
                data = "return" + data.slice(data.indexOf("{"));

                try {
                    vm.post.post_meta.data = JSON.stringify(parse(data));
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
            fr.onerror = function(e) {
                vm.$notify.error({
                    title: "错误",
                    message: "无法解析脸型数据",
                });
            };
        },
    },
    filters: {},
    mounted: function() {
        // 初始化默认文章数据
        this.init().then(() => {
            console.log("Init Post:", this.post);
        });
    },
    components: {
        boilerplate,
        album,
    },
};
</script>

<style lang="less">
@import "../assets/css/share.less";
</style>
