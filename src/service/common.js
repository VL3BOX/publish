import axios from "axios";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";

function getZlps() {
    return axios.get(__dataPath + "data/common/zlps.json");
}

export { getZlps };
