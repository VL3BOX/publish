<template>
    <div class="m-publish-jx3dat">
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
            :contentEnable="true"
            :markdownEnable="false"
            :excerptEnable="true"
            :tagEnable="false"
            :notifyEnable="true"
            :bannerEnable="true"
            :collectionEnable="true"
            @publish="toPublish"
            publish_text="发布为公开"
            @draft="toDraft"
            draft_text="发布为私有"
        >
            <!-- 💛 栏目字段 -->
            <template>
                <el-form-item label="原创">
                    <el-switch
                        v-model="post.original"
                        active-color="#13ce66"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="语言">
                    <el-radio-group v-model="post.post_meta.lang">
                        <el-radio label="cn">简体中文</el-radio>
                        <el-radio label="tr">繁體中文</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="版本">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std">正式服</el-radio>
                         <el-radio label="origin">怀旧服</el-radio>
                        <el-radio label="all">全部</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 1.数据类型 -->
                <el-form-item label="类型" class="m-jx3dat-subtypes">
                    <el-radio
                        v-for="(name, key) in options.type_map"
                        :label="key"
                        border
                        :key="key"
                        v-model="post.post_meta.type"
                        @change="changeSubtype(post.post_meta.type)"
                        :disabled="id && post.post_subtype != key"
                        >{{ name }}</el-radio
                    >
                </el-form-item>

                <!-- 2.tag -->
                <el-form-item label="标签" v-if="post.post_meta.type == 1">
                    <el-checkbox-group v-model="post.post_meta.tag">
                        <el-checkbox
                            v-for="item in options.tag_list"
                            :label="item"
                            :key="item"
                        ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- 3.团控数据类型字段 -->
                <template v-if="post.post_meta.type == 1">
                    <el-divider content-position="left">数据</el-divider>
                    <div class="m-data-box">
                        <div class="m-data-header">
                            <el-button
                                class="m-data-addbutton"
                                icon="el-icon-circle-plus-outline"
                                type="primary"
                                @click="addDBM"
                                >添加数据</el-button
                            >
                            <a
                                class="m-data-help el-button el-button--success is-plain el-button--small"
                                href="https://www.jx3box.com/tool/13912"
                                target="_blank"
                            >
                                <i class="el-icon-info"></i> 点击查看发布帮助
                            </a>
                        </div>

                        <el-tabs
                            v-model="activeIndex"
                            type="card"
                            closable
                            @tab-remove="delDBM"
                        >
                            <el-tab-pane
                                v-for="(item, i) in post.post_meta.data"
                                :key="i"
                                :name="i + 1 + ''"
                            >
                                <span slot="label" class="m-data-tab-label">
                                    <i class="el-icon-box"></i>
                                    {{ item.name }}
                                </span>
                                <div class="m-data-item">
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
                                                :placeholder="
                                                    i == 0
                                                        ? '默认版'
                                                        : '版本名称'
                                                "
                                            >
                                                <template slot="prepend">
                                                    <b class="u-feed">
                                                        {{ user.name
                                                        }}{{
                                                            item.name ==
                                                            "默认版"
                                                                ? ""
                                                                : "#" +
                                                                  item.name
                                                        }}
                                                    </b>
                                                </template>
                                            </el-input>
                                        </div>
                                        <div
                                            class="u-subblock u-status-wrapper"
                                        >
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
                                                <span class="u-status">
                                                    {{
                                                        item.status
                                                            ? "公开"
                                                            : "私有"
                                                    }}
                                                </span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div class="m-data-item">
                                    <h5 class="u-title">数据标题</h5>
                                    <el-input
                                        v-model="item.desc"
                                        placeholder="数据描述"
                                        maxlength="50"
                                        show-word-limit
                                    ></el-input>
                                </div>
                                <div class="m-data-item m-data-jx3dat">
                                    <h5 class="u-title">数据文件</h5>
                                    <div class="u-warning">
                                        <i class="el-icon-warning-outline"></i>
                                        当前数据文件将作为
                                        <b>{{ item.name }}</b
                                        >的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                                    </div>
                                    <input
                                        class="u-data-input"
                                        type="file"
                                        :id="'jx3dat_' + i"
                                        @change="uploadDBM(item, i)"
                                    />
                                    <el-button
                                        type="primary"
                                        icon="el-icon-s-promotion"
                                        plain
                                        size="small"
                                        @click="selectDBM(i)"
                                        >上传数据文件</el-button
                                    >
                                    <span class="u-data-remark">{{
                                        item.origin_name
                                    }}</span>
                                    <!-- <el-button
                                        size="small"
                                        type="primary"
                                        plain
                                        @click="uploadDBM(item, i)"
                                        icon="el-icon-s-promotion"
                                        >开始上传</el-button
                                    >-->
                                    <el-input
                                        class="u-fileurl"
                                        :class="{ isUploaded: item.isUploaded }"
                                        @change="aniDBM(item)"
                                        placeholder="数据地址"
                                        :disabled="true"
                                        :value="item.file"
                                        v-if="item.file"
                                    >
                                        <template slot="prepend">
                                            <span class="u-status"
                                                >当前文件地址</span
                                            >
                                        </template>
                                        <template slot="append">
                                            <span
                                                class="u-copy"
                                                v-clipboard:copy="item.file"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"
                                            >
                                                <i
                                                    class="el-icon-document-copy"
                                                ></i>
                                                <span>点击复制</span>
                                            </span>
                                        </template>
                                    </el-input>
                                </div>
                                <!-- <div class="m-data-item">
                                    <h5 class="u-title">云数据ID</h5>
                                    <el-input
                                        placeholder="云数据ID"
                                        :disabled="true"
                                    >
                                    </el-input>
                                </div>-->
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="m-data-more">
                        <div class="u-more" @click="toggleMoreFeed">
                            <i
                                :class="
                                    moreFeedsVisible
                                        ? 'el-icon-arrow-up'
                                        : 'el-icon-arrow-down'
                                "
                            ></i>
                            <span>其它订阅号</span>
                        </div>
                        <el-row class="u-tr" v-show="moreFeedsVisible">
                            <el-col :span="24">
                                <el-input
                                    v-model="post.post_meta.github"
                                    placeholder="(非必填)"
                                >
                                    <template slot="prepend"
                                        >Github订阅号</template
                                    >
                                    <template slot="append">@github</template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row class="u-tr" v-show="moreFeedsVisible">
                            <el-col :span="24">
                                <el-input
                                    v-model="post.post_meta.gitee"
                                    placeholder="(非必填)"
                                >
                                    <template slot="prepend"
                                        >Gitee订阅号</template
                                    >
                                    <template slot="append">@gitee</template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row class="u-tr" v-show="moreFeedsVisible">
                            <el-col :span="24">
                                <el-input
                                    v-model="post.post_meta.aliyun"
                                    placeholder="(非必填)"
                                >
                                    <template slot="prepend"
                                        >Aliyun订阅号</template
                                    >
                                    <template slot="append">@aliyun</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                </template>

                <!-- 4.其它类型上传字段 -->
                <el-form-item v-else label="数据" class="m-jx3dat-other">
                    <input
                        class="u-data-input"
                        type="file"
                        id="otherdata"
                        @change="uploadDat"
                    />
                    <el-button
                        type="primary"
                        icon="el-icon-s-promotion"
                        plain
                        size="medium"
                        @click="selectDat"
                        >上传数据文件</el-button
                    >
                    <span class="u-data-remark">{{
                        post.post_meta.origin_name
                    }}</span>
                    <el-input
                        v-if="post.post_meta.down"
                        class="u-fileurl"
                        placeholder="数据地址"
                        :disabled="true"
                        :value="post.post_meta.down"
                    >
                        <template slot="prepend">
                            <span class="u-status">当前文件地址</span>
                        </template>
                        <template slot="append">
                            <span
                                class="u-copy"
                                v-clipboard:copy="post.post_meta.down || ''"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError"
                            >
                                <i class="el-icon-document-copy"></i>
                                <span>点击复制</span>
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
            </template>
        </boilerplate>
    </div>
</template>

<script>
// 依赖工具包
import _ from 'lodash'
import { sterilizer } from "sterilizer/index.js";
import User from "@jx3box/jx3box-common/js/user";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
// 静态数据
import { jx3dat_types, jx3dat_tags } from "../assets/data/jx3dat.json";
// 本地模块
import boilerplate from "../components/publish/boilerplate";
// 数据逻辑
import { uploadHub, uploadData, syncRedis, createPost, updatePost, hasFeed } from "../service/jx3dat.js";
// META空模板
const default_meta = {
    //新版,字段表合并至主表,减少数据库查询次数
    type: "1",
    lang: "cn",
    data: [
        {
            name: "默认版",
            desc: "",
            status: true,
            file: "",
            version: "",
            origin_name: "",
            upload_status: false,
        },
    ],
    tag: [],
    github: "",
    gitee: "",
    aliyun: "",
    down: "",
    origin_name: "",
};

export default {
    name: "jx3dat",
    props: [],
    data: function() {
        return {
            //基本 - 类型设置
            type: "jx3dat",
            name: "插件数据",
            loaded: false,

            //选项 - 加载可选项
            options: {
                type_map: jx3dat_types,
                tag_list: jx3dat_tags,
            },

            //字段 - meta表数据,可设置默认值
            meta: {},

            //文章 - 主表数据
            post: {
                ID: "",                      //文章ID
                // post_author               //无需设置,由token自动获取
                // post_type:"",             //类型(默认由boilerplate托管)
                post_subtype: "1",           //子类型(过滤查询用)
                post_title: "",              //标题
                post_content: "",            //主表内容字段,由后端接口配置是否双存储至meta表
                post_meta: default_meta,
                post_excerpt: "",            //主表摘要
                post_mode: "tinymce",        //编辑模式(会影响文章详情页渲染规则)
                post_status: "",             //由发布按钮、草稿按钮决定
                post_banner: "",             //头条图,管理员可见
                // post_tags: [],            //标签列表
                post_collection: "", //文集
                original: 0, //是否原创
                client: "std", //空为正式服,origin为怀旧服
            },

            //扩展 - 部分栏目文章不应启用该功能
            extend: {
                feedEnable: false,           //是否通知订阅用户
                followEnable: false,         //是否通知粉丝
                tencentEnable: false,        //是否同步至腾讯文档
                weiboEnable: false,          //是否同步至微博头条文章
                tuilanEnable: false,         //是否同步至推栏
            },

            // 杂项
            user: {},
            tempname: "",
            moreFeedsVisible: false,
            activeIndex: "1",
            isVIP : false,
            hasFeed : false
        };
    },
    computed: {
        totalVersions: function() {
            return this.post.post_meta.data.length + 1;
        },
        id : function (){
            return this.$route.params.id
        },
        hasOneFeed : function (){
            return this.id && this.hasFeed
        }
    },
    methods: {
        // 加载
        init: function() {
            return this.doLoad(this).then(() => {
                // 初始化默认文章数据
                if (isEmptyMeta(this.post.post_meta))
                this.post.post_meta = _.cloneDeep(default_meta);
            }).then(() => {
                // 如果是创建模式，订阅号只允许创建1个
                if(!this.id){
                    hasFeed().then((res) => {
                        this.hasFeed = !!res.data.data
                        if(this.hasFeed){
                            this.post.post_subtype = '2'
                            this.post.post_meta.type = '2'
                        }
                    })
                }
            })
        },
        // 发布
        toPublish: function() {
            // console.log(this.build())
            this.postData()
        },
        // 草稿
        toDraft: function() {
            this.postData()
        },
        // 提交
        postData : function (){
            if(this.id){
                updatePost(this.id,this.build()).then((res) => {
                    this.syncData(res)
                }).catch((err) => {
                    this.$store.commit('endProcess')
                })
            }else{
                createPost(this.build()).then((res) => {
                    this.syncData(res)
                }).catch((err) => {
                    this.$store.commit('endProcess')
                })
            }
        },
        syncData : function (res){
            if (this.post.post_subtype == 1) {
                syncRedis(res.data.data, this).then((redis_result) => {
                    this.finish(res.data.msg, res.data.data.ID, this.type);
                });
            } else {
                this.finish(res.data.msg, res.data.data.ID, this.type);
            }
        },
        // 跳转
        finish: function(msg, id, type) {
            this.$message({
                message: msg,
                type: "success",
            });
            setTimeout(() => {
                location.href = "/" + type + "/" + id;
            }, 500);
        },

        // 设置检索meta
        build: function() {
            let data = this.$store.state;
            data.post.meta_1 = data.post.post_meta.tag.toString(); //标签
            data.post.meta_4 = data.post.post_meta.lang;           //语言
            return data;
        },

        // 上传DBM
        checkDataName: function(data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            this.$set(data, "name", name);
        },
        selectDBM: function(i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDBM: function(item, i) {
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
                    item.version = Date.now();
                    item.upload_status = true;
                }
            });
        },
        addDBM: function() {
            // 目前设置最多3个版本
            if (this.post.post_meta.data.length >= 3 && !this.isVIP) {
                this.$alert('默认只能设置3个版本，<a href="/vip/premium?from=jx3dat_feed" target="_blank">开通高级版账号</a>无限制', '消息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }

            this.post.post_meta.data.push({
                name: "版本" + this.totalVersions,
                desc: "",
                status: true,
                file: "",
            });

            let index = this.post.post_meta.data.length + 1 + "";
            this.activeMacroIndex = index;
        },
        delDBM: function(name) {
            // this.post.post_meta.data.splice(i, 1);

            if (name == 1) {
                this.$alert("✘ 必须保留默认数据", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            if (this.post.post_meta.data.length < 2) {
                this.$alert("✘ 必须保留默认数据", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个数据吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.post.post_meta.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = i + "";
                    }
                },
            });
        },

        // 上传其他数据
        changeSubtype: function(subtype) {
            this.$store.commit("changeSubtype", subtype);
        },
        selectDat: function() {
            let fileInput = document.getElementById("otherdata");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDat: function(e) {
            let fileInput = document.getElementById("otherdata");
            let file = fileInput.files[0];
            if (!file) {
                this.$alert("请先选择文件", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }

            // 显示原文件名
            this.post.post_meta.origin_name = file.name;

            let formdata = new FormData();
            formdata.append("file", file);
            uploadData(formdata, this).then((res) => {
                this.post.post_meta.down = res.data.data.list[0];

                this.$message({
                    message: res.data.msg,
                    type: "success",
                });

                this.tempname = file.name;
            });
        },
        aniDBM: function(item) {
            item.isUploaded = true;
            setTimeout(() => {
                item.isUploaded = false;
            }, 2000);
        },
        toggleMoreFeed: function() {
            this.moreFeedsVisible = !this.moreFeedsVisible;
        },
        onCopy: function(val) {
            this.$notify({
                title: "复制成功",
                message: "复制成功",
                type: "success",
            });
        },
        onError: function() {
            this.$notify.error({
                title: "复制失败",
                message: "复制失败",
            });
        },
    },
    created : function (){
        // 用户信息
        this.user = User.getInfo();
        User.isVIP().then((data) => {
            this.isVIP = data
        })
    },
    mounted: function() {
        this.init()
    },
    watch : {
        id : function (){
            this.init()
        }
    },
    filters: {},
    components: {
        boilerplate,
    },
};
</script>

<style lang="less">
@import "../assets/css/jx3dat.less";
</style>
