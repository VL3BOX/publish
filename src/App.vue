<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb :name="$t('创作中心')" slug="publish" root="/publish" :crumbEnable="true">
            <img slot="logo" svg-inline src="./assets/img/publish.svg" />
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main :withoutRight="true" class="m-publish-container">
            <router-view class="m-publish" />
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import User from "@jx3box/jx3box-common/js/user";
import LocalDraft from "@/utils/localDraft";
import { getUserConf } from "@/service/user.js";
export default {
    name: "publish",
    props: [],
    data: function() {
        return {
        };
    },
    methods: {
        loadUserConf : function (){
            getUserConf().then((res) => {
                this.$store.commit('setUserConf',res?.data?.data)
            })
        },
        init : function (){

            // 草稿箱
            const localDraft = new LocalDraft();
            this.$store.commit("SET_DB", localDraft);

            // 用户偏好
            this.loadUserConf();

        },
    },
    created: function() {
        if (location.hostname != "localhost") {
            if (!User.isLogin()) {
                User.toLogin();
            }
        }
        this.init();
    },
    components: {
        Nav,
    },
};
</script>
<style lang="less">
@import "./assets/css/app.less";
</style>
