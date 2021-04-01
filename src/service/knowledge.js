import { $helper } from "@jx3box/jx3box-common/js/https.js";
import qs from "qs";

function get_menus() {
    return $helper()({
        method: "GET",
        url: `/api/knowledge/menus`,
    });
}

function get_list(params) {
    return $helper()({
        method: "GET",
        url: `/api/knowledges`,
        params: params,
    });
}

function create_knowledge(params) {
    return $helper()({
        method: "POST",
        url: `/api/knowledge`,
        data: qs.stringify({ knowledge: params }),
    });
}

export { get_menus, get_list, create_knowledge };
