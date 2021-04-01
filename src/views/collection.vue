<template>
    <ul>
        <li v-for="(item, i) in data" :key="i">
            <i class="u-icon">
                <img
                    v-if="item.public"
                    svg-inline
                    src="../assets/img/works/repo.svg"
                />
                <img v-else svg-inline src="../assets/img/works/draft.svg" />
            </i>
            <a class="u-title" target="_blank" :href="item.id | getCollectionLink">{{
                item.title || "无标题"
            }}</a>
            <div class="u-desc">
                <!-- <div class="m-tags">
                    <div
                        class="m-tag"
                        v-for="(tag, key) in item.tags"
                        :key="key"
                        v-text="tag"
                    ></div>
                </div> -->
                <span class="u-collection-id">
                    编号 : <b>{{item.id}}</b>
                </span>
                <span v-if="item.updated">
                    最后更新:
                    {{ (item.updated * 1000) | dateFormat }}</span
                >
            </div>
            <el-button-group class="u-action">
                <el-button
                    size="mini"
                    icon="el-icon-edit"
                    title="编辑"
                    @click="post_edit(item.id)"
                ></el-button>
                <el-button
                    size="mini"
                    icon="el-icon-delete"
                    title="删除"
                    @click="post_del(item.id)"
                ></el-button>
            </el-button-group>
            <!-- </div> -->
        </li>
    </ul>
</template>

<script>
import { remove_collection } from "@/service/collection";
import { getTypeLabel,getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "",
    props: ["data"],
    data: function() {
        return {};
    },
    computed: {},
    methods: {
        post_edit(id) {
            location.href = "./publish/#/collection/" + id;
        },
        post_del(id) {
            this.$alert("确定要删除这篇小册吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    remove_collection(id).then((res) => {
                        res = res.data;
                        if (res.code === 200) {
                            this.$message({
                                type: "success",
                                message: `删除成功`,
                            });
                            this.page_change(this.page);
                        } else
                            this.$message({
                                type: "warning",
                                message: res.message,
                            });
                    });
                },
            });
        },
        // getLink,
        getTypeLabel,
    },
    filters: {
        dateFormat: function(val) {
            return dateFormat(new Date(val));
        },
        getCollectionLink: function(val) {
            return getLink('collection',val);
        },
    },
    mounted: function() {},
    components: {},
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
.u-collection-id{
    .mr(10px);
}
</style>
