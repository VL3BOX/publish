import { $_server } from "./axios";

function getWorks(query) {
    return $_server.get("cms/my/post", {
        params: query,
    });
}

function delPost(id) {
    return $_server.delete(`/cms/my/post/${id}`);
}

function checkPost(id, status) {
    return $_server.put(`/cms/my/post/${id}/check`, {
        status,
    });
}

export { getWorks, delPost, checkPost };
