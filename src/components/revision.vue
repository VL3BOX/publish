<template>
    <div class="m-revision">
        <el-button type="text" @click="view">历史版本</el-button>

        <el-drawer title="历史版本" :visible.sync="show" z-index="2100" class="m-revision-drawer" append-to-body>
            <h3 class="u-revision-title" slot="title">历史版本</h3>
            <main class="m-revision-container" v-loading="loading">
                <div class="u-actions">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAll">全部选择</el-checkbox>
                    <el-button v-show="checked && checked.length" class="u-del-btn" size="mini" type="danger" icon="el-icon-delete" @click="delRevisions">批量删除</el-button>
                </div>
                <div class="m-revision-list">
                    <ul v-if="data && data.length">
                        <li class="m-revision-item" v-for="(item, i) in data" :key="i">
                            <span class="u-name">
                                <el-checkbox class="u-checkbox" v-model="item.checked" @change="(val) => checkChange(val, item)"></el-checkbox>
                                <i class="u-icon el-icon-tickets"></i>
                                <span>{{ item | revisionName }}</span>
                                <span class="u-remark" v-if="item.remark"> (备注: {{ item.remark }}) </span>
                                <i class="u-edit el-icon-edit" title="添加备注" @click="remark(item)"></i>
                            </span>

                            <el-button-group>
                                <el-tooltip effect="dark" content="预览" placement="top">
                                    <el-button size="mini" icon="el-icon-position" @click="use(item)"></el-button>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <el-button size="mini" icon="el-icon-delete" @click="del(item)"></el-button>
                                </el-tooltip>
                            </el-button-group>
                        </li>

                        <el-pagination
                            class="u-list-pagination"
                            background
                            hide-on-single-page
                            layout="prev,pager,next,->,total"
                            :total="total"
                            :page-size="per"
                            :current-page.sync="page"
                        ></el-pagination>
                    </ul>

                    <el-alert v-else title="当前没有任何历史版本" type="info" show-icon></el-alert>
                </div>
            </main>
        </el-drawer>
    </div>
</template>

<script>
import { getRevisions, putRevision, removeRevision, removeRevisions } from "@/service/revision";

export default {
    name: "revision",
    props: {
        postId: {
            type: [String, Number],
            default: 0,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            show: false,
            data: [
                {
                    id: 1,
                    version: 1,
                    updated_at: "2021-12-19 16:29",
                    remark: "",
                    data: {},
                    checked: false,
                },
            ],

            per: 10,
            page: 1,
            total: 0,
            loading: false,

            checked: [],
            checkedAll: false,
            isIndeterminate: false,
        };
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.loadList();
            },
        },
    },
    filters: {
        revisionName(val) {
            return `版本${val.version}~${val.updated_at}`;
        },
    },
    computed: {
        params() {
            return {
                page: this.page,
                per: this.per,
            };
        },
    },
    methods: {
        view() {
            if (!this.postId) return;
            this.show = true;
            this.loadList();
        },
        loadList() {
            this.loading = true;
            getRevisions(this.postId, this.params)
                .then((res) => {
                    this.data = res.data.data.list.map((item) => {
                        this.$set(item, "checked", false);
                        return item;
                    });
                    this.page = res.data.data.page;
                    this.per = res.data.data.per;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        remark(item) {
            this.$prompt("请输入备注", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                inputValue: item.remark || "",
            }).then(({ value }) => {
                // item.remark = value
                putRevision(this.postId, item.id, { remark: value })
                    .then(() => {
                        this.$message.success("备注添加成功");
                        item.remark = value;
                        return true;
                    })
                    .catch(() => {
                        return false;
                    });
            });
        },
        checkChange(val, item) {
            if (val) {
                this.checked.push(item.id);
            } else {
                this.checked = this.checked.filter((c) => c !== item.id);
            }
            this.checkedAll = this.checked.length === this.data.length;
        },
        checkAll(val) {
            if (val) {
                this.checked = this.data.map((item) => item.id);
                this.data.map((item) => {
                    item.checked = true;
                    return item;
                });
            } else {
                this.checked = [];
                this.data.map((item) => {
                    item.checked = false;
                    return item;
                });
            }
            this.isIndeterminate = false;

            console.log(this.checked);
        },
        use(item) {
            const routeName = this.$route.name;
            this.$router.push(`/${routeName}/${item.post_id}/?mode=revision&id=${item.id}`);
        },
        del(item) {
            this.$confirm(`确认删除历史版本[版本${item.version}~${item.updated_at}]？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                removeRevision(this.postId, item.id).then(() => {
                    this.$notify({
                        type: "success",
                        title: "成功",
                        message: "历史版本删除成功",
                    });

                    this.loadList();
                });
            });
        },
        delRevisions() {
            this.$confirm(`确认删除选中的历史版本？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                const ids = this.checked.join(",");
                removeRevisions(this.postId, ids).then(() => {
                    this.$notify({
                        type: "success",
                        title: "成功",
                        message: "历史版本删除成功",
                    });

                    if (this.page === 1) {
                        this.loadList();
                    } else {
                        this.page = 1;
                    }

                    this.checked = [];
                });
            });
        },
    },
};
</script>

<style lang="less">
.m-revision {
    float: right;
    position: relative;
    top: -30px;
}
.m-revision-drawer {
    .size(100%);
    .pf;
    .rt(0);

    .u-revision-title {
        margin: 0;
    }
    .m-revision-container {
        padding: 0 10px;
    }

    .m-revision-list {
        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .m-revision-item {
            display: flex;
            justify-content: space-between;
            height: 40px;
            align-items: center;
            padding: 5px;
            .fz(12px, 28px);
            border-bottom: 1px dashed #eee;

            .u-checkbox {
                .mr(5px);
            }

            .u-edit {
                cursor: pointer;
                color: @color-link !important;
                .ml(5px);
            }
        }
        .u-list-pagination {
            .mt(20px);
            text-align: center;
        }
    }

    .u-name {
        .ml(10px);
        i {
            .fz(16px);
            color: #888;
            .y(-2px);
            .mr(5px);
        }
    }

    .u-actions {
        display: flex;
        align-items: center;
        .ml(15px);
        min-height: 28px;
    }

    .u-del-btn {
        .ml(10px);
    }
}
</style>
