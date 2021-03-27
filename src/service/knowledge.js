import { $http } from "./axios";
import qs from "qs";

function get_menus() {
    return $http({
        method: "GET",
        url: `/api/knowledge/menus`,
    });
}

function get_list(params) {
    return $http({
        method: "GET",
        url: `/api/knowledges`,
        params: params,
    });
}

function create_knowledge(params) {
    return $http({
        method: "POST",
        url: `/api/knowledge`,
        data: qs.stringify({ knowledge: params }),
    });
}

export { get_menus, get_list, create_knowledge };
