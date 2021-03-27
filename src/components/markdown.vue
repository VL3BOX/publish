<template>
    <div class="c-editor-markdown">
        {{content}}
    </div>
</template>

<script>
export default {
    name : 'markdown',
    props:['content'],
    data : function(){
        return {
            data : this.content
        }
    },
    watch: {
        data(val) {
            this.$store.commit('editContent',val)
        },
    },
    computed:{},
    methods:{},
    mounted:function(){},
    components : {
    }
}
</script>