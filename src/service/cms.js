import { $cms } from "@jx3box/jx3box-common/js/https";

// 加载
function pull(id) {
    return $cms().get(`/api/cms/post/${id}/query`);
}

// 发布
function push(kw1, kw2) {
    if (arguments.length > 1) {
        return $cms().put(`/api/cms/post/${kw1}`, kw2);
    } else {
        return $cms().post(`/api/cms/post`, kw1);
    }
}

// 删除
function del(id) {
    return $cms().delete(`/api/cms/post/${id}`);
}

// 统计
function getMyPostsCount() {
    return $cms().get(`/api/cms/posts/user/my/count`);
}

// 列表
function getMyPosts(params) {
    return $cms().get(`/api/cms/posts/my`, {
        params,
    });
}

// 获取全部列表
function getAllPosts(params){
    return $cms().get(`/api/cms/posts`, {
        params
    });
}

// 通用上传
function upload(formData) {
    return $cms().post(`/api/cms/upload`, formData);
}

export { pull, push, del, getMyPostsCount, getMyPosts, getAllPosts, upload };
