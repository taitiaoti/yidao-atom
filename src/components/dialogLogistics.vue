<template>
    <div class="app-container calendar-list-container">
        <el-dialog title="物流信息" :visible.sync="isShow" :before-close="closeDialog">
            <div style="height: 500px;position:relative;overflow:auto;">
                <div class="order-process" stlye="position:absolute;top: 0;left:0;">
                    <el-steps direction="vertical" :active="1" :finish-status="finishStatus">
                        <el-step v-for="(item,index) in expressInfo" :key="index" :title="item.AcceptStation" 
                            :description="item.AcceptTime" ></el-step>
                    </el-steps>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="closeDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { logisticsInfo } from '@/api/order/index'
    import { formartTime, resolveUrlPath } from "@/util/util"

    export default {
        props: ['isShow'],
        data(){
            return {
                formLabelWidth: '120px',
                // isShow02: this.isShow,
                expressInfo: [],
                finishStatus: 'success'
            }
        },
        created(){
            
        },
        filters: {
           
        },
        methods: {
            closeDialog(){
                // this.isShow02 = false;
                this.$emit('transferDialogState');
            },
            getExpressInfo(expressId){
                console.log(expressId,'触发获取物流信息请求')
                // console.log(this.isShow02,'isshow')
                this.expressInfo = [];
                logisticsInfo(expressId).then( res => {
                    console.log( res, '物流信息');
                    try{
                        if(typeof JSON.parse(res.data.msg) == 'object' && JSON.parse(res.data.msg).length > 0){
                            this.finishStatus = 'success';
                            this.expressInfo = JSON.parse(res.data.msg).reverse();
                        }
                    }catch(e){
                        this.finishStatus = 'wait';
                        this.expressInfo = [{'AcceptStation': res.data.msg}];
                        this.$notify({
                            title: res.statusText,
                            message: res.data.msg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                });
            }
        },
    }
</script>
<style>

</style>

