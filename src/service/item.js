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

export { search_items };
