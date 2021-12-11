import Vue from "vue";
import VueRouter from "vue-router";

// COMMON
const demo = () => import("../post/demo.vue");
const index = () => import("../post/index.vue");
const draft = () => import("../views/draft.vue");
const union = () => import("../views/union.vue");

// CMS
const cms = () => import("../views/cms.vue");
const cms_comment = () => import("../views/cms_comment.vue");
const macro = () => import("../post/macro.vue");
const jx3dat = () => import("../post/jx3dat.vue");
const fb = () => import("../post/fb.vue");
const bps = () => import("../post/bps.vue");
const tool = () => import("../post/tool.vue");
const bbs = () => import("../post/bbs.vue");
// const house = () => import("../post/house.vue");
const share = () => import("../post/share.vue");
const notice = () => import("../post/notice.vue");
const feedback = () => import("../views/feedback.vue");

// WIKI
const wiki = () => import("../views/wiki.vue");
const wiki_comment = () => import("../views/wiki_comment.vue");
const achievement = () => import("../post/achievement.vue");
const item = () => import("../post/item.vue");
const knowledge = () => import("../post/knowledge.vue");
const quest = () => import("../post/quest.vue");

// APP
const bucket = () => import("../views/bucket.vue");
const item_plan = () => import("../post/item_plan.vue");
const exam_question = () => import("../post/exam_question.vue");
const exam_paper = () => import("../post/exam_paper.vue");

const namespace = () => import("../post/namespace.vue");
const bucket_namespace = () => import("../bucket/namespace.vue");

const joke = () => import("../post/joke.vue");
const bucket_joke = () => import("../bucket/joke.vue");

const emotion = () => import("../post/emotion.vue");
const bucket_emotion = () => import("../bucket/emotion.vue");

const collection = () => import("../post/collection.vue");
const bucket_collection = () => import("../bucket/collection.vue");

Vue.use(VueRouter);

const routes = [
    // 索引
    { path: "/", component: index },

    // CMS
    // ================================
    // 查看
    { path: "/cms/:type", component: cms },
    // 联合创作
    { name: "union_active", path: "/union/active", component: union },
    { name: "union_passive", path: "/union/passive", component: union },

    // 发布DEMO
    { path: "/demo", component: demo },
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
    // 家园发布
    // {
    //     path: "/house/:id?",
    //     component: house,
    // },
    // 捏脸分享
    {
        path: "/share/:id?",
        component: share,
    },
    // 公告
    {
        path: "/notice/:id?",
        component: notice,
    },

    // 百科=====================
    // 查看
    { path: "/wiki/:type", name: "wiki_post", component: wiki },
    // 成就攻略发布
    {
        path: "/achievement/:achievement_id(\\d+)?",
        component: achievement,
    },
    // 物品攻略发布
    {
        path: "/item/:source_id([_\\d]+)?",
        component: item,
    },
    // 通识百科发布
    {
        path: "/knowledge/:source_id?",
        component: knowledge,
    },
    // 任务攻略发布
    {
        path: "/quest/:source_id([_\\d]+)?",
        component: quest,
    },

    // 应用=====================
    // 骚话
    { path: "/joke/:id?", component: joke },
    { path: "/bucket/joke", component: bucket_joke },
    // 表情
    { path: "/emotion/:id?", component: emotion },
    { path: "/bucket/emotion", component: bucket_emotion },
    // 铭牌
    { path: "/namespace/:id?", component: namespace },
    { path: "/bucket/namespace", component: bucket_namespace },
    // 小册
    { path: "/collection/:collection_id(\\d+)?", component: collection },
    { path: "/bucket/collection", component: bucket_collection },

    // 考试
    { path: "/bucket/:type", name: "bucket", component: bucket },
    // 题目发布
    {
        name: "question",
        path: "/question/:id?",
        component: exam_question,
    },
    // 试卷发布
    {
        name: "paper",
        path: "/paper/:id?",
        component: exam_paper,
    },
    // 物品清单发布
    {
        name: "item_plan",
        path: "/item_plan/:plan_id(\\d+)?",
        component: item_plan,
    },

    // 草稿=====================
    // 草稿
    { path: "/draft", component: draft },

    // 评论=====================
    { path: "/comment/cms", component: cms_comment },
    { path: "/comment/wiki", component: wiki_comment },
    { path: "/comment/feedback", component: feedback },
];

const router = new VueRouter({
    routes,
});

export default router;
