import { $http } from "./axios";

function get_posts(keyword, page, limit) {
    let data = {};
    if (keyword) data.keyword = keyword;
    if (page) data.page = page;
    if (limit) data.limit = limit;

    return $http({
        method: "GET",
        url: `/api/my/wiki/posts`,
        params: data,
    });
}

function remove_post(post_id) {
    if (!post_id) return null;
    return $http({
        method: "PUT",
        url: `/api/my/wiki/post/${post_id}/remove`,
    });
}

function get_comments(keyword, page, limit) {
    let data = {};
    if (keyword) data.keyword = keyword;
    if (page) data.page = page;
    if (limit) data.limit = limit;

    return $http({
        method: "GET",
        url: `/api/my/wiki/comments`,
        params: data,
    });
}

function remove_comment(comment_id) {
    if (!comment_id) return null;
    return $http({
        method: "PUT",
        url: `/api/my/wiki/comment/${comment_id}/remove`,
    });
}

export { get_posts, remove_post, get_comments, remove_comment };
