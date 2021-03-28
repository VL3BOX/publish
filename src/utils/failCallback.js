function failCallback(err,vm){
    if(vm){
        if(vm.processing != undefined){
            vm.processing = false
        }

        if (err.response && err.response.data && err.response.data.code) {
            vm.$message.error(
                `[${err.response.data.code}] ${err.response.data.msg}`
            );
        } else {
            vm.$message.error("网络请求异常");
        }
    }
    console.log(err)
}

export default failCallback