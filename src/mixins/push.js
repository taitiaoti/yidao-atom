export const auroraPush = {
    methods: {
        handleDelete({id}){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                if(id){
                    console.log(delAurora, '123123');
                    const res = await delAurora(id);
                    this.$notify({
                        title: res.data.data ? '成功' : '失败',
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 3000
                    });
                    this.getList();
                }else {
                    this.$notify({
                        title: '失败',
                        message: 'id丢失，请联系开发人员！',
                        type: 'error',
                        duration: 6000
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
    }
}