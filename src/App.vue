<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="创作中心" slug="publish" root="/publish" :crumbEnable="true">
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
import User from '@jx3box/jx3box-common/js/user'
export default {
    name: "publish",
    props: [],
    data: function () {
        return {};
    },
    methods: {},
    created: function () {
        if (location.hostname != "localhost") {
            if (!User.isLogin()) {
                User.toLogin();
            }
        }
    },
    components: {
        Nav,
    },
};
</script>
<style lang="less">
@import "./assets/css/app.less";
</style>
