import { $cms, $next } from "@jx3box/jx3box-common/js/https";

// 表情栏目接口
function postEmotions(data) {
    return $cms().post("/api/cms/post/emotion", data);
}

function updateEmotion(id, data) {
    return $cms().put(`/api/cms/post/emotion/${id}`, data);
}

function getEmotion(id) {
    return $cms().get(`/api/cms/post/emotion/${id}`);
}
function getMyEmotions(params) {
    return $cms().get(`/api/cms/post/emotions/my`, {
        params,
    });
}
function deleteEmotion(id) {
    return $cms().delete(`/api/cms/post/emotion/${id}`);
}

// 骚话栏目接口
function postJoke(data) {}
function updateJoke(id, data) {}
function getJoke(id) {
    return $cms().get(`/api/cms/post/joke/${id}`);
}
function getMyJokes(params) {
    return $cms().get(`/api/cms/post/jokes/my`, {
        params,
    });
}
function deleteJoke(id) {
    return $cms().delete(`/api/cms/post/joke/${id}`);
}

export { postEmotions, getEmotion, updateEmotion, getMyEmotions, deleteEmotion, postJoke, updateJoke, getJoke, getMyJokes, deleteJoke };
