import { axios } from "./axios";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";

// 副本列表数据
function getFbMap() {
    return axios.get(__dataPath + "data/fb/fb_map.json");
}

export { getFbMap };
