<template>
    <div class="m-publish-equip">
        <el-input v-model="schema.id" placeholder="配装方案编号">
            <template slot="prepend">
                <el-select v-model="schema.type" placeholder="请选择">
                    <el-option v-for="(label,val) in types" :key="val" :label="label" :value="val"></el-option>
                </el-select>
            </template>
        </el-input>
    </div>
</template>

<script>
export default {
    name: "",
    props: ["id", "type"],
    data: function () {
        return {
            types: {
                jx3box: "魔盒清单",
                // tuilan: "推栏",
                // j3pz: "胖叔配装器",
            },
            schema: {
                type: this.type,
                id: this.id,
            },
        };
    },
    watch: {
        id: function (newval) {
            this.schema.id = newval;
        },
        type: function (newval) {
            this.schema.type = newval;
        },
        schema: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

