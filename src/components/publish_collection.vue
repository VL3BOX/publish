<template>
    <div class="m-publish-collection">
        <el-input
            v-model="collection"
            :maxlength="50"
            :minlength="2"
            show-word-limit
            required
            placeholder="请输入小册ID（可选，非必填）"
        >
            <span slot="prepend">关联小册</span>
            <span slot="append">
                <a href="https://www.jx3box.com/tool/20891" target="_blank">
                    <i class="el-icon-question"></i> 小册帮助指南
                </a>
            </span>
        </el-input>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_collection",
    props: ["data"],
    data: function () {
        return {
            collection: this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.collection = newval;
        },
        collection: {
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

