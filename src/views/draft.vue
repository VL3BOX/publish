<template>
    <div class="m-publish m-draft">
        <div class="m-draft-header">
            <h1 class="m-title">
                <i class="el-icon-receiving"></i> {{ $t('草稿箱') }}
                <el-tooltip class="item" effect="dark" placement="top" popper-class="m-draft-help-tip">
                    <div slot="content">{{ $t('以下草稿是编辑器在当前浏览器下产生的临时本地草稿HTML源码，') }}<br />{{ $t('并不存在于服务器中，仅用于断网或窗口异常关闭时恢复。') }}</div>
                    <span class="u-help"><i class="el-icon-question"></i> <span>{{ $t('使用帮助') }}</span></span>
                </el-tooltip>
            </h1>
            <div class="u-op">
                <el-button plain icon="el-icon-delete" size="small" @click="clean" :disabled="!isNotNull">{{ $t('清空') }}</el-button>
            </div>
        </div>
        <template v-if="isSupported">
            <div class="m-draft-list" v-if="isNotNull">
                <ul class="u-list">
                    <li class="u-item" v-for="(item, i) in data" :key="i">
                        <div class="u-label" :class="{ on: !!item.active }">
                            <!-- <i class="u-item-icon" :class="!!item.active ? 'el-icon-folder-opened' : 'el-icon-folder'"></i> -->
                            <i class="u-item-icon el-icon-document"></i>
                            <span class="u-item-key">{{ item | itemName }} <em class="u-item-time" v-if="item.data.cache_time">( {{ item | formatDate }} )</em></span>
                            <div class="u-op">
                                <el-button type="primary" plain icon="el-icon-view" size="mini" class="u-delete" @click.stop="preview(item)">{{ $t('预览') }}</el-button>
                                <el-popconfirm title="确定删除吗？" @confirm="del(item, i)">
                                    <el-button slot="reference" plain icon="el-icon-delete" size="mini" class="u-delete" @click.stop>{{ $t('删除') }}</el-button>
                                </el-popconfirm>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="m-draft-null" v-else><i class="el-icon-warning-outline"></i> {{ $t('暂无任何内容') }}</div>
        </template>
        <template v-else>
            <el-alert :title="$t('您的浏览器太旧了，不支持本功能。')" type="error" show-icon></el-alert>
        </template>
    </div>
</template>

<script>
// TINYMCE AUTOSAVE
const DRAFT_PREFIX = "tinymce-autosave-";
import { showRecently } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "draft",
    props: [],
    components: {},
    data: function() {
        return {
            data: [],
        };
    },
    computed: {
        isSupported: function() {
            return !!window.localStorage;
        },
        isNotNull: function() {
            return !!this.data && !!this.data.length;
        },
        isWeb({ activeName }) {
            return activeName === "web";
        },
        db() {
            return this.$store.state.db;
        },
    },
    methods: {
        // 加载
        loadDrafts: async function() {
            let len = await this.db.length();
            for (let i = 0; i < len; i++) {
                let key = await this.db.key(i);
                // if (key.startsWith(DRAFT_PREFIX)) {
                this.data.push({
                    key,
                    data: await this.db.getItem(key),
                });
                // }
            }
        },
        // 清空
        clean: function() {
            this.$alert(this.$t("此操作不可逆！请谨慎操作！"), this.$t("警告"), {
                confirmButtonText: this.$t("确定清空"),
                callback: (action) => {
                    // 清空localstorage
                    this.db.clear();
                    // 清空缓存数据
                    this.data = [];
                    // 通知
                    this.$notify({
                        title: this.$t("清空成功"),
                        type: "success",
                        message: this.$t("本地草稿清空成功"),
                    });
                },
            });
        },
        // 预览
        preview: function(item) {
            this.$router.push(`/${item.data.post_type}/${item.data.ID}?mode=draft&key=${item.key}`);
        },
        // 删除
        del: function(item, i) {
            this.db.removeItem(item.key).then(() => {
                this.data.splice(i, 1);
            });
        },
        // 复制
        onCopy: function(val) {
            this.$notify({
                title: this.$t("复制成功"),
                message: this.$t("草稿源码复制成功"),
                type: "success",
            });
        },
        onError: function() {
            this.$notify.error({
                title: this.$t("复制失败"),
                message: this.$t("请手动复制"),
            });
        },
    },
    filters: {
        itemName(item) {
            return item?.data?.post_title || `${item.key}`;
        },
        formatDate(item) {
            let time = item?.data?.cache_time
            return time ? showRecently(new Date(time)) : '';
        },
    },
    created: function() {
        this.loadDrafts();
    },
    mounted: function() {},
};
</script>

<style lang="less">
@import "../assets/css/draft.less";
</style>
