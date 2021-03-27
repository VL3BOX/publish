import { axios, $server, $_server } from "./axios";
import { $cms } from "@jx3box/jx3box-common/js/https.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

// 1.资料
// -------------------------------
function getProfile() {
    return $_server.get("profile");
}
function updateProfile(data) {
    return $_server.post("profile", data);
}

// 2.头像
// -------------------------------
function updateAvatar(data) {
    return $_server.put("profile/avatar", data);
}
function uploadAvatar(data) {
    return $_server.post("upload/avatar", data);
}
function getFrames() {
    return axios.get(__imgPath + "data/user_avatar_frame.json");
}
function getUserOverview(uid) {
    return $server.get(`user/overview/${uid}`);
}

// 3.密码
// -------------------------------
function updatePassword(data) {
    return $_server.post("profile/password", data);
}

// 4.邮箱
// -------------------------------
function checkEmailStatus() {
    return $_server.get("profile/email/check");
}

function checkEmailAvailable(email) {
    return $_server.get("profile/email/available", {
        params: {
            user_email: email,
        },
    });
}

function sendBindEmail(data) {
    return $_server.post("profile/email/bind", data);
}

function sendVerifyEmail() {
    return $_server.post("profile/email/verify");
}

// 5.互联
function checkOAuth() {
    return $_server.get("profile/oauth/check");
}

function unbindOAuth(data) {
    return $_server.post("profile/oauth/unbind", data);
}

// 6.亲友设置


export {
    updateProfile,
    getProfile,
    updateAvatar,
    updatePassword,
    sendVerifyEmail,
    checkEmailAvailable,
    checkEmailStatus,
    sendBindEmail,
    unbindOAuth,
    checkOAuth,
    uploadAvatar,
    getFrames,
    getUserOverview,
};
