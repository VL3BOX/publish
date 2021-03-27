<template>
    <div class="m-publish-fb">
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
            :excerptEnable="false"
            :tagEnable="false"
            :notifyEnable="true"
            :bannerEnable="true"
            :collectionEnable="true"
            @publish="toPublish"
            @draft="toDraft"
        >
            <!-- 💛 栏目字段 -->
            <template v-if="ready && !loading" v-loading="loading">
                <el-form-item label="原创">
                    <el-switch
                        v-model="post.original"
                        active-color="#13ce66"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="版本">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std">正式服</el-radio>
                        <el-radio label="origin">怀旧服</el-radio>
                        <el-radio label="all">全部</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 1.选择资料片 -->
                <el-form-item label="资料片" v-if="zlp_list">
                    <el-radio
                        v-for="(zlp, i) in zlp_list"
                        :label="zlp"
                        border
                        :key="i"
                        v-model="post.post_meta.fb_zlp"
                        @change="optionChange(zlp)"
                        >{{ zlp
                        }}<span class="u-level">{{
                            options.map[zlp]["level"]
                        }}</span></el-radio
                    >
                </el-form-item>

                <!-- 2.选择副本名称 -->
                <el-form-item label="副本名称" v-if="fb_list">
                    <el-radio
                        class="u-fb-thumbnail"
                        v-for="(fb, key) in fb_list"
                        :label="key"
                        :key="key"
                        v-model="post.post_meta.fb_name"
                        @change="changeSubtype(key)"
                    >
                        <img :src="fb.icon | thumbnail(fb.icon)" :alt="key" />
                        <span>{{ key }}</span>
                    </el-radio>
                </el-form-item>

                <!-- 选择BOSS -->
                <el-form-item label="首领名称" v-if="boss_list">
                    <el-checkbox-group v-model="post.post_meta.fb_boss">
                        <el-checkbox-button
                            v-for="(boss, i) in boss_list"
                            :label="boss"
                            :key="i"
                            >{{ boss }}</el-checkbox-button
                        >
                    </el-checkbox-group>
                </el-form-item>

                <!-- 选择难度模式 -->
                <el-form-item label="难度模式" v-if="level_list">
                    <el-checkbox-group v-model="post.post_meta.fb_level">
                        <el-checkbox
                            v-for="level in level_list"
                            :label="level.mode"
                            :key="level.mode + level.map_id"
                        ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </template>
        </boilerplate>
    </div>
</template>

<script>
// 依赖工具包
import _ from "lodash";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
// 静态数据
import fbmap from "@jx3box/jx3box-data/data/fb/fb_map.json";
// 本地模块
import boilerplate from "@/components/publish/boilerplate";
// 数据逻辑
import { getFbMap } from "@/service/fb.js";
// META空模板
const default_meta = {
    fb_zlp: '',
    fb_name: '',
    fb_boss: [],
    fb_level: [],
};

export default {
    name: "fb",
    props: [],
    data: function() {
        return {
            //基本 - 类型设置
            type: "fb",
            name: "副本攻略",
            loading: true,
            loaded: false,

            //选项 - 加载可选项
            options: {
                map: fbmap,
            },

            //字段 - meta表数据,可设置默认值
            meta: {},

            //文章 - 主表数据
            post: {
                ID: "", //文章ID
                // post_author               //无需设置,由token自动获取
                // post_type:"",             //类型(默认由boilerplate托管)
                post_subtype: '', //子类型(过滤查询用)
                post_title: "", //标题
                post_content: "", //主表内容字段,由后端接口配置是否双存储至meta表
                post_meta: default_meta,
                post_excerpt: "", //摘要
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
        };
    },
    computed: {
        // 是否选项加载就绪
        ready: function() {
            return Object.keys(this.options.map).length;
        },
        zlp_list: function() {
            return Object.keys(this.options.map);
        },
        fb_list: function() {
            let zlp = this.options.map[this.post.post_meta.fb_zlp]
            return _.get(zlp, "dungeon");
        },
        boss_list: function() {
            return _.get(this.fb_list[this.post.post_meta.fb_name], "boss");
        },
        level_list: function() {
            return _.get(this.fb_list[this.post.post_meta.fb_name], "maps");
        },
        default_zlp : function (){
            return _.get(this.zlp_list,0)
        },
        default_fb : function (){
            return Object.keys(this.options.map[this.default_zlp]['dungeon'])[0]
        }
    },
    methods: {
        // 加载
        init: function() {
            return this.doLoad(this).then(() => {
                if (isEmptyMeta(this.post.post_meta))
                    this.post.post_meta = default_meta;
                this.loading = false;
                console.log("Init Post:", this.post);
            });
        },
        // 发布
        toPublish: function() {
            this.doPublish(this.$store.state, this);
        },
        // 草稿
        toDraft: function() {
            this.doDraft(this.$store.state, this);
        },

        // 设置默认资料片和副本
        setDefaultOption : function (){
            this.post.post_subtype = this.default_fb
            this.post.post_meta.fb_name = this.default_fb
            this.post.post_meta.fb_zlp = this.default_zlp
        },
        // 当切换资料片时
        optionChange: function(zlp) {
            let first = Object.keys(this.options.map[zlp]["dungeon"])[0];
            this.post.post_subtype = first
            this.post.post_meta.fb_name = first;
            this.post.post_meta.fb_boss = [];
            this.post.post_meta.fb_level = [];
        },
        // 当副本切换时
        changeSubtype: function(subtype) {
            this.$store.commit("changeSubtype", subtype);
            this.post.post_meta.fb_boss = [];
            this.post.post_meta.fb_level = [];
        },
    },
    filters: {
        thumbnail: function(url) {
            return __imgPath + url + "?v=" + Date.now();
        },
    },
    mounted: function() {
        // 初始化默认文章数据
        this.setDefaultOption()
        this.init()
        // 加载最新副本map
        getFbMap().then((res) => {
            this.options.map = res.data;
            this.setDefaultOption()
        });
    },
    components: {
        boilerplate,
    },
};
</script>

<style lang="less">
@import "../assets/css/fb.less";
</style>
