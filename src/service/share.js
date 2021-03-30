import { $_https } from "@jx3box/jx3box-common/js/https";

// 上传
function uploadData(formdata) {
    return $_https("server").post("/upload/data", formdata);
}

export { uploadData };
