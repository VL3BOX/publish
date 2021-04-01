<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">我的铭牌</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 创建铭牌
            </a>
        </div>

        <el-row :gutter="20" class="m-namespace">
            <el-col :span="6" v-for="(item, i) in list" :key="i">
                <div class="u-item">
                    <span class="el-icon-postcard u-icon"></span>
                    <a class="u-title" target="_blank" :href="item.link">{{ item.key || '未知' }}</a>
                    <div class="u-desc">
                        <span class="u-status u-desc-subitem">
                            状态:
                            <b :class="`status${item.status}`">{{ statusmap[item.status] }}</b>
                        </span>
                        <time class="u-time u-desc-subitem">提交于: {{ item.created | dateFormat }}</time>
                    </div>
                    <el-button-group class="u-action">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            title="编辑"
                            @click="edit(item.ID, item.source_type, item.source_id)"
                        ></el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getNamespace } from "@/service/namespace";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
const statusmap = {
    "0": "待审核",
    "1": "正常启用",
    "2": "未通过审核",
};
export default {
    name: "namespace",
    props: ["data"],
    data: function () {
        return {
            list: [],
            statusmap,
        };
    },
    computed: {
        publishLink: function () {
            return "./#/" + "namespace";
        },
    },
    methods: {
        edit: function (id, type, teamid) {
            if (type == "team") {
                location.href = "/team/org/edit/" + teamid + "?tab=other";
                return;
            }
            location.href = "./#/namespace/" + id;
        },
    },
    mounted: function () {
        getNamespace().then((res) => {
            this.list = res.data.data.data;
        });
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
@import "../assets/css/work.less";
.m-namespace {
    .mt(20px);
    .u-desc {
        .status0 {
            color: #fba524;
        }
        .status1 {
            color: #49c10f;
        }
        .status2 {
            color: #fc3c3c;
        }
    }

    li {
        .fl;
    }
}
</style>
