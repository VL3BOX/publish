import { $cms } from "@jx3box/jx3box-common/js/https";

function postEmotions(data) {
    return $cms().post("/api/cms/post/emotion", data);
}

function getEmotion(id) {
    return $cms().get(`/api/cms/post/emotion/${id}`);
}

function updateEmotion(id,data){
    return $cms().put(`/api/cms/post/emotion/${id}`,data)
}

export { postEmotions, getEmotion ,updateEmotion};
