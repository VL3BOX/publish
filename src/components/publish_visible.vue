<template>
    <div class="m-publish-visible">
        <el-form-item :label="$t('阅读权限')">
            <el-radio-group v-model="visible">
                <el-radio label="0">{{ $t('公开') }}</el-radio>
                <el-radio label="1">{{ $t('仅自己可见') }}</el-radio>
                <el-radio label="2">{{ $t('仅亲友可见') }}</el-radio>
                <el-radio label="3" disabled>{{ $t('密码可见') }}</el-radio>
                <el-radio label="4" disabled>{{ $t('付费可见') }}</el-radio>
                <el-radio label="5" disabled>{{ $t('粉丝可见') }}</el-radio>
            </el-radio-group>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "",
    props: ["data"],
    components: {},
    data: function () {
        return {
            visible: '0',
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.visible = newval;
        },
        visible: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
    .m-publish-visible{
        .el-radio{
            .mb(0);
        }
    }
</style>
