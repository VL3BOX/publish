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

// 删除
function del(id){
    return $cms({ proxy: true }).delete(`/api/cms/post/${id}`);
}

// 统计
function getMyPostsCount() {
    return $cms({ proxy: true }).get(`/api/cms/posts/user/my/count`);
}

// 列表
function getMyPosts(params){
    return $cms({ proxy: true }).get(`/api/cms/posts/my`,{
        params
    });
}

export { pull, push, del,getMyPostsCount ,getMyPosts};
