<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="发布中心" slug="publish" root="/publish" :crumbEnable="true">
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
                User.destroy() && User.toLogin();
            }
        }
    },
    components: {
        Nav,
    },
};
</script>
<style lang="less">
    @import './assets/css/app.less';
</style>
