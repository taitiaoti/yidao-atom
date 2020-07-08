<template>
    <div class="container">
        <div style="margin-top: 20px; position: relative;">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="应用名称" prop="appId">
                            <el-select v-model="form.appId" placeholder="请选择应用名称">
                                <el-option
                                    v-for="(item, index) in currentAppList"
                                    :key="index"
                                    :label="item.appName"
                                    :value="item.appId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="推送标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入推送标题"></el-input>
                        </el-form-item>
                        <el-form-item label="推送图片" prop="file">
                            <el-upload class="upload-demo" :limit="1" action="/shop/web/homePagePush/uploadImg" :on-success="uploadSuccess"
                                :file-list="fileList" list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，尺寸大小为534x504</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="平台来源" prop="platform">
                            <el-select v-model="form.platform" placeholder="请选择平台来源">
                                <el-option
                                    v-for="(item, index) in platformList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="推送次数" prop="pushNum">
                            <el-input type="number" v-model="form.pushNum" placeholder="请输入推送次数"></el-input>
                        </el-form-item>
                        <el-form-item label="最小苹果版本号" prop="minIosVersion">
                            <el-input v-model="form.minIosVersion" placeholder="请输入最小苹果版本号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="最小安卓版本号" prop="minAndroidVersion">
                            <el-input v-model="form.minAndroidVersion" placeholder="请输入最小安卓版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="最大苹果版本号" prop="maxIosVersion">
                            <el-input v-model="form.maxIosVersion" placeholder="请输入最大苹果版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="最大安卓版本号" prop="maxAndroidVersion">
                            <el-input v-model="form.maxAndroidVersion" placeholder="请输入最大安卓版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="苹果类名" prop="iosClassName">
                            <el-input v-model="form.iosClassName" placeholder="请输入苹果类名"></el-input>
                        </el-form-item>
                        <el-form-item label="安卓类名" prop="androidClassName">
                            <el-input v-model="form.androidClassName" placeholder="请输入安卓类名"></el-input>
                        </el-form-item>
                        <el-form-item label="小程序类名" prop="androidClassName">
                            <el-input v-model="form.weChatClassName" placeholder="请输入小程序类名"></el-input>
                        </el-form-item>
                         <el-form-item label="苹果参数内容" prop="iosParams">
                            <el-input type="textarea" v-model="form.iosParams" placeholder="请输入苹果参数内容"></el-input>
                        </el-form-item>
                        <el-form-item label="安卓参数内容" prop="androidParams">
                            <el-input type="textarea" v-model="form.androidParams" placeholder="请输入安卓参数内容"></el-input>
                        </el-form-item>
                        <el-form-item label="小程序参数内容" prop="androidParams">
                            <el-input type="textarea" v-model="form.weChatParams" placeholder="请输入小程序参数内容"></el-input>
                        </el-form-item>
                        <el-form-item style="position: absolute;right: 100px;bottom: 0;">
                            <el-button type="primary" :loading="loading" v-if="type == 'add'" @click="handleSubmit('form')">确 定</el-button>
                            <el-button type="primary" :loading="loading" v-else @click="handleEditor('form')">修 改</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { addPush, getPushInfoById, editor } from '@/api/push/homePage'
    import {mapGetters, mapMutations} from 'vuex';
    import { platformList } from '@/util/data'
    import { resolveUrlPath } from '@/util/util'

    export default {
        data() {
            return {
                baseUrl:"http://qiniu.edawtech.com/",
                form: {
                    title: '',
                    imageUrl: '',
                    appId: '',
                    platform: '',
                    pushNum: '',
                    minIosVersion: '',
                    minAndroidVersion: '',
                    maxIosVersion: '',
                    maxAndroidVersion: '',
                    iosClassName: '',
                    androidClassName: '',
                    iosParams: '',
                    androidParams: '',
                    weChatClassName: '',
                    weChatClassName: '',
                },
                currentAppList: [],
                fileList: [],
                platformList: platformList,
                rules: {
                    title: [{required: true, message: '请输入推送标题'}],
                    imageUrl: [{required: true, message: '请选择图片地址'}],
                    appId: [{required: true, message: '请选中应用名称'}],
                    platform: [{required: true, message: '请选择平台来源'}],
                    pushNum: [{required: true, message: '请输入推送次数'}],
                    minIosVersion: [{required: true, message: '请输入最小苹果版本号'}],
                    minAndroidVersion: [{required: true, message: '请输入最小安卓版本号'}],
                    maxIosVersion: [{required: true, message: '请输入最大苹果版本号'}],
                    maxAndroidVersion: [{required: true, message: '请输入最大安卓版本号'}],
                    iosClassName: [{required: true, message: '请输入苹果类名'}],
                    androidClassName: [{required: true, message: '请输入安卓类名'}],
                    iosParams: [{required: true, message: '请输入苹果参数内容'}],
                    androidParams: [{required: true, message: '请输入安卓参数内容'}]
                },
                type: '',
                id: '',
                loading: false
            }
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.id = this.$route.query.id;
            this.type = this.$route.query.type;
            if(this.id){
                this._getPushInfo(this.id);
            }
        },
        methods: {
            uploadSuccess(res, file) {
                this.form.imageUrl = res.imagePath;
            },
            async handleSubmit(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        this.loading = true;
                        const res = await addPush(this.form);
                        this.loading = false;
                        this.$notify({
                            title: res.data.data ? '成功' : '失败',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
                        });
                        if(res.data.data){
                            this.$router.push({
                                path: resolveUrlPath("/push/homePagePush"),
                            })
                        }
                    }
                });
            },
            async handleEditor(){
                this.form.id = this.id;
                this.loading = true;
                const res = await editor(this.form);
                this.loading = false;
                this.$notify({
                    title: res.data.data ? '成功' : '失败',
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 3000
                });
                if(res.data.data){
                    this.$router.push({
                        path: resolveUrlPath("/push/homePagePush"),
                    })
                }
            },
            async _getPushInfo(id) {
                const res = await getPushInfoById(id);
                this.form = res.data;
                this.fileList.push({name:this.form.imageUrl.indexOf('http')==0 ? this.form.imageUrl : this.baseUrl+this.form.imageUrl, 
                url:this.form.imageUrl.indexOf('http')==0 ? this.form.imageUrl : this.baseUrl+this.form.imageUrl});
            }
        }
    }
</script>
<style lang="scss">
    
</style>
