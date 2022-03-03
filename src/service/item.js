import { $helper } from "@jx3box/jx3box-common/js/https.js";

// 物品搜索
function search_items(keyword, length, fields, is_equip = null) {
	let params = { keyword: keyword, limit: length, fields: fields };
	if (is_equip !== null) params.is_equip = is_equip ? 1 : 0;

	return $helper()({
		method: "GET",
		url: `/api/item/search`,
		params: params,
	});
}

// 物品搜索
function searchItems(params) { 
	return $helper()
		.get(`/api/item/search`, { params })
		.then((res) => {
			return res.data.data;
		});
}

export { search_items, searchItems };
