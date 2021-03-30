<template>
    <div class="m-publish-tags">
        <el-form-item label="标签">
            <el-checkbox-group v-model="tag">
                <el-checkbox v-for="item in tags" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_tags",
    props: ["data",'options'],
    data: function () {
        return {
            tag : this.data || [],
            tags: this.options || [],
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.tag = newval || [];
        },
        tag: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        options: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.tags = newval;
                }
            },
        },
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
.m-publish-tags {
    .mb(10px);
}
</style>