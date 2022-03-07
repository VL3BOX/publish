<template>
	<div class="m-publish-box">
		<!-- 返回 -->
		<publish-header name="物品清单" :localDraft="false">
			<slot name="header"></slot>
		</publish-header>
		<!-- 表单 -->
		<el-form class="u-form" label-position="left" label-width="80px">
			<!-- 清单名称 -->
			<el-form-item label="标题">
				<el-input v-model="data.title" placeholder="请输入物品清单的标题" maxlength="20" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="可见性">
				<el-radio v-model="data.public" :label="1">公开</el-radio>
				<el-radio v-model="data.public" :label="0">私有</el-radio>
			</el-form-item>
			<!-- 清单描述 -->
			<el-form-item label="描述">
				<el-input type="textarea" :rows="3" v-model="data.description" placeholder="简单说明一下你的物品清单" :maxlength="2000" show-word-limit></el-input>
			</el-form-item>
			<!-- 清单类型 -->
			<el-form-item label="类型">
				<el-radio-group v-model="data.type" size="medium" @change="resetPages">
					<el-radio-button label="1">道具清单</el-radio-button>
					<el-radio-button label="2">装备清单</el-radio-button>
				</el-radio-group>
				<el-button class="u-add-plan" size="medium" icon="el-icon-plus" @click="addRelation">新增清单</el-button>
			</el-form-item>
			<!-- 制作清单 -->
			<el-form-item label="清单">
				<div class="m-plan-list">
					<!-- 搜索物品 -->
					<div class="u-list-search" v-if="searchList.length">
						<el-input class="u-title" placeholder="请输入物品名称（可适配中括号）" prefix-icon="el-icon-search" v-model.lazy.trim="keyword"></el-input>
						<draggable v-model="searchList" draggable=".u-selected" :move="moveHandle" :group="{ name: 'draggable-item', pull: 'clone', put: false }">
							<div class="u-selected" v-for="(item, index) in searchList" :key="index" @mouseenter="showPop(item.id)" @mousedown="hidePop" @mouseleave="hidePop">
								<span class="u-name" :class="`quality-${item.Quality}`">
									<img class="u-icon" :src="iconLink(item.IconID)" />
									<span>{{ item.Name }}</span>
								</span>
								<span class="u-value">ID: {{ item.id }}</span>
							</div>
						</draggable>
						<jx3-item class="u-item" v-if="item_id" :item_id="item_id"></jx3-item>
						<el-pagination small class="m-archive-pages" background layout="prev, pager, next, jumper" :hide-on-single-page="true" :page-size="per" :total="total" :current-page.sync="page" size="mini"></el-pagination>
					</div>
					<!-- 物品子清单 -->
					<el-row v-if="data.type == '1'" class="u-list-box" :gutter="20">
						<el-col v-for="(relation, index) in relationList" :key="index" :span="6">
							<div class="u-list">
								<i class="u-list-close el-icon-circle-close" @click="relationList.splice(index, 1)"></i>
								<el-input class="u-title" type="text" placeholder="子清单标题（选填）" v-model="relation.title" maxlength="20" show-word-limit></el-input>
								<draggable class="u-item-drag" :list="relation.data" group="draggable-item" ghost-class="ghost">
									<template v-if="relation.data && relation.data.length">
										<div v-for="(item, key) in relation.data" :key="key" class="u-selected u-selected-item u-selected-count">
											<span class="u-name" :class="`quality-${item.Quality}`">
												<img class="u-icon" :src="iconLink(item.IconID)" />
												<span> {{ item.Name }}</span>
											</span>
											<div class="u-count">
												<span>数量：</span>
												<el-input-number size="mini" v-model.number="item.count" :min="1" label="数字"></el-input-number>
											</div>

											<i class="u-close el-icon-circle-close" @click="relation.list.splice(key, 1)"></i>
										</div>
									</template>
									<div class="u-normal" v-else>拖拽所需道具到此处</div>
								</draggable>
							</div>
						</el-col>
					</el-row>
					<!-- 装备子清单 -->
					<el-row v-else class="u-list-box u-list-equip" :gutter="20">
						<el-col v-for="(equip, index) in equipList" :key="index" :span="6">
							<div v-for="(eq, key) in equip" :key="key" class="u-list">
								<div class="u-title">{{ eq.label }}</div>
								<draggable :list="eq.list" :move="moveHandle" :data-AucGenre="eq.AucGenre" :data-AucSubType="eq.AucSubType" group="draggable-item" ghost-class="ghost">
									<template v-if="eq.list && eq.list.length">
										<div v-for="(item, key) in eq.list" :key="key" class="u-selected u-selected-item u-selected-equip">
											<span class="u-name" :class="`quality-${item.Quality}`">
												<img class="u-icon" :src="iconLink(item.IconID)" />
												<span>{{ item.Name }}</span>
											</span>
											<span class="u-value">ID: {{ item.id }}</span>
											<i class="u-close el-icon-circle-close" @click="eq.list.splice(key, 1)"></i>
										</div>
									</template>
									<div class="u-normal" v-else>拖拽所需道具到此处</div>
								</draggable>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-form-item>
			<!-- 提交表单 -->
			<el-form-item>
				<el-button class="u-publish" icon="el-icon-s-promotion" type="primary" @click="submit" :loading="loading">提交物品清单</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import header from "@/components/publish_header.vue";
import Item from "@jx3box/jx3box-editor/src/Item";
import draggable from "vuedraggable";
import { searchItems, searchItemsID } from "../service/item";
import { getPlanByID, postMyPlans, addMyPlans } from "../service/item_plan";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
const default_plan = {
	id: "",
	title: "",
	public: "1",
	type: "1",
	description: "",
};
const default_equip = [
	[
		{ title: "melee_weapon", label: "武器", AucGenre: 1, list: [] },
		{ title: "range_weapon", label: "暗器", AucGenre: 2, list: [] },
	],
	[
		{ title: "helm", label: "帽子", AucGenre: 3, AucSubType: 2, list: [] },
		{ title: "chest", label: "上衣", AucGenre: 3, AucSubType: 1, list: [] },
		{ title: "waist", label: "腰带", AucGenre: 3, AucSubType: 3, list: [] },
	],
	[
		{ title: "bangle", label: "护腕", AucGenre: 3, AucSubType: 6, list: [] },
		{ title: "pants", label: "下装", AucGenre: 3, AucSubType: 4, list: [] },
		{ title: "boots", label: "鞋子", AucGenre: 3, AucSubType: 5, list: [] },
	],
	[
		{ title: "amulet", label: "项链", AucGenre: 4, AucSubType: 1, list: [] },
		{ title: "pendant", label: "腰坠", AucGenre: 4, AucSubType: 3, list: [] },
		{ title: "ring_1", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
		{ title: "ring_2", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
	],
];
export default {
	name: "plan",
	components: {
		draggable,
		"publish-header": header,
		"jx3-item": Item,
	},
	data: function () {
		return {
			// 清单
			data: Object.assign({}, default_plan),

			relationList: [],
			equipList: [...default_equip],

			// 缓存区
			cache_id: "",
			cache_list: "",

			// 物品
			loading: false,
			keyword: "",
			per: 15,
			page: 1,
			total: 1,
			searchList: [],

			item_id: "",
		};
	},
	computed: {
		plan_id() {
			return this.$route.params.plan_id;
		},
		// 搜索参数
		search_params() {
			let params = {
				page: this.page,
				limit: this.per,
				is_equip: this.data.type == 2 ? 1 : 0,
				fields: ["id", "UiID", "Name", "IconID", "Quality", "AucGenre", "AucSubType", "DescHtml"],
				apply: 1,
			};
			if (this.keyword) params.keyword = this.keyword;
			return params;
		},
	},
	watch: {
		// 搜索物品重置
		keyword() {
			this.resetPages();
		},
		// 重新搜索
		search_params: {
			immediate: true,
			deep: true,
			handler: function () {
				this.loadItems();
			},
		},
		// 有缓存id则获取id的全部数据至cache_list
		cache_id: {
			immediate: true,
			deep: true,
			handler: function (val) {
				if (val)
					searchItemsID({ ids: val, limit: val.length }).then((res) => {
						this.cache_list = res.data.map((item) => {
							let { id, Name, DescHtml, UiID, IconID, Quality, AucGenre, AucSubType } = item;
							return { count: item.count || 1, Name, id, DescHtml, UiID, IconID, Quality, AucGenre, AucSubType };
						});
					});
			},
		},
		cache_list: {
			immediate: true,
			deep: true,
			handler: function (val) {
				if (val) {
					this.data.type == 1 ? this.idToItem(val) : this.idToEquip(val);
				}
			},
		},
	},

	methods: {
		// 物品
		// ===================================
		// 物品搜索
		loadItems() {
			searchItems(this.search_params).then((res) => {
				res.data.map((item) => (item.count = 1));
				this.searchList = res.data;
				this.total = res.total;
			});
		},
		// 重置分页
		resetPages() {
			this.page = 1;
		},
		// 显示物品详细数据
		showPop(i) {
			this.item_id = i;
		},
		// 隐藏物品详细数据
		hidePop() {
			this.item_id = "";
		},
		// 物品id转图片链接
		iconLink,

		// 清单
		// ===================================
		// 新增清单
		addRelation() {
			this.relationList.unshift({
				title: "",
				data: [],
			});
		},
		// 装备清单的移动
		moveHandle(e) {
			if (e.to.classList.contains("u-item-drag")) return;
			let AucGenre = e.to.getAttribute("data-AucGenre");
			let AucSubType = e.to.getAttribute("data-AucSubType");
			let result = e.draggedContext.element.AucGenre == AucGenre;
			if (AucSubType !== null) result = result && e.draggedContext.element.AucSubType == AucSubType;
			return result;
		},

		// 数据处理
		// ===================================
		// 获取plan_id的数据
		getPlanData() {
			getPlanByID(this.plan_id).then((res) => { 
				this.data = res; 
				this.extractID(res);
			});
		},
		// --兼容旧数据处理------------
		// 判断旧数据,并提取至cache_id || 如果不是旧数据，则直接替换
		extractID(data) {
			let { type, relation } = data;
			let _arr = [];
			if (type == 1) {
				relation.forEach((list) => {
					list.data.forEach((el) => {
						if (typeof el == "string") _arr.push(el);
					});
				});
				_arr.length ? (this.cache_id = [...new Set(_arr)]) : this.toRelationList();
			} else {
				// 处理装备
				let _obj = Object.values(relation);
				_obj.forEach((el) => {
					el.forEach((item) => {
						if (typeof item == "string") _arr.push(item);
					});
				});
				_arr.length ? (this.cache_id = [...new Set(_arr)]) : this.toEquipList();
			}
		},

		// --有ID数据处理------------
		// 替换物品id得到的数据
		idToItem(data) {
			if (!data) return;
			let relation = this.data.relation;
			if (relation) {
				relation.map((list) => {
					list.data = list.data.map((item) => {
						item = data.filter((el) => {
							return el.id == item;
						});
						return item[0];
					});
					return list;
				});
				this.data.relation = relation;
				this.toRelationList();
			}
		},
		// 替换装备id得到的数据
		idToEquip(data) {
			if (!data) return;
			let _obj = this.data.relation;
			if (_obj) {
				for (const key in _obj) {
					_obj[key] = _obj[key].map((item) => {
						item = data.filter((el) => {
							return el.id == item;
						});
						return item[0];
					});
				}
				this.data.relation = _obj;
				this.toEquipList();
			}
		},
		// idToItem替换relationList的数据
		toRelationList() {
			this.relationList = this.data.relation;
		},
		// idToEquip替换equipList的数据
		toEquipList() {
			let _obj = this.data.relation;
			this.equipList.map((list) => {
				list.map((el) => {
					if (_obj.hasOwnProperty(el.title)) {
						el.list = _obj[el.title];
					}
				});
			});
		},

		// --无ID数据处理------------
		// 物品处理
		toItem() {
			this.data.relation = this.relationList;
		},
		// 装备处理
		toEquip() {
			let obj = {};
			this.equipList.forEach((list) => {
				list.forEach((el) => {
					obj[el.title] = el.list;
				});
			});
			this.data.relation = obj;
		},

		// --提交清单-------
		submit() {
			this.data.type == 1 ? this.toItem() : this.toEquip();

			this.loading = true; 
			this.plan_id
				? postMyPlans(this.plan_id, this.data)
						.then((res) => { 
							this.$message({ message: "物品清单修改成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						})
				: addMyPlans(this.data)
						.then(() => {
							this.$message({ message: "物品清单提交成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						});
		},
	},
	created: function () {
		if (this.plan_id) this.getPlanData();
	},
};
</script>
<style scoped lang="less">
@import "../assets/css/item_plan_new.less";
</style>
