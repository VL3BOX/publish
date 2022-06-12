import { atAuthors } from "@/service/pay.js";
import User from "@jx3box/jx3box-common/js/user";

export const atAuthorMixin = {
    computed: {
        userInfo() {
            return User.getInfo();
        }
    },
    methods: {
        // at其他用户
        atUser: async function (){
            try {
                let atAuthor = sessionStorage.getItem('atAuthor');
                if (atAuthor) {
                    await atAuthors({ sendUserId: this.userInfo.uid, accessUserId: atAuthor, postId: this.id, postType: this.post.post_type });
                    sessionStorage.removeItem('atAuthor');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
