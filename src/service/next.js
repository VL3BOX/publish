import { $next } from "@jx3box/jx3box-common/js/https";

function getNextStat() {
    return $next().get(`/api/my-resource/stat`);
}

function getMyComments(params) {
    return $next().get(`/api/my-comment/list/page/${params.page || 1}`, {
        params: {
            pageSize: params.per,
            key: params.search,
        },
    });
}

function deleteComment(id) {
    return $next().delete(`/api/my-comment/${id}`);
}

export { getNextStat, getMyComments, deleteComment };
