import {$cms} from '@jx3box/jx3box-common/js/https'

function getUnionPosts(params){
    return $cms().get(`/api/cms/posts/user/my/union`,{
        params
    })
}

export {getUnionPosts}