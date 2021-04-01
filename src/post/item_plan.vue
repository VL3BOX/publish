<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="物品清单" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <!-- <h1 class="m-publish-item-header">物品清单</h1> -->

        <el-form
            label-position="left"
            label-width="80px"
            class="m-publish-item-plan"
        >
            <!-- 清单名称 -->
            <el-form-item label="标题">
                <el-input
                    v-model="plan.title"
                    placeholder="请输入物品清单的标题"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="可见性">
                <el-radio v-model="plan.public" :label="1">公开</el-radio>
                <el-radio v-model="plan.public" :label="0">私有</el-radio>
            </el-form-item>
            <!-- 清单描述 -->
            <el-form-item label="描述">
                <el-input
                    type="textarea"
                    :rows="3"
                    v-model="plan.description"
                    placeholder="简单说明一下你的物品清单"
                    maxlength="2000"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <!-- 清单类型 -->
            <el-form-item label="类型">
                <el-radio-group v-model="plan.type" size="medium">
                    <el-radio-button label="1">道具清单</el-radio-button>
                    <el-radio-button label="2">装备清单</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!-- 清单关系 -->
            <el-form-item label="清单">
                <el-row style="line-height:initial;">
                    <el-col :xs="24" :sm="5" class="c-item-search">
                        <el-input
                            placeholder="请输入物品名称（可适配中括号形式）"
                            prefix-icon="el-icon-search"
                            v-model="keyword"
                        ></el-input>
                        <draggable
                            class="m-search-items"
                            tag="ul"
                            v-if="items && items.length"
                            :list="items"
                            :sort="false"
                            :group="{
                                name: 'draggable-item',
                                pull: 'clone',
                                put: false,
                            }"
                            :move="move_handle"
                            ghost-class="ghost"
                        >
                            <li
                                v-for="(item, key) in items"
                                :key="key"
                                class="m-search-item"
                            >
                                <jx3-item-simple :item="item" />
                            </li>
                        </draggable>
                        <div v-if="items && !items.length" class="m-no-item">
                            <i class="el-icon-chat-line-round"></i>
                            <span>&nbsp;查找不到相关记录</span>
                        </div>
                    </el-col>

                    <el-col
                        :xs="24"
                        :sm="19"
                        class="c-plan-relation c-normal-relation"
                        v-if="plan.type == 1"
                    >
                        <el-row :gutter="15" class="m-positions">
                            <el-col
                                :xs="24"
                                :sm="6"
                                v-for="(position, key) in normal_relation"
                                :key="key"
                            >
                                <div class="m-position">
                                    <el-input
                                        class="u-title"
                                        v-model="position.title"
                                        placeholder="子清单标题（选填）"
                                        maxlength="20"
                                        show-word-limit
                                    ></el-input>
                                    <div class="c-selected-items">
                                        <draggable
                                            class="m-selected-items"
                                            tag="ul"
                                            :list="position.data"
                                            group="draggable-item"
                                            :class="{
                                                empty:
                                                    !position.data ||
                                                    (position.data &&
                                                        !position.data.length),
                                            }"
                                            ghost-class="ghost"
                                        >
                                            <li
                                                v-for="(item,
                                                k) in position.data"
                                                :key="k"
                                                class="m-selected-item"
                                            >
                                                <jx3-item-simple :item="item" />
                                                <i
                                                    class="u-el-icon el-icon-close"
                                                    @click="
                                                        position.data.splice(
                                                            k,
                                                            1
                                                        )
                                                    "
                                                ></i>
                                            </li>
                                        </draggable>
                                        <span
                                            v-if="
                                                !position.data ||
                                                    (position.data &&
                                                        !position.data.length)
                                            "
                                            class="u-tip"
                                            >拖拽所需道具到此处</span
                                        >
                                    </div>
                                    <i
                                        class="u-el-icon el-icon-close"
                                        @click="normal_relation.splice(key, 1)"
                                    ></i>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="15">
                            <el-col :xs="24" :sm="6">
                                <div
                                    class="m-position-add"
                                    @click="add_normal_relation"
                                >
                                    +
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col
                        :xs="24"
                        :sm="19"
                        class="c-plan-relation"
                        v-if="plan.type == 2"
                    >
                        <el-row :gutter="15" class="m-positions">
                            <el-col
                                :xs="24"
                                :sm="6"
                                v-for="(_positions, index) in positions"
                                :key="index"
                            >
                                <div
                                    class="m-position"
                                    v-for="(position, key) in _positions"
                                    :key="key"
                                >
                                    <h3
                                        class="u-title"
                                        v-text="position.label"
                                    ></h3>
                                    <div class="c-selected-items">
                                        <draggable
                                            class="m-selected-items m-selected-equips"
                                            tag="ul"
                                            :list="equip_relation[key]"
                                            group="draggable-item"
                                            :move="move_handle"
                                            :data-AucGenre="position.AucGenre"
                                            :data-AucSubType="
                                                position.AucSubType
                                            "
                                            :class="{
                                                empty:
                                                    !equip_relation[key] ||
                                                    (equip_relation[key] &&
                                                        !equip_relation[key]
                                                            .length),
                                            }"
                                            ghost-class="ghost"
                                        >
                                            <li
                                                v-for="(item,
                                                k) in equip_relation[key]"
                                                :key="k"
                                                class="m-selected-item"
                                            >
                                                <jx3-item-simple :item="item" />
                                                <i
                                                    class="u-el-icon el-icon-close"
                                                    @click="
                                                        equip_relation[
                                                            key
                                                        ].splice(k, 1)
                                                    "
                                                ></i>
                                                <span
                                                    v-if="k == 0"
                                                    class="u-main"
                                                    >主</span
                                                >
                                            </li>
                                        </draggable>
                                        <span
                                            v-if="
                                                !equip_relation[key] ||
                                                    (equip_relation[key] &&
                                                        !equip_relation[key]
                                                            .length)
                                            "
                                            class="u-tip"
                                            >拖拽所需装备到此处</span
                                        >
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="submit"
                    :loading="processing"
                    >提交物品清单
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish_header.vue";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple";
import draggable from "vuedraggable";

// 本地依赖
import { search_items } from "../service/item";
import { get_item_plan, save_item_plan } from "../service/item_plan";

const qs = require("qs");
const $_ = require("lodash");
const { __Root } = require("@jx3box/jx3box-common/data/jx3box.json");
import EquipPosition from "@jx3box/jx3box-editor/service/enum/EquipPosition";

export default {
    name: "item",
    props: [],
    data: function() {
        let positions = [
            [EquipPosition.MELEE_WEAPON, EquipPosition.RANGE_WEAPON],
            [EquipPosition.HELM, EquipPosition.CHEST, EquipPosition.WAIST],
            [EquipPosition.BANGLE, EquipPosition.PANTS, EquipPosition.BOOTS],
            [
                EquipPosition.AMULET,
                EquipPosition.PENDANT,
                EquipPosition.RING_1,
                EquipPosition.RING_2,
            ],
        ];
        // 重置键名
        let all_positions = EquipPosition.all();
        for (let i in positions) {
            let _output = {};
            for (let key in positions[i]) {
                let type = $_.get(positions, `${i}.${key}`);
                _output[type] = all_positions[type];
            }
            $_.set(positions, i, _output);
        }

        // 构建装备清单结构
        let equip_relation = {};
        for (let i in all_positions) {
            let position = all_positions[i];
            equip_relation[position.type] = [];
        }

        return {
            keyword: "",
            items: null,
            normal_relation: [{ title: "", data: [] }],
            equip_relation: equip_relation,
            plan: {
                id: "",
                title: "",
                public: 1,
                type: 1,
                relation: null,
                description: "",
            },
            positions: positions,
            processing : false
        };
    },
    mounted() {
        if (this.$route.params.plan_id) {
            get_item_plan(this.$route.params.plan_id).then((data) => {
                data = data.data;
                if (data.code === 200) {
                    this.plan = data.data.plan;
                    if (this.plan) {
                        if (this.plan.type == 1) {
                            this.normal_relation = this.plan.relation_items;
                        } else if (this.plan.type == 2) {
                            this.equip_relation = this.plan.relation_items;
                        } else {
                            this.$message.error(
                                "物品清单类型异常，请联系管理员"
                            );
                        }
                    } else {
                        this.$message.error(data.message);
                        this.$router.push({ name: "item_plan" });
                    }
                } else {
                    this.$message.error("获取物品清单异常，请联系管理员");
                }
            });
        }
    },
    methods: {
        add_normal_relation() {
            this.normal_relation.push({ title: "", data: [] });
        },
        move_handle(e) {
            if (!e.to.classList.contains("m-selected-items")) return false;
            if (!e.to.classList.contains("m-selected-equips")) return true;
            let AucGenre = e.to.getAttribute("data-AucGenre");
            let AucSubType = e.to.getAttribute("data-AucSubType");
            let result = e.draggedContext.element.AucGenre == AucGenre;
            if (AucSubType !== null)
                result =
                    result && e.draggedContext.element.AucSubType == AucSubType;
            return result;
        },
        search() {
            search_items(
                this.keyword,
                15,
                [
                    "id",
                    "UiID",
                    "Name",
                    "IconID",
                    "Quality",
                    "AucGenre",
                    "AucSubType",
                ],
                this.plan.type == 2
            ).then(
                (data) => {
                    data = data.data;
                    this.items = data.code === 200 ? data.data.data : [];
                },
                () => {
                    this.options.items = false;
                }
            );
        },
        submit() {
            if (this.plan.type == 1) {
                // 将Plan对象数组转为Plan ID数组
                let relation = JSON.parse(JSON.stringify(this.normal_relation));
                for (let key in relation) {
                    for (let k in relation[key].data) {
                        relation[key].data[k] = relation[key].data[k].id;
                    }
                }
                this.plan.relation = JSON.stringify(relation);
            } else if (this.plan.type == 2) {
                // 将Plan对象数组转为Plan ID数组
                let relation = JSON.parse(JSON.stringify(this.equip_relation));
                for (let key in relation) {
                    for (let k in relation[key]) {
                        relation[key][k] = relation[key][k].id;
                    }
                }
                this.plan.relation = JSON.stringify(relation);
            } else {
                this.$message.error("物品清单类型异常，请联系管理员");
                return;
            }

            this.processing = true
            save_item_plan(this.plan).then((data) => {
                data = data.data;
                if (data.code === 200) {
                    this.$message({
                        message: "物品清单提交成功",
                        type: "success",
                    });
                    location.href = `${__Root}item/#/plan_view/${data.data.id}`;
                } else {
                    this.$message({
                        message: `${data.message}`,
                        type: "warning",
                    });
                }
            }).finally(() => {
                this.processing = false
            })
        },
    },
    watch: {
        keyword: {
            immediate: true,
            handler() {
                this.search();
            },
        },
        "plan.type": function() {
            this.search();
        },
    },
    components: {
        draggable,
        'publish-header':header,
        "jx3-item-simple": ItemSimple,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/item_plan.less";
</style>
