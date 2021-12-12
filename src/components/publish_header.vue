<template>
    <div class="m-publish-header">
        <el-page-header @back="goBack" :content="name"></el-page-header>
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: "publish_header",
    props: ["name"],
    data: function() {
        return {
        };
    },
    computed: {},
    methods: {
        goBack: function() {
            this.$router.go(-1);
        },
    },
    mounted: function() {},
    components: {},
};
</script>
