<template>
    <!-- 前后引导 -->
    <div class="m-publish-guide">
        <label class="el-form-item__label">前后引导
        </label>
        <div class="u-condition u-prev" key="prev">
            <span class="u-prepend el-input-group__prepend">上一篇</span>
            <el-select
                size="small"
                filterable
                remote
                placeholder="输入关键词进行搜索"
                :remote-method="remoteMethodPrev"
                v-model="data.prev_post"
                clearable
            >
                <el-option v-for="item in prev" :key="item.ID" :value="item.ID" :label="item.post_title" :disabled="disabledItem(item)">
                    <div class="u-post-select__item">
                        <el-tag size="mini" v-if="item.post_type">{{ showPostType(item.post_type) }}</el-tag>
                        <el-tag size="mini" class="u-visible" :type="item.visible != 0 && 'info'">{{ item.visible != 0 && '非公开'}}</el-tag>
                        {{ item.post_title }}
                    </div></el-option
                >
            </el-select>
        </div>
        <div class="u-condition u-next" key="next">
            <span class="u-prepend el-input-group__prepend">下一篇</span>
            <el-select
                size="small"
                filterable
                remote
                placeholder="输入关键词进行搜索"
                :remote-method="remoteMethodNext"
                v-model="data.next_post"
                clearable
            >
                <el-option v-for="item in next" :key="item.ID" :value="item.ID" :label="item.post_title" :disabled="disabledItem(item)">
                    <div class="u-post-select__item">
                        <el-tag size="mini" v-if="item.post_type">{{ showPostType(item.post_type) }}</el-tag>
                        <el-tag size="mini" class="u-visible" :type="item.visible != 0 && 'info'">{{ item.visible != 0 && '非公开'}}</el-tag>
                        {{ item.post_title }}
                    </div></el-option
                >
            </el-select>
        </div>
        <el-tooltip content="只可选择公开的文章">
            <i class="el-icon-question" style="margin-left: 10px;"></i>
        </el-tooltip>
    </div>
</template>

<script>
import { __postType } from "@jx3box/jx3box-common/data/jx3box.json";
import { getMyPosts } from "@/service/cms";
import { cloneDeep, } from "lodash";
export default {
    name: "PublishGuide",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            prev: [],
            next: [],

            isInit: true,
        };
    },
    computed: {
        form() {
            return {
                prev_post: this.data.prev_post,
                next_post: this.data.next_post,
            };
        },
    },
    watch: {
        form: {
            handler: function (val) {
                if (this.isInit) {
                    const { prev_post, next_post } = this.data;

                    const list = [prev_post, next_post].filter((item) => item).join(",");

                    list && this.loadPosts({ list });
                    this.isInit = false;
                }
            },
            deep: true,
        },
    },
    methods: {
        remoteMethodPrev(keyword) {
            if (keyword) {
                getMyPosts({
                    title: keyword,
                    page: 1,
                    per: 10,
                }).then((res) => {
                    this.prev = cloneDeep(res.data.data.list || []);
                });
            } else {
                this.prev = [];
            }
        },
        remoteMethodNext(keyword) {
            if (keyword) {
                getMyPosts({
                    title: keyword,
                    page: 1,
                    per: 10,
                }).then((res) => {
                    this.next = cloneDeep(res.data.data.list || []);
                });
            } else {
                this.next = [];
            }
        },
        showPostType: function (type) {
            return __postType[type];
        },
        loadPosts(params) {
            getMyPosts(params).then((res) => {
                const list = res.data.data.list || [];
                this.prev = cloneDeep(list);
                this.next = cloneDeep(list);
            });
        },
        disabledItem(item) {
            return item.visible != 0 || item.ID == this.data.ID;
        }
    },
};
</script>

<style lang="less">
.m-publish-guide {
    .flex;
    align-items: center;
    margin-bottom: 22px;
    .el-form-item__label {
        width: 80px;
    }
    .u-condition {
        height: 32px;
        width: auto;
        .flex;
        align-items: center;
        .el-input-group__prepend {
            padding-left: 10px;
            padding-right: 10px;
        }
        .u-prepend {
            .fl;
            width: auto;
            min-width: 50px;
            box-sizing: border-box;
            .fz(12px);
            height: 100%;
            .flex;
            align-items: center;
        }
        .el-select {
            .db;
        }
        .el-input__inner {
            box-sizing: border-box;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .el-input {
            .w(200px);
        }
    }
    .u-prev {
        margin-right: 20px;
    }
}

.u-post-select__item {
    .flex;
    align-items: center;
    gap: 5px;
    .pr;
}

@media screen and (max-width: @phone) {
    .m-publish-guide {
        flex-wrap: wrap;
        .el-form-item__label {
            width: 100%;
        }
        .u-prev {
            margin-bottom: 10px;
        }
    }
}
</style>
