import { $_server } from "./axios";
import { $next } from "@jx3box/jx3box-common/js/https";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";

// 文章
function createPost(data) {
    return $_server.post("/server/jx3dat/", data);
}
function updatePost(id, data) {
    return $_server.put(`/server/jx3dat/${id}`, data);
}
function hasFeed() {
    return $_server.get(`/server/jx3dat/feed/has`);
}

// 上传
function uploadData(formdata, vm) {
    return $_server.post("/upload/data", formdata);
}
function uploadHub(formdata) {
    return $next().post("/api/plugins/my-team-mon/v2", formdata);
}

// 云端
function syncRedis(data) {
    let redisData = transferForRedis(data);
    console.log("正在执行redis同步作业:", redisData);
    return $next().post("/api/plugins/jx3dat/publish", redisData);
}

function transferForRedis(data) {
    let author = data.author;
    let pid = data.ID;

    let _ = {
        author: author,
        user_id: ~~data.post_author || 0,
        post_id: pid,
        post_status: data.post_status,
        data: {},
        lang: data.post_meta.lang,
        original: !!data.original,
    };

    data.post_meta.data.forEach((item, i) => {
        _.data[item.name] = {
            author: author,
            key: item.name,
            data_url: item.file,
            about: __Root + "jx3dat/" + pid,
            name: item.desc,
            version: item.version || Date.now(),
            status: !!item.status,
        };
    });

    return _;
}

export { uploadHub, uploadData, syncRedis, updatePost, createPost, hasFeed };
