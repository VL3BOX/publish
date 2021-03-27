<template>
    <singlebox :post="post" :author="author" :stat="stat">
        <div class="u-meta u-sub-block" slot="single-header">
            <em class="u-label">首领</em>
            <span class="u-value">
                xx
            </span>
        </div>
        <!-- 其它meta -->
    </singlebox>
</template>

<script>
import singlebox from "@jx3box/jx3box-page/src/cms-single.vue";
export default {
    name: "single",
    props: [],
    data: function() {
        return {
            loading: false,
            post: {},
            author: {},
            stat: {},
        };
    },
    computed: {
        id: function() {
            return this.$store.state.pid;
        },
    },
    methods: {},
    filters: {},
    created: function() {
    },
    components: {
        singlebox,
    },
};
</script>

<style lang="less">
@import "../assets/css/single.less";
</style>
