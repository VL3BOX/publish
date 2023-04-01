import { $node } from "@jx3box/jx3box-common/js/https";

function getSkill(query, params) {
    let condition = isNaN(query) ? "name" : "id";
    return $node().get(`/skill/${condition}/${query}`, {
        params: params,
    }).then(res => {
        return res.data;
    }).catch((err) => {
        console.log(err);
    });
}

export { getSkill };
