import { $http } from "./axios";
import { $cms } from "@jx3box/jx3box-common/js/https";

function getNamespace() {
    return $http({
        method: "GET",
        url: `/api/my/namespaces`,
    });
}

function createNamespace(data) {
    return $cms().post("/api/cms/namespace", data);
}

function updateNamespace(id, data) {
    return $cms().put(`/api/cms/namespace/${id}`, data);
}

function getNamespaceById(id) {
    return $cms().get(`/api/cms/namespace/${id}`);
}
function getNamespaceByKey(key) {
    return $cms().get(`/api/cms/namespace-key`,{
        params:{
            key
        }
    });
}

export {
    getNamespace,
    getNamespaceByKey,
    getNamespaceById,
    createNamespace,
    updateNamespace,
};
