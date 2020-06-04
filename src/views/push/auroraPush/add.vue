<template>
    <div class="container">
        <div style="margin-top: 20px;">
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
                            <el-input  v-model="form.title" placeholder="请输入推送标题"></el-input>
                        </el-form-item>
                        <el-form-item label="推送内容" prop="content">
                            <el-input  type="textarea" v-model="form.content" placeholder="请输入推送内容"></el-input>
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
                        <el-form-item label="发送目标" prop="type">
                            <el-select v-model="form.type" @change="changeType" placeholder="请选择平台来源">
                                <el-option
                                    v-for="(item, index) in phoneTypeList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.type == 1 || form.type == 2" :label="form.type == 2 ? '指定设备tag' : '指定设备别名'" prop="tags">
                            <el-tag
                                :key="tag"
                                v-for="tag in form.tags"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </el-form-item>
                        <el-form-item label="苹果类名" prop="iosClassName">
                            <el-input 
                                placeholder="请输入苹果类名"
                                v-model="form.iosClassName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="安卓类名" prop="androidClassName">
                            <el-input 
                                placeholder="请输入安卓类名"
                                v-model="form.androidClassName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="苹果参数内容" prop="iosParams">
                            <el-input 
                                type="textarea"
                                placeholder="请输入苹果参数内容"
                                v-model="form.iosParams">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="安卓参数内容" prop="androidParams">
                            <el-input 
                                 type="textarea"
                                placeholder="请输入安卓参数内容"
                                v-model="form.androidParams">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
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
    import { addAuroraPush, getAuroraInfoById, editorAurora } from '@/api/push/aurora'
    import {mapGetters, mapMutations} from 'vuex';
    import { platformList, phoneTypeList } from '@/util/data'
    import { resolveUrlPath } from '@/util/util'

    export default {
        data() {
            return {
                baseUrl:"http://qiniu.edawtech.com/",
                form: {
                    title: '',
                    appId: '',
                    platform: '',
                    type: '',
                    content: '',
                    tags: [],
                    iosClassName: '',
                    androidClassName: '',
                    iosParams: '',
                    androidParams: ''
                },
                currentAppList: [],
                fileList: [],
                platformList: platformList,
                phoneTypeList: phoneTypeList,
                rules: {
                    title: [{required: true, message: '请输入推送标题'}],
                    content: [{required: true, message: '请输入推送内容'}],
                    appId: [{required: true, message: '请选择应用名称'}],
                    platform: [{required: true, message: '请选择平台来源'}],
                    type: [{required: true, message: '请选择发送目标'}],
                    tags: [{required: true, message: '请选择发送目标'}],
                    iosClassName: [{required: true, message: '请输入苹果类名'}],
                    androidClassName: [{required: true, message: '请输入安卓类名'}],
                    iosParams: [{required: true, message: '请输入苹果参数内容'}],
                    androidParams: [{required: true, message: '请输入安卓参数内容'}],
                },
                type: '',
                id: '',
                loading: false,
                inputVisible: false,
                inputValue: ''
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
                let postData = this._filterForm(this.form);
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        this.loading = true;
                        const res = await addAuroraPush(postData);
                        this.loading = false;
                        this.$notify({
                            title: res.data.data ? '成功' : '失败',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
                        });
                        if(res.data.data){
                            this.$router.push({
                                path: resolveUrlPath("/push/auroraPush"),
                            })
                        }
                    }
                });
            },
            async handleEditor(){
                let postData = this._filterForm(this.form);
                postData.id = this.id;
                this.loading = true;
                const res = await editorAurora(postData);
                this.loading = false;
                this.$notify({
                    title: res.data.data ? '成功' : '失败',
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 3000
                });
                if(res.data.data){
                    this.$router.push({
                        path: resolveUrlPath("/push/auroraPush"),
                    })
                }
            },
            async _getPushInfo(id) {
                const res = await getAuroraInfoById(id);
                this.form = res.data;
                if(res.data.alias){
                    this.form.tags = res.data.alias.split(',');
                }else if(res.data.tags){
                    this.form.tags = res.data.tags.split(',');
                }
            },
            handleClose(tag) {
                this.form.tags.splice(this.form.tags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                this.form.tags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            changeType(){
                this.form.tags = [];
            },
            _filterForm(form){
                let postData = {
                    title: this.form.title,
                    appId: this.form.appId,
                    type: this.form.type,
                    platform: this.form.platform,
                    content: this.form.content,
                    iosClassName: this.form.iosClassName,
                    androidClassName: this.form.androidClassName,
                    iosParams: this.form.iosParams,
                    androidParams: this.form.androidParams,
                    tags: '',
                    alias: ''
                }
                if(form.type == 2){
                    postData.tags = this.form.tags.join(',');
                }else if(form.type == 1) {
                    postData.alias = this.form.tags.join(',');
                }
                return postData;
            }
        }
    }
</script>
<style lang="scss">
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
