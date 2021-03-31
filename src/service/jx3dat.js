import { $next, $cms } from "@jx3box/jx3box-common/js/https";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";

// 上传
function uploadData(formdata) {
    return $cms({proxy:true}).post("/api/cms/upload/jx3dat", formdata);
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
        lang: data.lang || "cn",
        original: !!data.original,
    };

    data.post_meta.data.forEach((item, i) => {
        item.name = item.name || Date.now();

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

export { uploadHub, uploadData, syncRedis };
