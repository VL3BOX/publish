import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

// 默认仓储
let store = {
    state: {
        post : {
            ID : '',
            post_type : '',
            post_subtype : '',
            post_title: "",
            post_content: "",
            post_meta: {},
            post_excerpt: "",
            post_mode: "tinymce",
            post_banner: "",
            post_status : 'publish',
            // post_tags: [],
        },
        meta : {},
        extend: {
            feedEnable: false, 
            followEnable: false,
            tencentEnable: false,
            weiboEnable: false,
            tuilanEnable: false,
        },
        processing : false
    },
    mutations: {
        changeType : function (state, payload){
            state.post.post_type = payload;
        },
        changeSubtype : function (state,payload){
            state.post.post_subtype = payload
        },
        editTitle: function(state, payload) {
            state.post.post_title = payload;
        },
        editContent: function(state, payload) {
            state.post.post_content = payload;
        },
        editExcerpt: function(state, payload) {
            state.post.post_excerpt = payload;
        },
        changeMode: function(state, payload) {
            state.post.post_mode = payload;
        },
        editBanner: function(state, payload) {
            state.post.post_banner = payload;
        },
        changeStatus : function (state, payload){
            state.post.post_status = payload;
        },
        editPostMeta: function(state, payload) {
            state.post.post_meta = payload;
        },
        editMeta: function(state, payload) {
            state.meta = payload;
        },
        loadPost : function (state,payload){
            state.post = payload
        },
        startProcess : function (state){
            state.processing = true
        },
        endProcess : function (state){
            state.processing = false
        }
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
