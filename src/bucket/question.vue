<template>
    <ul>
        <li v-for="(item, i) in list" :key="i">
            <i class="u-icon">
                <img v-if="item.status > 0" svg-inline src="../assets/img/works/repo.svg" />
                <img v-else svg-inline src="../assets/img/works/draft.svg" />
            </i>
            <a
                class="u-title"
                target="_blank"
                :href="postLink(item.id)"
            >[{{ item.type | typeFormat }}] {{ item.title || "无标题" }}</a>
            <div class="u-desc">
                <span class="u-desc-subitem">
                    编号 :
                    <b>{{ item.id }}</b>
                </span>
                <span class="u-status u-desc-subitem">
                    状态:
                    <b
                        :class="{
                            pass: item.status > 0,
                            pending: item.status == 0,
                            fail: item.status < 0,
                        }"
                    >{{ statusmap[item.status] }}</b>
                </span>
                <time class="u-time u-desc-subitem">提交于: {{ item.createTime | dateFormat }}</time>
            </div>
            <el-button-group class="u-action">
                <el-button size="mini" icon="el-icon-edit" title="编辑" @click="edit(item.id)"></el-button>
            </el-button-group>
        </li>
    </ul>
</template>

<script>
import { types } from "../assets/data/exam.json";
import dateFormat from "../utils/dateFormat";
import { getLink } from "@jx3box/jx3box-common/js/utils";
const statusmap = {
    "-2": "已删除",
    "-1": "未通过审核",
    "0": "待审核",
    "1": "已入库",
};
export default {
    name: "",
    props: ["data"],
    data: function () {
        return {
            statusmap,
        };
    },
    computed: {
        list: function () {
            return this.data;
        },
    },
    methods: {
        edit: function (id) {
            location.href = "./#/question/" + id;
        },
        postLink: function (id) {
            return getLink("question", id);
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val * 1000));
        },
        typeFormat: function (type) {
            return types[type];
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
.m-dashboard-box-list .u-status {
    .pass {
        color: #49c10f;
    }
    .pending {
        color: #fba524;
    }
    .fail {
        color: #fc3c3c;
    }
}
</style>
