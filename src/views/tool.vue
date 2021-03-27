<template>
    <div class="m-dashboard-publish-tool">
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
            @draft="toDraft"
        >
            <template>
                <el-form-item label="原创">
                    <el-switch
                        v-model="post.original"
                        active-color="#13ce66"
                    >
                    </el-switch>
                </el-form-item>

                <el-form-item label="版本">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std" :disabled="isOriginPlugin">正式服</el-radio>
                        <el-radio label="origin">怀旧服</el-radio>
                        <el-radio label="all" :disabled="isOriginPlugin">全部</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="类型">
                    <el-radio-group v-model="post.post_subtype">
                        <el-radio
                            :label="key"
                            border
                            v-for="(type, key) in options.types"
                            :key="key"
                            v-show="isAdminMode(key) || isToolMode(key) || isPluginMode(key)"
                            >{{ type }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
            </template>
        </boilerplate>
    </div>
</template>

<script>
import boilerplate from "@/components/publish/boilerplate";
import { __ossMirror,__imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
// import lodash from "lodash";
import types from "../assets/data/tool.json";
import User from '@jx3box/jx3box-common/js/user'
export default {
    name: "tool",
    props: [],
    data: function() {
        return {
            //基本 - 类型设置
            type: "tool",
            name: "教程工具",
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
                post_subtype: "1", //子类型(过滤查询用)
                post_title: "", //标题
                post_content: "", //主表内容字段,由后端接口配置是否双存储至meta表
                post_meta: {},
                post_excerpt: "", //主表摘要
                post_mode: "tinymce", //编辑模式(会影响文章详情页渲染规则)
                post_banner: "", //头条图,管理员可见
                post_status: "", //由发布按钮、草稿按钮决定
                // post_tags: [],            //标签列表
                post_collection: "", //文集
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

            isOriginPlugin : false
        };
    },
    computed: {
        
    },
    methods: {
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
            return data;
        },
        // 加载
        init: function() {
            return this.doLoad(this).then((data) => {});
        },

        isPluginMode : function (key){
            return this.isOriginPlugin && key== 5
        },
        isToolMode : function (key){
            return !this.isOriginPlugin && key!= 5 && key!=4
        },
        isAdminMode : function (key){
            return !this.isOriginPlugin && key!= 5 && User.isAdmin()
        }
    },
    filters: {},
    mounted: function() {
        // 初始化默认文章数据
        this.init().then(() => {
            console.log("Init Post:", this.post);
        });

        // 怀旧服插件
        if(!this.$route.params.id && this.$route.query.subtype == 5){
            this.post.post_subtype = this.$route.query.subtype
            this.post.client = 'origin'
            this.name = '插件下载'
            this.isOriginPlugin = true
        }
    },
    components: {
        boilerplate,
    },
};
</script>

<style lang="less">
@import "../assets/css/tool.less";
</style>
