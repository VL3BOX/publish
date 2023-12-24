import { $helper } from "@jx3box/jx3box-common/js/https.js";

function get_comments(params) {
    return $helper()({
        method: "GET",
        url: `/api/my/wiki/comments`,
        params: params,
    });
}

function remove_comment(source_type, comment_id) {
    if (!source_type || !comment_id) return null;
    return $helper()({
        method: "PUT",
        url: `/api/my/wiki/comment/${source_type}/${comment_id}/remove`,
    });
}

export { get_comments, remove_comment };
