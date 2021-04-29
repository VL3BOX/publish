import { $next, $cms } from "@jx3box/jx3box-common/js/https";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";

// 上传
function uploadData(formdata) {
    return $cms().post("/api/cms/upload/jx3dat", formdata);
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

        let version = item._version || Date.now()
        if(item.pop){
            version = Date.now()    //如果提醒，直接使用新版本号
        }else{
            version = ~~version + 0.1   //如果不提醒，对旧版本+补丁
        }

        _.data[item.name] = {
            author: author,
            key: item.name,
            data_url: item.file,
            about: __Root + "jx3dat/" + pid,
            name: item.desc,
            version: version + '',
            status: !!item.status,
        };
    });

    return _;
}

export { uploadHub, uploadData, syncRedis };
