<template>
    <boilerplate class="m-publish-macro" :type="type" :name="name" :post="post">
        <!-- 💛 栏目字段 -->
        <template>
            <!-- 语言：简体/繁体 -->
            <publish-lang v-model="post.lang"></publish-lang>
            <!-- 资料片 -->
            <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
            <!-- 心法 -->
            <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
            

            <!-- 3.宏区域 -->
            <el-divider content-position="left">宏</el-divider>
            <div class="m-macro-box">
                <div class="m-macro-header">
                    <el-button
                        class="m-macro-addbutton"
                        icon="el-icon-circle-plus-outline"
                        type="primary"
                        @click="addMacro"
                    >添加宏</el-button>
                    <a
                        class="m-macro-docs el-button el-button--primary is-plain el-button--small"
                        target="_blank"
                        href="https://www.jx3box.com/tool/265/"
                    >
                        <i class="el-icon-s-management"></i>
                        宏命令完整参考手册
                    </a>
                    <a
                        class="m-macro-help el-button el-button--success is-plain el-button--small"
                        href="https://www.jx3box.com/tool/14671/"
                        target="_blank"
                    >
                        <i class="el-icon-info"></i> 点击查看发布帮助
                    </a>
                </div>

                <el-tabs v-model="activeMacroIndex" type="card" closable @tab-remove="removeMacro">
                    <el-tab-pane
                        v-for="(item, i) in post.post_meta.data"
                        :key="i"
                        :name="i + 1 + ''"
                    >
                        <span slot="label">
                            <img class="u-tabicon" :src="icon(item)" />
                            {{ i + 1 + "号位-" + item.name }}
                        </span>
                        <div class="m-macro-cloud m-macro-item">
                            <h5 class="u-title">
                                云端宏图标/名称
                                <a class="u-icon-links" href="/app/icons" target="_blank">
                                    <i class="el-icon-question"></i>
                                    图标大全
                                </a>
                            </h5>
                            <div class="u-group">
                                <div class="u-subblock m-macro-icon">
                                    <el-input
                                        v-model="item.icon"
                                        placeholder="图标ID"
                                        :minlength="1"
                                        :maxlength="10"
                                        :max="30000"
                                        :min="0"
                                    >
                                        <template slot="prepend">
                                            <img class="u-icon" :src="icon(item)" />
                                        </template>
                                    </el-input>
                                </div>
                                <div class="u-subblock m-macro-name">
                                    <el-input
                                        v-model="item.name"
                                        placeholder="每个宏名称请使用自己名下唯一命名"
                                        :minlength="1"
                                        :maxlength="20"
                                        show-word-limit
                                        @change="checkDataName(item)"
                                    >
                                        <template slot="prepend">
                                            <b class="u-feed">
                                                {{ nickname }}#{{
                                                item.name
                                                }}
                                            </b>
                                        </template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div class="m-macro-talent m-macro-item">
                            <h5 class="u-title">奇穴方案</h5>
                            <div class="m-macro-talent-simulator">
                                <div class="qx-container"></div>
                            </div>
                            <el-input
                                v-model="item.talent"
                                placeholder="奇穴方案编码"
                                @change="checkTalent(item)"
                            >
                                <template slot="prepend">
                                    <a class="u-get" target="_blank" href="/app/talent">
                                        <i class="el-icon-warning"></i>
                                        获取编码
                                    </a>
                                </template>
                            </el-input>
                        </div>
                        <div class="m-macro-macro">
                            <h5 class="u-title">
                                宏内容
                                <a class="u-icon-links" href="/app/macroeditor" target="_blank">
                                    <i class="el-icon-question"></i>
                                    智能中文宏编辑器
                                </a>
                            </h5>
                            <el-input
                                v-model="item.macro"
                                placeholder="注释请写在说明中,勿写在宏内部"
                                :minlength="1"
                                :maxlength="128"
                                show-word-limit
                                type="textarea"
                                :rows="12"
                            ></el-input>
                        </div>
                        <div class="m-macro-equip">
                            <h5 class="u-title">
                                配装方案
                                <a class="u-icon-links" href="/tool/19309" target="_blank">
                                    <i class="el-icon-question"></i>
                                    魔盒清单使用指南
                                </a>
                            </h5>
                            <el-input v-model="item.equip" placeholder="配装方案编号">
                                <template slot="prepend">
                                    <el-select v-model="item.equip_type" placeholder="请选择">
                                        <el-option
                                            v-for="(label,
                                                val) in options.equip_types"
                                            :key="val"
                                            :label="label"
                                            :value="val"
                                        ></el-option>
                                    </el-select>
                                </template>
                            </el-input>
                        </div>
                        <el-form-item label="其它" class="m-macro-misc">
                            <el-row>
                                <el-col :span="8" class="u-speed">
                                    <el-input v-model="item.speed" placeholder="填写推荐的急速阈值">
                                        <template slot="prepend">急速阈值</template>
                                    </el-input>
                                </el-col>
                                <el-col :span="8"></el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="说明" class="m-macro-desc">
                            <el-input
                                v-model="item.desc"
                                type="textarea"
                                placeholder="重要说明（会出现在宏第一行）"
                            ></el-input>
                        </el-form-item>
                        <div class="m-macro-op">
                            <el-button
                                class="u-macro-remove-fix"
                                @click="removeMacro(i)"
                                type="danger"
                                plain
                                icon="el-icon-delete"
                                size="small"
                            >移除本宏</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </template>
    </boilerplate>
</template>

<script>
// 依赖工具包
import lodash from "lodash";
import { sterilizer } from "sterilizer/index.js";
import User from "@jx3box/jx3box-common/js/user";
import isEmptyMeta from "@/utils/isEmptyMeta.js";

import {
    __ossMirror,
    __iconPath,
    __imgPath,
} from "@jx3box/jx3box-common/data/jx3box.json";

// 本地模块
import boilerplate from "@/components/cms_boilerplate";
import publish_lang from "@/components/publish_lang";
import publish_zlp from "@/components/publish_zlp";
import publish_xf from "@/components/publish_xf";

// 数据逻辑
import { syncRedis } from "@/service/macro.js";
// META空模板
const default_meta = {
    data: [
        {
            name: "",
            icon: 13,
            talent: "",
            macro: "",
            speed: "",
            equip: "",
            equip_type: "jx3box",
            desc: "",
        },
    ],
};

export default {
    name: "macro",
    components: {
        boilerplate,
        "publish-lang": publish_lang,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
    },
    props: [],
    data: function () {
        return {
            //基本 - 类型设置
            type: "macro",
            name: "云端宏",
            loaded: false,

            //选项
            options: {
                equip_types: {
                    jx3box: "魔盒清单",
                    // tuilan: "推栏",
                    // j3pz: "胖叔配装器",
                },
            },

            //字段
            meta: {},

            //文章 - 主表数据
            post: {
                ID: "", //文章ID
                // post_author               //无需设置,由token自动获取
                // post_type:"",             //类型(默认由boilerplate托管)
                post_subtype: "通用", //子类型(过滤查询用)
                post_title: "", //标题
                post_content: "", //主表内容字段,由后端接口配置是否双存储至meta表
                post_meta: default_meta,
                post_excerpt: "", //主表摘要
                post_mode: "tinymce", //编辑模式(会影响文章详情页渲染规则)
                post_banner: "", //头条图,管理员可见
                post_status: "", //由发布按钮、草稿按钮决定
                // post_tags: [],            //标签列表
                post_collection: "", //文集

                original: 0, //是否原创
                client: "std", //空为正式服,origin为怀旧服
                lang: "cn", //简体/繁体
                zlp: "", //资料片
            },

            //扩展 - 部分栏目文章不应启用该功能
            extend: {
                feedEnable: false, //是否通知订阅用户
                followEnable: false, //是否通知粉丝
                tencentEnable: false, //是否同步至腾讯文档
                weiboEnable: false, //是否同步至微博头条文章
                tuilanEnable: false, //是否同步至推栏
            },

            // 杂项
            activeMacroIndex: "1",
            nickname: User.getInfo().name,
        };
    },
    computed: {},
    methods: {
        // 加载
        init: function () {
            return this.doLoad(this).then(() => {
                if (isEmptyMeta(this.post.post_meta))
                    this.post.post_meta = default_meta;
                console.log("Init Post:", this.post);
            });
        },
        // 发布
        toPublish: function () {
            this.postData();
        },
        // 草稿
        toDraft: function () {
            this.postData();
        },
        // 提交
        postData: function () {
            this.check();
            this.doPublish(this.build(), this, false).then((res) => {
                syncRedis(res.data.data, this).then((redis_result) => {
                    this.finish(res.data.msg, res.data.data.ID);
                });
            });
        },
        // 跳转
        finish: function (msg, id) {
            this.$message({
                message: msg,
                type: "success",
            });
            setTimeout(() => {
                location.href = "/" + this.type + "/" + id;
            }, 500);
        },

        // 设置检索meta
        build: function () {
            let data = this.$store.state;
            data.post.meta_1 = data.post.post_meta.zlp; //资料片
            data.post.meta_2 = ~~lodash.get(
                xfmap[data.post.post_subtype],
                "id"
            ); //心法id
            data.post.meta_4 = data.post.post_meta.lang; //语言
            return data;
        },

        // 添加宏
        addMacro: function () {
            if (this.post.post_meta.data.length > 7) {
                this.$alert("已经达到添加上限", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            let index = this.post.post_meta.data.length + 1 + "";
            this.post.post_meta.data.push({
                name: "",
                icon: 13,
                talent: "",
                macro: "",
                speed: "",
                equip: "",
                equip_type: "",
                desc: "",
            });
            this.activeMacroIndex = index;
        },
        // 删除宏
        removeMacro: function (name) {
            if (this.post.post_meta.data.length < 2) {
                this.$alert("必须保留1个宏", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个宏吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.post.post_meta.data.splice(i, 1);
                        // 调整focus位置
                        this.activeMacroIndex = i + "";
                    }
                },
            });
        },

        // 检查版本名
        check: function () {
            if (!this.post.post_title) {
                this.post.post_title = User.getInfo().name + "的宏";
            }
            this.post.post_meta.data.forEach((item, i) => {
                if (!item.name) {
                    item.name = "未标题-" + i;
                }
            });
        },
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            if (!name) {
                this.$notify.error({
                    title: "错误",
                    message: "宏名称不允许包含特殊字符,不能为空",
                });
                return;
            }
            this.$set(data, "name", name);
        },
        checkTalent: function (data) {
            try {
                JSON.parse(data.talent);
            } catch (e) {
                this.$notify.error({
                    title: "错误",
                    message: "奇穴编码格式错误",
                });
            }
        },

        // 图标
        icon: function (item) {
            let id = isNaN(item.icon) ? 13 : ~~item.icon;
            id = Math.max(0, Math.min(id, 30000));
            this.$set(item, "icon", id);
            return __iconPath + "icon/" + id + ".png";
        },
        changeSubtype: function () {
            let iconid = xfmap[this.post.post_subtype]["icon"];
            this.$set(this.post.post_meta.data[0], "icon", iconid);
        },
    },
    mounted: function () {
        // 初始化默认文章数据
        this.init();
    },
};
</script>

<style lang="less">
@import "../assets/css/macro.less";
</style>
