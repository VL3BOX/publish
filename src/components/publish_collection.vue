<template>
    <div class="m-publish-post-collection">
        <el-form-item label="关联小册">
            <el-input v-model="collection_id" placeholder="请输入小册ID（可选，非必填）">
                <span slot="append"><a href="https://www.jx3box.com/tool/20891" target="_blank"><i class="el-icon-question"></i> 小册帮助指南</a></span>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data: function() {
        return {
            collection_id : ''
        };
    },
    model: {
        prop: "data",
        event: "update",
    },
    computed: {
    },
    watch: {
        collection_id: function(val) {
            this.$emit("update", val);
        },
        data : function (val){
            this.collection_id = val
        }
    },
    mounted: function() {
        this.collection_id = this.data
    },
};
</script>

<style lang="less">
.m-publish-post-collection {
    .mt(10px);
}
</style>
