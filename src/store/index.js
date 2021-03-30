import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

// 默认仓储
let store = {
    state: {
        client : location.hostname.includes('origin') ? 'origin' : 'std'
    },
    mutations: {
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
