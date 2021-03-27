import { $_server } from "./axios";

function uploadData(formdata, vm){
    return $_server.post("/upload", formdata)
}

export {uploadData}