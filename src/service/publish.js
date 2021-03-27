import { $_server } from "./axios";

// 发布
function doPublish(data, vm, skip = true) {
    return $_server.post(`/post/publish`, data)
        .then((res) => {
            if (skip) {
                vm.$message({
                    message: res.data.msg,
                    type: "success",
                });

                setTimeout(() => {
                    location.href =
                        "/" + data.post.post_type + "/" + res.data.data.ID;
                }, 500);
            }

            return res;
        })
}

// 草稿
function doDraft(data, vm, skip = true) {
    return $_server.post(`/post/publish`, data)
        .then((res) => {
            if (skip) {
                vm.$message({
                    message: res.data.msg,
                    type: "success",
                });

                setTimeout(() => {
                    location.href =
                        "/" + data.post.post_type + "/" + res.data.data.ID;
                }, 500);
            }

            // if(!this.$route.params.id){
            //     vm.$router.push({ params: { id: res.data.data.ID }})

            //     vm.$notify({
            //         title: "保存成功",
            //         message: '作品保存成功，请前往我的作品查看',
            //         type: "success",
            //     });
            // }

            return res;
        })
}

// 编辑加载
function doLoad(vm, oldMetaKeys) {
    let id = vm.$route.params.id;

    if (id) {
        return $_server.get(`/post/query`, {
            params: {
                id: id,
            },
        })
            .then((res) => {
                // 远程数据
                let post = res.data.data.post;
                post.original = !!post.original //是否原创
                let meta = res.data.data.meta;

                if (!post.post_meta) post.post_meta = vm.post.post_meta; //旧异常数据处理

                // 加载到store
                vm.$store.commit("loadPost", post);
                vm.$store.commit("editMeta", meta);

                // 本地覆盖
                vm.$set(vm, "post", post);
                vm.$set(vm, "meta", meta);

                vm.loaded = true;
                vm.$forceUpdate();

                return res.data.data;

                // 废弃·需要处理的旧meta
                // let meta = res.data.data.meta;
                // if (oldMetaKeys && oldMetaKeys.length) {
                //     for (let key of oldMetaKeys) {
                //         if (meta[key].indexOf(",")) {
                //             meta[key] = meta[key].split(",");
                //         } else {
                //             meta[key] = meta[key];
                //         }
                //     }
                //     vm.meta = meta;
                // }
                // vm.$store.state.meta = res.data.data.meta;
            })
    } else {
        return new Promise((resolve, reject) => {
            // 将默认结构添加到$store
            vm.$store.commit("loadPost", vm.post);
            vm.$store.commit("editMeta", vm.meta);

            vm.loaded = true;
            vm.$forceUpdate();

            vm.loaded = true;
            resolve({
                post: vm.post,
                meta: vm.meta,
            });
        });
    }
}

export { doPublish, doDraft, doLoad };
