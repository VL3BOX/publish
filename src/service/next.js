import { $next } from "@jx3box/jx3box-common/js/https";

function getNextStat() {
    return $next().get(`/api/my-resource/stat`);
}

export { getNextStat };
