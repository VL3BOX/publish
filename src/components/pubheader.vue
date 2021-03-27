<template>
    <div class="m-publish-header">
        <el-page-header @back="goBack" :content="name"></el-page-header>
    </div>
</template>

<script>

export default {
    name: "pubheader",
    props: ["name"],
    data: function() {
        return {
            dialogVisible: false,
            selectedCount: 0,
            tableData: [],
        };
    },
    computed: {},
    methods: {
        goBack: function() {
            this.$root.$router.push("/");
        },
    },
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
.m-publish-header {
    .pr;
    .clearfix;
    @import "../../assets/css/components/large-dialog.less";
}
.m-publish-store {
    .pa;
    .rt(0);
    .u-clear {
        .pa;
        .lt(100px, 16px);
    }
    .m-publish-store-list {
        .el-table__header-wrapper {
            tr th:nth-child(3) {
                .x(right);
            }
        }
        .el-table__body {
            td:last-child .cell {
                .fr;
            }
        }
    }
}
</style>
