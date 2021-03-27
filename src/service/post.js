import { $http } from "./axios";

/**
 * 根据文章类型获取文章列表
 * @param type
 * @param params
 * @returns {AxiosPromise}
 */
function get_posts_by_type(type, params) {
    return $http({
        method: "GET",
        url: `/api/posts/type/${type}`,
        params: params,
    });
}

export { get_posts_by_type };
