<template>
    <ul>
        <li v-for="(item, i) in list" :key="i">
            <i class="u-icon">
                <img v-if="item.status != 0" svg-inline src="../assets/img/works/repo.svg" />
                <img v-else svg-inline src="../assets/img/works/draft.svg" />
            </i>
            <a class="u-title" target="_blank" :href="postLink(item.id)">
                <!-- [{{ item.type | typeFormat }}]  -->
                {{ item.title || $t('无标题') }}
            </a>
            <div class="u-desc">
                <span class="u-desc-subitem">
                    {{ $t('编号 :') }}
                    <b>{{ item.id }}</b>
                </span>
                <span class="u-status u-desc-subitem">
                    {{ $t('状态') }}:
                    <b
                        :class="{
                            pass: item.status > 0,
                            pending: item.status == 0,
                            fail: item.status < 0 || item.status > 1,
                        }"
                    >{{ statusmap[item.status] }}</b>
                </span>
                <time class="u-time u-desc-subitem">{{ $t('提交于') }}: {{ item.createTime | dateFormat }}</time>
            </div>
            <el-button-group class="u-action">
                <el-button size="mini" icon="el-icon-edit" :title="$t('编辑')" @click="edit(item.id)"></el-button>
                <el-button size="mini" icon="el-icon-delete" :title="$t('删除')" @click="del(item.id,i)"></el-button>
            </el-button-group>
        </li>
    </ul>
</template>

<script>
import { types } from "../assets/data/exam.json";
import dateFormat from "../utils/dateFormat";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { deletePaper } from "@/service/exam.js";
const statusmap = {
    "-2": "已删除",
    "-1": "未通过审核",
    "0": "待审核",
    "1": "已入库",
    "2": "私有",
};
export default {
    name: "paper",
    props: ["data"],
    data: function () {
        return {
            statusmap,
            list : this.data || []
        };
    },
    watch : {
        data : function (val){
            this.list = val || []
        }
    },
    methods: {
        edit: function (id) {
            location.href = "./#/paper/" + id;
        },
        postLink: function (id) {
            return getLink("paper", id);
        },
        del: function (id,i) {
            this.$alert(this.$t("确定删除吗？"), this.$t("消息"), {
                confirmButtonText: this.$t("确定"),
                callback: (action) => {
                    if (action == "confirm") {
                        deletePaper(id).then((res) => {
                            this.$message({
                                message: this.$t("删除成功"),
                                type: "success",
                            });
                            this.list.splice(i,1);
                        });
                    }
                },
            });
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
