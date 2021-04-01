import { $helper } from "@jx3box/jx3box-common/js/https.js";
import qs from "qs";

function get_item_plan(plan_id) {
    return $helper()({
        method: "GET",
        url: `/api/item_plan/${plan_id}`,
    });
}

// 提交物品清单
function save_item_plan(params) {
    let action = params.id ? "update" : "create";
    let data = { action: action, plan: params };

    return $helper()({
        method: "POST",
        url: `/api/item_plan`,
        data: qs.stringify(data),
    });
}

// 获取我的清单
function get_my_item_plans(params) {
    return $helper()({
        method: "GET",
        url: `/api/my/item_plans`,
        params: params,
    });
}

function delete_item_plan(plan_id) {
    return $helper()({
        method: "PUT",
        url: `/api/item_plan/remove`,
        data: qs.stringify({ plan_id: plan_id }),
    });
}

export { get_item_plan, save_item_plan, get_my_item_plans, delete_item_plan };
