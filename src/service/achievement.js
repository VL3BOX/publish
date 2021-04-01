import { $helper } from "@jx3box/jx3box-common/js/https.js";

// 成就搜索
function search_achievements(params) {
    return $helper()({
        method: "GET",
        url: `/api/achievement/search`,
        params: params,
    });
}

export { search_achievements };
