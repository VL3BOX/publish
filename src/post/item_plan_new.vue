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
				<el-input v-model="title" placeholder="请输入物品清单的标题" maxlength="20" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="可见性">
				<el-radio v-model="open" :label="1">公开</el-radio>
				<el-radio v-model="open" :label="0">私有</el-radio>
			</el-form-item>
			<!-- 清单描述 -->
			<el-form-item label="描述">
				<el-input type="textarea" :rows="3" v-model="description" placeholder="简单说明一下你的物品清单" :maxlength="2000" show-word-limit></el-input>
			</el-form-item>
			<!-- 清单类型 -->
			<el-form-item label="类型">
				<el-radio-group v-model="type" size="medium" @change="resetPages">
					<el-radio-button label="1">道具清单</el-radio-button>
					<el-radio-button label="2">装备清单</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<!-- 制作清单 -->
			<el-form-item label="清单">
				<div class="m-plan-list">
					<!-- 搜索物品 -->
					<div class="u-list-search">
						<el-input class="u-title" placeholder="请输入物品名称（可适配中括号）" prefix-icon="el-icon-search" v-model.lazy.trim="keyword"></el-input>
						<draggable
							v-model="searchList"
							draggable=".u-selected"
							:move="moveHandle"
							:group="{
								name: 'draggable-item',
								pull: 'clone',
								put: false,
							}"
						>
							<div class="u-selected" v-for="(item, index) in searchList" :key="index">
								<span class="u-name" :class="`quality-${item.Quality}`">
									<img class="u-icon" :src="iconLink(item.IconID)"/>
									<span>{{ item.Name }}</span>
								</span>
								<span class="u-value">ID: {{ item.id }}</span>
							</div>
						</draggable>
						<el-pagination small class="m-archive-pages" background layout="prev, pager, next, jumper" :hide-on-single-page="true" :page-size="per" :total="total" :current-page.sync="page" size="mini"></el-pagination>
					</div>
					<!-- 物品子清单 -->
					<el-row v-if="type == '1'" class="u-list-box" :gutter="20">
						<el-col :span="6">
							<el-button class="u-list u-list-btn" icon="el-icon-plus" @click="addRelation">新增清单</el-button>
						</el-col>
						<el-col v-for="(relation, index) in relationList" :key="index" :span="6">
							<div class="u-list">
								<i class="u-list-close el-icon-circle-close" @click="relationList.splice(index, 1)"></i>
								<el-input class="u-title" type="text" placeholder="子清单标题（选填）" v-model="relation.title" maxlength="20" show-word-limit></el-input>
								<draggable class="u-item-drag" :list="relation.list" group="draggable-item" ghost-class="ghost">
									<template v-if="relation.list && relation.list.length">
										<div v-for="(item, key) in relation.list" :key="key" class="u-selected u-selected-item">
											<span class="u-name" :class="`quality-${item.Quality}`">
												<img class="u-icon" :src="iconLink(item.IconID)"/>
												<span> {{ item.Name }}</span>
											</span>
											<el-input-number class="u-input" v-model.number="item.count" @change="handleChange" :min="1" label="数字" size="mini"></el-input-number>
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
										<div v-for="(item, key) in eq.list" :key="key" class="u-selected u-selected-item">
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
import draggable from "vuedraggable";
import { searchItems, searchItemsID } from "../service/item";
import { getPlanByID, postMyPlans, addMyPlans } from "../service/item_plan";
import {iconLink} from '@jx3box/jx3box-common/js/utils';
const default_plan = {
	title : '',
}
export default {
	name: "plan",
	components: {
		draggable,
		"publish-header": header,
	},
	data: function () {
		return {
			
			// 清单
			data : Object.assign({},default_plan),

			id: this.plan_id || "",
			title: "",
			open: 1,
			type: "1",
			description: "",

			
			relationList: [],
			equipList: [
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
			],

			// 缓存区
			cache_items : [],
			cache_equips : [],

			// 物品
			loading: false,
			keyword: "",
			per: 15,
			page: 1,
			total: 1,
			searchList: [],
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
				is_equip: this.type == 2 ? 1 : 0,
				fields: ["id", "UiID", "Name", "IconID", "Quality", "AucGenre", "AucSubType"],
				apply: 1,
			};
			if (this.keyword) params.keyword = this.keyword;
			return params;
		},


		params() {
			return {
				id: this.id,
				title: this.title,
				public: this.open,
				type: this.type,
				description: this.description,
			};
		},
	},
	watch: {
		// 搜索物品重置
		keyword() {
			this.resetPages()
		},
		// 重新搜索
		search_params: {
			immediate: true,
			deep : true,
			handler: function () {
				this.loadItems();
			},
		},
		// 修改清单数据
		cache_items : {
			deep : true,
			handler : function (arr){
				this.data.relation = arr.map((item,i) => {
					return {id : item.id , count : item.count}
				})
			}
		},
		cache_equips : {
			deep : true,
			handler : function (){
				
			}
		}
	},

	methods: {

		// 物品
		// ===================================
		// 物品搜索
		loadItems() {
			searchItems(this.search_params).then((res) => {
				this.searchList = res.data;
				this.total = res.total;
			});
		},
		// 重置分页
		resetPages() {
			this.page = 1;
		},


		// 清单
		// ===================================

		// 获取plan_id的数据
		getPlanData() {
			getPlanByID(this.plan_id).then((res) => {
				this.id = res.id;
				this.title = res.title;
				this.type = res.type;
				this.open = res.public;
				this.description = res.description;
				this.forItemList(res.relation);
			});
		},

		// 按plan_id的获取数据数组
		forItemList(list) {
			if (typeof list == "string") list = JSON.parse(list);
			let _arr = [];
			if (this.type == "item") {
				list.forEach((el) => {
					let a = el.data.map((a) => {
						return (a = a.id);
					});
					_arr.push(...a);
				});
				_arr = [...new Set(_arr)];

				searchItemsID({ ids: _arr }).then((res) => {
					this.forRelationList(list, res.data);
				});
			} else {
				for (const key in list) {
					if (list[key].length) {
						_arr.push(...list[key]);
					}
				}
				_arr = [...new Set(_arr)];
				searchItemsID({ ids: _arr, limit: _arr.length }).then((res) => {
					this.forEquipList(list, res.data);
				});
			}
		},
		// 获取的物品数据转换
		forRelationList(lists, data) {
			lists.map((list) => {
				let _list = [];
				list.data.forEach((el) => {
					let item = data.filter((l) => el.id == l.id);
					let { id, UiID, Name, IconID, Quality, AucGenre, AucSubType } = item[0];
					let _el = { id, UiID, Name, IconID, Quality, AucGenre, AucSubType, count: el.count };
					_list.push(_el);
				});
				list.list = _list;
			});
			this.relationList = lists;
		},
		// 获取的装备数据转换
		forEquipList(lists, data) {
			for (const key in lists) {
				let _lists = [];
				lists[key]?.forEach((list) => {
					let _list = [];
					data.forEach((el) => {
						if (list == el.id) {
							let { id, UiID, Name, IconID, Quality, AucGenre, AucSubType } = el;
							let _el = { id, UiID, Name, IconID, Quality, AucGenre, AucSubType };
							_list.push(_el);
						}
					});
					_lists.push(..._list);
				});
				lists[key] = [..._lists];
			}
			this.equipList.map((equips) => {
				equips.map((eq) => {
					for (const key in lists) {
						if (key == eq.title) {
							eq.list = lists[key];
						}
					}
				});
			});
		},
		
		// 新增清单
		addRelation() {
			this.relationList.unshift({
				title: "",
				list: [],
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
		// 提交物品的转换数据
		toRelationList(obj) {
			let list = [];
			for (const i in obj) {
				let data = [];
				obj[i].list?.forEach((k) => {
					data.push({ id: k.id, count: k.count || 1 });
				});
				list.push({ title: obj[i].title || "", data });
			}
			return list;
		},
		// 提交装备的转换数据
		toEquipList(lists) {
			let obj = {};
			lists.forEach((list) => {
				list.forEach((el) => {
					let _arr = [];
					el.list.forEach((arr) => {
						_arr.push(arr.id);
					});
					obj[el.title] = _arr;
				});
			});
			return obj;
		},
		// 提交表单
		submit() {
			let params = this.type == "item" ? this.toRelationList(this.relationList) : this.toEquipList(this.equipList);
			this.params.relation = JSON.stringify(params);

			this.loading = true;
			this.id
				? postMyPlans(this.id, this.params)
						.then((res) => {
							console.log(res, "postMyPlans");
							this.$message({ message: "物品清单修改成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						})
				: addMyPlans(this.params)
						.then(() => {
							this.$message({ message: "物品清单提交成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						});
		},

		iconLink,
	},
	created: function () {
		if (this.plan_id) this.getPlanData();
	},
};
</script>
<style scoped lang="less">
@import "../assets/css/item_plan_new.less";
</style>
