import { $next } from "@jx3box/jx3box-common/js/https";

/**
 * 上传付费附件
 * @param {*} data
 */
export function uploadFile(data) {
    return $next().post("/api/face/file-upload", data);
}

/**
 * 新增捏脸
 * @params {Object} data
 */
export function addFace(data) {
    return $next().post("/api/face", data);
}

/**
 * 获取捏脸数据
 * @params {*} id
 */
export function getFace(id) {
    return $next().get(`/api/face/${id}`);
}

/**
 * 更新捏脸数据
 * @params {*} id
 * @params {*} data
 */
export function updateFace(id, data) {
    return $next().put(`/api/face/${id}`, data);
}

/**
 * 附件关联作品
 * @param {*} id 附件id
 * @param {*} postType 作品类型
 * @param {*} postId 作品id
 */
export function attachmentRelatePost(id, postType, postId) {
    return $next().post(`/api/charge_attachment/${id}/link-to/${postType}/${postId}`);
}

/**
 * 移除关联作品
 * @param {*} id 附件id
 * @param {*} postType 作品类型
 * @param {*} postId 作品id
 */
export function attachmentRemoveRelatePost(id, postType, postId) {
    return $next().delete(`/api/charge_attachment/${postType}/${postId}/${id}`);
}

/**
 * 获取捏脸列表
 * @param {*} params
 */
export function getFaceList(params) {
    return $next().get("/api/face", { params });
}

/**
 * 上架一个捏脸数据
 * @param {*} id
 */
export function faceOnline(id) {
    return $next().post(`/api/face/${id}/online`);
}

/**
 * 下架一个捏脸数据
 * @param {*} id
 */
export function faceOffline(id) {
    return $next().post(`/api/face/${id}/offline`);
}
