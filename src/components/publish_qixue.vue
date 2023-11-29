<template>
    <div class="m-publish-qixue">
        <div class="m-talent-box qx-container"></div>
    </div>
</template>

<script>
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";
import $ from "jquery";

import { getBreadCrumb } from "@/service/cms";
export default {
    name: "publish_qixue",
    props: {
        subtype: {
            type: String,
            default: "通用",
        },
        editable: {
            type: Boolean,
            default: true,
        },
        value: {
            type: String,
            default: "",
        },
    },
    model: {
        prop: "value",
        event: "update",
    },
    data() {
        return {
            driver: null,
            version: "",
            sq: "1,1,1,1,1,1,1,1,1,1,1,1",
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
                try {
                    let __data = JSON.parse(val);
                    this.version = __data.version;
                    this.sq = __data.sq;
                    this.reloadTalent();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        subtype: {
            immediate: true,
            handler(val) {
                this.reloadTalent();
            }
        },
    },
    mounted() {
        this.installTalent();
    },
    methods: {
        installTalent() {
            getBreadCrumb("pvp_talent_version").then(res => {
                this.version = this.version || res.data?.data?.html;

                this.driver = new JX3_QIXUE({ version: this.version, editable: this.editable });

                this.reloadTalent();

                const vm = this;
                $(document).on("JX3_QIXUE_Change", function (e, ins){
                    let __data = {};
                    __data.version = ins.version;
                    __data.xf = ins.xf;
                    __data.sq = ins.sq.join(",");

                    vm.$emit("update", JSON.stringify(__data));
                })
            })
        },
        reloadTalent() {
            if (!this.subtype || this.subtype == "通用") return;
            this.$nextTick(() => {
                if (!this.driver) return;
                this.driver?.then((talent) => {
                    talent.load({
                        xf: this.subtype,
                        sq: this.sq,
                    });
                });
            });
        }
    }
}
</script>
