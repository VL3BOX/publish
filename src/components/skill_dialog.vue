<template>
    <el-dialog
        class="c-large-dialog"
        :visible="modelValue"
        @close="close"
        title="技能库"
        append-to-body
        custom-class="m-skill-dialog"
    >
        <el-tabs v-model="activeName" type="card" class="m-skill-tabs">
            <el-tab-pane label="门派武学" name="special">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-s-order"></i>
                        <b>门派武学</b>
                    </div>
                </template>
            </el-tab-pane>
            <el-tab-pane label="全部技能" name="all">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-menu"></i>
                        <b>全部技能</b>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
        <div class="m-select-content">
            <div v-show="activeName === 'all'">
                <div class="m-database-search">
                    <el-radio-group class="u-client" v-model="client" @change="search">
                        <el-radio-button label="std">重制</el-radio-button>
                        <el-radio-button label="origin">缘起</el-radio-button>
                    </el-radio-group>
                    <el-input
                        class="u-input"
                        placeholder="请输入 ID 或 名称"
                        v-model="query"
                        @keyup.enter.native="search"
                    >
                        <template slot="prepend">ID ／名称</template>
                    </el-input>
                </div>

                <div v-if="total && done" class="m-resource-count">
                    <i class="el-icon-s-data"></i> 共找到 <b>{{ total }}</b> 条记录
                </div>
                <ul class="m-resource-list">
                    <li v-for="(o, i) in skill" class="u-item" :key="i" @click="selectSkill(o, i)" ref="skill">
                        <span class="u-id">ID:{{ o.SkillID }}</span>
                        <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                        <span class="u-primary">
                            <span class="u-name">
                                {{ o.Name }}
                                <em v-if="o.SkillName">({{ o.SkillName }})</em>
                            </span>
                            <span class="u-content">
                                {{ filterRaw(o.Desc) }}
                            </span>
                        </span>
                    </li>
                </ul>
                <el-alert v-if="!skill.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>

                <template v-if="multipage">
                    <!-- 下一页 -->
                    <el-button
                        class="m-archive-more"
                        :class="{ show: hasNextPage }"
                        type="primary"
                        icon="el-icon-arrow-down"
                        @click="appendPage"
                        >加载更多</el-button
                    >
                    <!-- 分页 -->
                    <el-pagination
                        class="m-archive-pages"
                        background
                        layout="total, prev, pager, next,jumper"
                        :hide-on-single-page="true"
                        :page-size="per"
                        :total="total"
                        :current-page.sync="page"
                        @current-change="changePage"
                    ></el-pagination>
                </template>

                <div class="m-database-tip" v-show="isBlank">❤ 请输入搜索条件查询</div>
            </div>
            <pvp-martial v-show="activeName === 'special'" :subtype="subtype" @selectSkill="selectSkill"></pvp-martial>
        </div>

        <!-- 已选技能 -->
        <el-divider>已选技能</el-divider>
        <div class="m-selected-skills">
            <ul class="m-skills-list">
                <li v-for="(skill, index) in selected" :key="index" class="m-skill">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img class="u-skill-icon" :src="iconURL(skill.IconID)" :alt="skill.IconID" />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                    <div class="u-mask" @click="removeSelected(index)">
                        <i class="el-icon-delete"></i>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 插入按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">
                {{ buttonTXT }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getSkill } from "@/service/node";
import pvp_martialVue from "./pvp_martial.vue";
export default {
    name: "skillDialog",
    components: {
        "pvp-martial": pvp_martialVue,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        subtype: {
            type: String,
            default: "通用",
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            client: location.href.includes("origin") ? "origin" : "std",
            skill: [],
            done: false,
            per: 10,
            page: 1,
            total: 1,
            pages: 1,
            query: "",

            activeName: "special",
            selected: [],
        };
    },
    computed: {
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        multipage: function () {
            return this.done && this.pages > 1;
        },
        isBlank: function () {
            return !this.query && !this.skill["length"];
        },
        buttonTXT: function () {
            return "确 定";
        },
    },
    methods: {
        getData(page = 1, append = false) {
            if (!this.query) return;

            this.loading = true;
            this.per = 10;
            this.done = false;
            let query = this.query;
            let params = {
                strict: ~~this.strict,
                per: this.per,
                page: page,
                client: this.client,
            };

            getSkill(query, params)
                .then((data) => {
                    if (!append) this.skill = [];
                    const list = this.transformData(data.list || []);
                    this.pages = data.pages;
                    this.total = data.total;
                    this.skill = this.skill.concat(list);
                })
                .finally(() => {
                    this.done = true;
                    this.loading = false;
                });
        },
        selectSkill: function (o) {
            this.selected.push(o);
        },
        removeSelected: function (index) {
            this.selected.splice(index, 1);
        },
        submit() {
            this.$emit("submit", this.selected);
            this.close();
            this.selected = [];
        },
        close() {
            this.$emit("update:modelValue", false);
        },
        iconURL: function (id) {
            return iconLink(id, this.client);
        },
        filterRaw: function (str) {
            return str && str.replace(/\\n/g, "\n");
        },
        search: function () {
            this.page = 1;
            this.getData();
        },
        appendPage: function () {
            this.getData(++this.page, true);
        },
        changePage: function (i) {
            this.getData(i);
        },
        transformData: function (data) {
            data.forEach((item) => {
                item.isSelected = false;
            });
            return data;
        },
    },
};
</script>

<style lang="less">
.m-skill-dialog {
    .m-skill-tabs {
        .el-tabs__item {
            background-color: #fafbfc;
            border-bottom: 1px solid #e4e7ed !important;
            &.is-active {
                border-bottom: none !important;
                background-color: #fff;
                font-weight: bold;
            }
        }
    }
    .m-database-search {
        position: sticky;
        z-index: 100;
        top: 0;
        // padding: 10px 20px 10px 20px;
        background-color: #fff;
        .pr;

        .u-client {
            // .pa;.lt(20px,10px);
            margin-right: 15px;
        }
        .u-input {
            flex: 1;
        }
        display: flex;
    }

    .m-database-tip {
        .x;
        // .fz(12px);
        color: #aaa;
        margin: 80px auto;
        // font-weight:300;
        letter-spacing: 1px;
    }

    // 加载更多
    .m-archive-more {
        .none;
        margin: 0 20px 10px 20px;
        box-sizing: border-box;
        width: calc(100% - 40px);
    }
    .m-archive-more.show {
        .db;
    }

    // 分页
    .m-archive-pages {
        overflow-x: auto;
        margin: 0 20px;
        .x;
    }

    .m-resource-count {
        .mt(0);
        .mb(10px);

        .lh(28px);

        .pr;
    }

    .m-resource-list {
        .mt(10px);
        padding: 0;
        margin: 0;
        .scrollbar();

        .u-item {
            .db;
            border: 2px solid @border-hr;
            background: #fafbfc;
            margin-bottom: 10px;
            padding: 10px 10px 10px 70px;
            min-height: 60px;
            .r(6px);
            &:hover {
                background-color: #e7f9ff;
            }
            &.on {
                border-color: #34d058;
                background-color: #fff;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
                // &:hover{
                //     border:1px dashed #ddd;
                //     background-color:#eee;
                // }
            }
            .pr;
            .pointer;
        }
        .u-link {
            .db;
            color: @color;
        }
        .u-pic {
            .db;
            .pa;
            .lt(10px);
            .size(48px);
            .r(6px);
            box-shadow: 0 0 1px inset rgba(0, 0, 0, 0.2);
        }
        .u-id {
            .fz(10px);
            color: #555;
            .pa;
            .rt(10px);
            .x(right);
        }
        .u-detach {
            .mt(4px);
            .db;
        }
        .u-primary {
            .pr;
        }
        .u-raw {
            .pa;
            .rb(0);
        }
        .u-name {
            .fz(14px, 2);
            .bold;
            .db;
            em {
                .fz(12px);
                color: #999;
                font-weight: normal;
                font-style: normal;
            }
        }
        .u-content {
            .fz(13px, 1.8);
            .mb(5px);
            .db;

            .u-map,
            .u-life {
                .mr(20px);
            }
        }
        .u-remark {
            .fz(12px, 1.8);
            color: #aaa;
            .db;

            em {
                background-color: #eee;
                padding: 0 5px;
                margin: 0 3px;
                .r(3px);
            }
        }
        .u-desc {
            .fz(12px, 1.8);
            .db;
            white-space: pre-wrap;
            margin: 4px 0;

            em {
                background-color: #f3f3f3;
                padding: 2px 5px;
                margin-right: 5px;
                color: #999;
                .r(3px);
                .fz(12px);
                font-style: normal;
            }

            sub {
                font-size: 100%;
                .ps;
            }
        }
        .u-props {
            .mt(10px);
            border-top: 1px dashed #ddd;
            padding: 10px 0;
            .clearfix;
            .u-desc {
                .w(50%);
                .fl;
            }
            .none;
            &.on {
                .db;
            }
        }
    }
    .m-select-content {
        height: calc(100% - 200px);
        overflow: auto;
    }
    // 已选数据
    .m-selected-skills {
        height: 70px;
        border: 1px solid #ddd;
        padding: 10px;
        .scrollbar();
        overflow-y: auto;
        .m-skills-list {
            list-style: none;
            padding: 0;
            margin: 0;
            .flex;
            flex-wrap: wrap;
        }
        .m-skill {
            position: relative;
            display: flex;
            justify-content: center;
            .pr;

            .u-skill-icon {
                .size(48px, 48px);
            }

            .u-name {
                display: block;
                font-size: 12px;
                text-align: center;
                overflow: hidden;
                white-space: nowrap;
                width: 48px;
            }

            .u-mask {
                .pa;
                .lt(0);
                .size(48px, 48px);
                background-color: rgba(0, 0, 0, 0.5);
                .r(6px);
                .none;
                .pointer;
            }

            &:hover {
                .u-mask {
                    .flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    i:hover {
                        color: @pink;
                    }
                }
            }
        }

        .u-skill {
            .flex;
            flex-direction: column;
            margin-right: 10px;
        }
    }
}
.c-large-dialog .el-dialog {
    .w(60%);
    height: 70%;
    .el-dialog__body {
        height: calc(100% - 54px - 70px);
        overflow-y: auto;
        box-sizing: border-box;
        padding: 10px 20px 30px 20px;
        // padding: 0;
        .scrollbar();
    }
}
@media screen and (max-width: @notebook) {
    .c-large-dialog .el-dialog {
        .w(90%);
    }
}
@media screen and (max-width: @ipad-y) {
    .c-large-dialog .el-dialog {
        margin: 0 !important;
        .size(100%);
        max-height: none;
        .h(100%);
    }
}
</style>
