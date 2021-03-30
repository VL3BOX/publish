import { $cms } from "@jx3box/jx3box-common/js/https";

// 加载
function pull(id) {
    return $cms({ proxy: true }).get(`/api/cms/post/${id}/query`);
}

// 发布
function push(kw1, kw2) {
    if (arguments.length > 1) {
        return $cms({ proxy: true }).put(`/api/cms/post/${kw1}`, kw2);
    } else {
        return $cms({ proxy: true }).post(`/api/cms/post`, kw1);
    }
}

export { pull, push };
