import { $http } from "./axios";

// 成就搜索
function search_achievements(params) {
    return $http({
        method: "GET",
        url: `/api/achievement/search`,
        params: params,
    });
}

export { search_achievements };
