import { $next } from "@jx3box/jx3box-common/js/https";

/**
 * 上传付费附件
 * @param {*} data
 */
export function uploadFile(data) {
    return $next().post("/api/face/file-upload", data);
}
