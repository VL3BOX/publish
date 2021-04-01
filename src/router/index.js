import Vue from "vue";
import VueRouter from "vue-router";

// COMMON
const demo = () => import("../post/demo.vue");
const index = () => import("../post/index.vue");
const draft = () => import("../views/draft.vue");

// CMS
const cms = () => import("../views/cms.vue");
// const cms_comment = () => import("../views/cms_comment.vue");
const macro = () => import("../post/macro.vue");
const jx3dat = () => import("../post/jx3dat.vue");
const fb = () => import("../post/fb.vue");
const bps = () => import("../post/bps.vue");
const tool = () => import("../post/tool.vue");
const bbs = () => import("../post/bbs.vue");
// const house = () => import("../post/house.vue");
const share = () => import("../post/share.vue");

// WIKI
const wiki = () => import("../views/wiki.vue");
const wiki_comment = () => import("../views/wiki_comment.vue");
// const achievement = () => import("../post/achievement.vue");
// const item = () => import("../post/item.vue");
// const knowledge = () => import("../post/knowledge.vue");

// APP
const bucket = () => import("../views/bucket.vue");
// const item_plan = () => import("../post/item_plan.vue");
// const collection = () => import("../post/collection.vue");
// const exam_question = () => import("../post/exam_question.vue");
// const exam_paper = () => import("../post/exam_paper.vue");
// const namespace = () => import("../post/namespace.vue");
const bucket_namespace = () => import("../bucket/namespace.vue");

Vue.use(VueRouter);

const routes = [
    // 发布索引
    { path: "/", component: index },
    // 草稿
    { path: "/draft", component: draft },
    // 发布DEMO
    { path: "/demo", component: demo },

    // CMS=====================
    // 查看
    { path: "/cms/:type", component: cms },
    // 宏发布
    {
        path: "/macro/:id?",
        component: macro,
    },
    // 插件数据发布
    {
        path: "/jx3dat/:id?",
        component: jx3dat,
    },
    // 副本发布
    {
        path: "/fb/:id?",
        component: fb,
    },
    // 职业发布
    {
        path: "/bps/:id?",
        component: bps,
    },
    // 工具发布
    {
        path: "/tool/:id?",
        component: tool,
    },
    // 茶馆闲聊
    {
        path: "/bbs/:id?",
        component: bbs,
    },
    {
        path: "/post/:id?",
        component: bbs,
    },
    // // 家园发布
    // {
    //     path: "/house/:id?",
    //     component: house,
    // },
    // 捏脸分享
    {
        path: "/share/:id?",
        component: share,
    },

    // WIKI=====================
    // 查看
    { path: "/wiki/:type", component: wiki },
    { path: "/comment/wiki", component: wiki_comment },
    // 成就攻略发布
    // {
    //     path: "/achievement/:achievement_id(\\d+)?",
    //     component: achievement,
    // },
    // // 物品攻略发布
    // {
    //     path: "/item/:source_id([_\\d]+)?",
    //     component: item,
    // },
    // // 通识百科发布
    // {
    //     path: "/knowledge/:source_id?",
    //     component: knowledge,
    // },
    // // 物品清单发布
    // {
    //     name: "item_plan",
    //     path: "/item_plan/:plan_id(\\d+)?",
    //     component: item_plan,
    // },
    // // 剑三小册发布
    // {
    //     name: "collection",
    //     path: "/collection/:collection_id(\\d+)?",
    //     component: collection,
    // },

    // 应用=====================
    // 查看
    { path: "/bucket/namespace", component: bucket_namespace },
    { path: "/bucket/:type", component: bucket },
];

const router = new VueRouter({
    routes,
});

export default router;
