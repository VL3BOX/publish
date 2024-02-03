<template>
    <div class="m-publish m-index">
        <h1 class="m-title">
            <i class="el-icon-edit-outline"></i> {{ $t('创作台') }}<span class="u-desc">{{ $t('丹青著华年，墨香漫天下') }}</span>
            <el-tooltip :content="$t('成为签约作者，获取更多福利与权益')" placement="top">
                <a
                    href="/dashboard/cooperation"
                    size="mini"
                    type="primary"
                    class="el-button el-tooltip el-button--primary el-button--mini u-btn"
                    target="_blank"
                    >{{ $t('申请签约作者') }}</a
                >
            </el-tooltip>
        </h1>
        <div class="u-nav">
            <el-divider content-position="left">PVE / PVP</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/macro">
                        <img svg-inline src="../assets/img/channel/macro.svg" />
                        <span>{{ $t('剑三宏') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/bps">
                        <img svg-inline src="../assets/img/channel/bps.svg" />
                        <span>{{ $t('职业攻略') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/pvp">
                        <img svg-inline class="u-icon" :src="getAppIcon('pvp')" />
                        <span>{{ $t('竞技技巧') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/fb">
                        <img svg-inline src="../assets/img/channel/fb.svg" />
                        <span>{{ $t('副本攻略') }}</span>
                    </router-link>
                </el-col>
                <!-- <el-col :span="4">
                    <router-link to="/jx3dat">
                        <img svg-inline src="../assets/img/channel/jx3dat.svg" />
                        <span>{{ $t('插件数据') }}</span>
                    </router-link>
                </el-col> -->
                <el-col :span="4">
                    <router-link to="/tool">
                        <img svg-inline src="../assets/img/channel/tool.svg" />
                        <span>{{ $t('工具资源') }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVA</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/achievement">
                        <img svg-inline src="../assets/img/channel/achievement.svg" />
                        <span>{{ $t('成就百科') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/item">
                        <img svg-inline src="../assets/img/channel/item.svg" />
                        <span>{{ $t('物品百科') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/quest">
                        <img svg-inline src="../assets/img/channel/quest.svg" />
                        <span>{{ $t('任务百科') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/knowledge">
                        <img svg-inline src="../assets/img/channel/knowledge.svg" />
                        <span>{{ $t('通识百科') }}</span>
                    </router-link>
                </el-col>
                <!-- <el-col :span="4">
                    <router-link to="/item_plan">
                        <i class="el-icon-folder"></i>
                        <span>{{ $t('物品清单') }}</span>
                    </router-link>
                </el-col> -->
            </el-row>

            <el-divider content-position="left">PVX</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/face">
                        <img svg-inline src="../assets/img/channel/share.svg" />
                        <span>{{ $t('捏脸数据') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/body">
                        <img svg-inline src="../assets/img/channel/body.svg" />
                        <span>{{ $t('体型数据') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/question">
                        <i class="el-icon-s-opportunity"></i>
                        <span>{{ $t('剑三题目') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/paper">
                        <img svg-inline src="../assets/img/channel/100.svg" />
                        <span>{{ $t('剑三试卷') }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVBB</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/bbs">
                        <img svg-inline src="../assets/img/channel/post.svg" />
                        <span>{{ $t('剑三茶馆') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/joke">
                        <img svg-inline src="../assets/img/channel/joke.svg" />
                        <span>{{ $t('剑三骚话') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/emotion">
                        <img svg-inline src="../assets/img/channel/emotion.svg" />
                        <span>{{ $t('剑三表情') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/collection">
                        <i class="el-icon-notebook-1"></i>
                        <span>{{ $t('剑三小册') }}</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/namespace">
                        <i class="el-icon-postcard"></i>
                        <span>{{ $t('剑三铭牌') }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <template v-if="isAdmin">
                <el-divider content-position="left">{{ $t('管理') }}</el-divider>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <router-link to="/notice">
                            <i class="el-icon-bell"></i>
                            <span>{{ $t('公告资讯') }}</span>
                        </router-link>
                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils.js";
export default {
    name: "index",
    props: [],
    data: function () {
        return {
            isAdmin: User.isAdmin(),
        };
    },
    computed: {},
    methods: {
        getAppIcon,
    },
};
</script>

<style scoped lang="less">
@import "../assets/css/index.less";
</style>
