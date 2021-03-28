import Vue from "vue";
import VueRouter from "vue-router";

// COMMON
const demo = () => import("../post/demo.vue");
const index = () => import("../post/index.vue");
const draft = () => import("../views/draft.vue");
const cms = () => import("../views/cms.vue");

// CMS
const macro = () => import("../post/macro.vue");
// const jx3dat = () => import("../post/jx3dat.vue");
// const fb = () => import("../post/fb.vue");
// const bps = () => import("../post/bps.vue");
// const tool = () => import("../post/tool.vue");
// const house = () => import("../post/house.vue");
// const share = () => import("../post/share.vue");
// const bbs = () => import("../post/bbs.vue");

// WIKI
// const achievement = () => import("../post/achievement.vue");
// const item = () => import("../post/item.vue");
// const item_plan = () => import("../post/item_plan.vue");
// const knowledge = () => import("../post/knowledge.vue");
// const collection = () => import("../post/collection.vue");

// APP
// const exam = () => import("../post/exam.vue");
// const exam_question = () => import("../post/exam_question.vue");
// const exam_paper = () => import("../post/exam_paper.vue");

// const namespace = () => import("../post/namespace.vue");

Vue.use(VueRouter);

const routes = [
    // 发布索引
    { path: "/", component: index },
    // 草稿索引
    { path: "/draft", component: draft },
    // 发布DEMO
    { path: "/demo", component: demo },
    // 查看
    { path: "/bucket/:type", component: cms },

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

    // CMS=====================
    // 宏发布
    {
        path: "/macro/:id?",
        component: macro,
    },

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
