<template>
    <div class="m-publish-notify">
        <el-switch
            v-model="notify.feedEnable"
            active-color="#0366d6"
            inactive-color="#999"
            active-text="通知作品订阅用户"
            disabled
        >
        </el-switch>
        <el-switch
            v-model="notify.followEnable"
            active-color="#0366d6"
            inactive-color="#999"
            active-text="通知粉丝"
            disabled
        >
        </el-switch>
        <el-switch
            v-model="notify.tencentEnable"
            active-color="#0366d6"
            inactive-color="#999"
            active-text="同步至腾讯文档"
            disabled
        >
        </el-switch>
        <el-switch
            v-model="notify.weiboEnable"
            active-color="#0366d6"
            inactive-color="#999"
            active-text="同步至微博头条文章"
            disabled
        >
        </el-switch>
        <el-switch
            v-model="notify.tuilanEnable"
            active-color="#0366d6"
            inactive-color="#999"
            active-text="同步至推栏"
            disabled
        >
        </el-switch>
    </div>
</template>

<script>
export default {
    name: "post_notify",
    props: ['notify'],
    data: function() {
        return {
            post_notify : this.notify
        };
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
.m-publish-notify {
    .el-switch {
        .mr(40px);
    }
}
@media screen and (max-width:@phone){
    .m-publish-notify{
        div{
            .mb(10px);
            .db;
            .mr(0) !important;
        }
    }
}
</style>
