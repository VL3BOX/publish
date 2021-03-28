<template>
    <div class="m-publish-client">
        <el-form-item label="版本">
            <el-radio-group v-model="client">
                <el-radio label="std">正式服</el-radio>
                <el-radio label="origin">怀旧服</el-radio>
                <el-radio label="all">全部</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_client",
    props: ["data"],
    data: function () {
        return {
            client: this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.client = newval;
        },
        client: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>


