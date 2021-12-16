import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

// 默认仓储
let store = {
    state: {
        client : location.href.includes('origin') ? 'origin' : 'std',
        db: ''
    },
    mutations: {
        switchClient : function (state,val){
            state.client = val || 'std'
        },
        SET_DB: (state, val) => {
            state.db = val
        }
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
