import { $helper } from "@jx3box/jx3box-common/js/https.js";

function get_list(params) {
    return $helper()({
        method: "GET",
        url: `/api/quests`,
        params: params,
    });
}

export { get_list };
