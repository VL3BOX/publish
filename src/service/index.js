import { $_pay, $_next, $server } from "./axios";

function getMyAsset() {
    return $_pay.get("/api/vip/i");
}

function getUserMedals(uid) {
    return $_next.get("/api/user/" + uid + "/medals");
}

function getUserInfo(uid) {
    return $server.get("/user/info", {
        params: {
            uid,
        },
    });
}

export { getMyAsset, getUserMedals, getUserInfo };
