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

function getSkillList(params) {
    return $node().get(`/skill`, {
        params: params,
    })
}

export { getSkill, getSkillList };
