import Vue from "vue";
import VueRouter from "vue-router";

const index = () => import("../views/index.vue");

// CMS
// const macro = () => import("../views/macro.vue");
// const jx3dat = () => import("../views/jx3dat.vue");
// const fb = () => import("../views/fb.vue");
// const bps = () => import("../views/bps.vue");
// const tool = () => import("../views/tool.vue");
// const house = () => import("../views/house.vue");
// const share = () => import("../views/share.vue");
// const bbs = () => import("../views/bbs.vue");

// WIKI
// const achievement = () => import("../views/achievement.vue");
// const item = () => import("../views/item.vue");
// const item_plan = () => import("../views/item_plan.vue");
// const knowledge = () => import("../views/knowledge.vue");
// const collection = () => import("../views/collection.vue");

// APP
// const exam = () => import("../views/exam.vue");
// const exam_question = () => import("../views/exam_question.vue");
// const exam_paper = () => import("../views/exam_paper.vue");

// const namespace = () => import("../views/namespace.vue");

Vue.use(VueRouter);

const routes = [
    // 发布索引
    { path: "/", component: index },

    // // 成就攻略发布
    // {
    //     path: "/achievement/:achievement_id(\\d+)?",
    //     component: achievement,
    // },
    // // todo:准备弃用路由
    // {
    //     path: "/cj/:achievement_id(\\d+)?",
    //     component: achievement,
    // },

    // // 物品攻略发布
    // {
    //     path: "/item/:source_id([_\\d]+)?",
    //     component: item,
    // },
    // // 物品清单发布
    // {
    //     name: "item_plan",
    //     path: "/item/plan/:plan_id(\\d+)?",
    //     component: item_plan,
    // },

    // // 通识百科发布
    // {
    //     path: "/knowledge/:source_id?",
    //     component: knowledge,
    // },

    // // 剑三小册发布
    // {
    //     name: "collection",
    //     path: "/collection/:collection_id(\\d+)?",
    //     component: collection,
    // },


    // // 副本发布
    // {
    //     path: "/fb/:id?",
    //     component: fb,
    // },

    // // 插件数据发布
    // {
    //     path: "/jx3dat/:id?",
    //     component: jx3dat,
    // },

    // // 家园发布
    // {
    //     path: "/house/:id?",
    //     component: house,
    // },

    // // 宏发布
    // {
    //     path: "/macro/:id?",
    //     component: macro,
    // },

    // // 职业发布
    // {
    //     path: "/bps/:id?",
    //     component: bps,
    // },

    // // 工具发布
    // {
    //     path: "/tool/:id?",
    //     component: tool,
    // },

    // // 茶馆闲聊
    // {
    //     path: "/bbs/:id?",
    //     component: bbs,
    // },
    // {
    //     path: "/post/:id?",
    //     component: bbs,
    // },

    // // 捏脸分享
    // {
    //     path: "/share/:id?",
    //     component: share,
    // },


    // // 趣味题库
    // {
    //     path: "/exam/",
    //     component: exam,
    // },
    // {
    //     path: "/exam/question/:id?",
    //     component: exam_question,
    // },
    // {
    //     path: "/exam/paper/:id?",
    //     component: exam_paper,
    // },
    // // 铭牌
    // {
    //     path: "/namespace/:id?",
    //     component: namespace,
    // },
];

const router = new VueRouter({
    routes,
});

export default router;
