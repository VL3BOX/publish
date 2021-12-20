export const cmsMetaMixin = {
    created: function() {
        this.post.client = this.$store.state.client;
    },
    
    
}