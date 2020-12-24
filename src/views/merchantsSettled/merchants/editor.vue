<template>
    <div class="container">
        <el-tabs type="border-card">
            <el-tab-pane label="基本信息">                    
                <el-form label-width="110px" ref="form" :rules="rules"  :model="storeInfo">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="店铺类型">
                                <div class="block">
                                    <el-cascader :options="categoryList"   v-model="currCategory" @change="handleChange"></el-cascader>
                                </div>
                            </el-form-item>
                            <el-form-item label="店铺名称" prop="storeName">
                                <el-input v-model="storeInfo.storeName"></el-input>
                            </el-form-item>
                            <el-form-item label="所属用户" prop="linkUsername">
                                <el-select
                                 v-model="storeInfo.linkUsername"
                                 placeholder="请输入关键字选择所属用户名"
                                 filterable
                                 remote
                                 :remote-method="remoteMethod"
                                 :loading="loading"
                                 :no-data-text='noDataText'>
                                    <el-option
                                    v-for="item in linkUsername"
                                    :key="item.value"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="店铺图标" prop="icon">
                                <el-upload class="upload-demo" :limit="1" action="/shop/web/store/upload" :on-success="uploadSuccess"
                                        :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="店主名" prop="storeKeeper">
                                <el-input v-model="storeInfo.storeKeeper"></el-input>
                            </el-form-item>
                            <el-form-item label="店主号码" prop="telephone">
                                <el-input type="number" v-model="storeInfo.telephone"></el-input>
                            </el-form-item>
                            <el-form-item label="店铺号码" prop="storePhone">
                                <el-input type="number" v-model="storeInfo.storePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="店铺qq" prop="storeQq">
                                <el-input type="number" v-model="storeInfo.storeQq"></el-input>
                            </el-form-item>
                            <el-form-item label="店铺微信" prop="storeWechat">
                                <el-input v-model="storeInfo.storeWechat"></el-input>
                            </el-form-item>
                            <el-form-item label="宣传语" prop="propaganda">
                                <el-input v-model="storeInfo.propaganda"></el-input>
                            </el-form-item>
                            <el-form-item label="人均消费" prop="averageConsumption">
                                <el-input type="number" v-model="storeInfo.averageConsumption"></el-input>
                            </el-form-item>
                            <el-form-item label="排序" prop="sort">
                                <el-input  type="number" v-model="storeInfo.sort"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="9">
                            <!-- <el-form-item label="营业时间">
                                <el-time-picker
                                    v-model="storeInfo.serviceStartTime"
                                    value-format="HH:mm"
                                    :picker-options="{
                                        format: 'HH:mm'
                                    }"
                                    placeholder="开店时间"
                                    @change="getStartTime">
                                </el-time-picker>
                                <el-time-picker
                                    v-model="storeInfo.serviceEndTime"
                                    value-format="HH:mm"
                                    :picker-options="{
                                        format: 'HH:mm'
                                    }"
                                    placeholder="关店时间"
                                    @change="getEndTime">
                                </el-time-picker>
                            </el-form-item> -->
                            <el-form-item label="关键词" prop="keywords">
                                <el-input v-model="storeInfo.keywords"></el-input>
                            </el-form-item>
                            <el-form-item label="营业时间" prop="serviceTime">
                                <el-input v-model="storeInfo.serviceTime"></el-input>
                            </el-form-item>
                            <el-form-item label="选择所在城市" prop='cityArr'>
                                <el-cascader
                                    v-model = "storeInfo.cityArr"
                                    expand-trigger="hover"
                                    :options="options"
                                    @change="changeCity"
                                >
                            </el-cascader>
                            </el-form-item>
                            <el-form-item label="选择地址">
                                <getMapPoint @transferMapInfo="getMapInfo" :mapCenter='defaultCenter'></getMapPoint>
                            </el-form-item>
                            <el-form-item label="经度" class="x" prop="longitude">
                                <el-input v-model="storeInfo.longitude"></el-input>
                            </el-form-item>
                            <el-form-item label="纬度" class="y" prop="latitude">
                                <el-input v-model="storeInfo.latitude"></el-input>
                            </el-form-item>
                            <el-form-item label="地址" class="map-address" prop="storeAddress">
                                <el-input v-model="storeInfo.storeAddress"></el-input>
                            </el-form-item>
                            <el-form-item v-if="!isShowAdd">
                                <el-button  type="primary"  @click="editor('form')">修改</el-button>
                            </el-form-item>
                            <el-form-item v-if="isShowAdd">
                                <el-button  type="primary"  @click="fetchAddStore('form')">添加</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>   
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="店铺风采">
                <QUE :text="this.storeInfo.description" :editorId="editorId03" @editorChange="editorDescription"></QUE>
                 <el-row class="submit-good-desc">
                    <el-button size="small" type="primary" @click="submitDesc">确定</el-button>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="店铺安全档案">
                <QUE :text="this.storeInfo.description" :editorId="editorId03" @editorChange="editorDescription"></QUE>
                 <el-row class="submit-good-desc">
                    <el-button size="small" type="primary" @click="submitDesc">确定</el-button>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import {fetchStoreInfoById, editorStoreInfo, fetchCity, editorStoreDesc, addStore, findUserLikeUsername} from "@/api/merchants/merchants";
    import { fetchCas } from "@/api/product/category";
    import QUE from "@/components/quill.vue";             //文本编辑器组件
    import getMapPoint from '@/components/getMapPoint';  //地图组件
    import AMap from 'vue-amap'
    import { mapGetters } from 'vuex'
    Vue.use(AMap)
    // 初始化vue-amap
    AMap.initAMapApiLoader({
        // 申请的高德key
        key: 'a090dc8ce8841d6c8870e8515decf762',
        // 插件集合
        plugin: ['Geocoder']
    })
    export default {
        data(){
            return {
                id: '',
                storeInfo: {
                    cityArr: []
                },
                fileList: [],
                baseUrl:"http://qiniu.edawtech.com/",
                options: [],
                // cityArr: [],
                provinceCity: [],
                editorId03: 3,
                storeDetail: '',
                isShowAdd: false,
                categoryList: [],
                currCategory: [],
                tempArr: [],   
                // 所属用户下拉框
                userList:[],        //下拉框数据列表
                linkUsername: [],   //选中的值
                loading: false,
                noDataText: '',
                defaultCenter: [114.084429, 22.538261],   //选择的地址
                rules: {
                    type: [
                       {type:'array', required: true, message: '请选择店铺类型', trigger: 'change' }
                    ],
                    storeName: [
                        { required: true, message: '请输入店铺名称', trigger: 'blur' }
                    ],
                    linkUsername: [
                        { required: true, message: '请输入所属用户名', trigger: 'blur' }
                    ],
                    icon: [
                        { required: true, message: '请上传图标', trigger: 'blur' }
                    ],
                    storeKeeper: [
                        { required: true, message: '请输入店主名称', trigger: 'blur' }
                    ],
                    telephone: [
                        { required: true, message: '请输入店主号码', trigger: 'blur' }
                    ],
                    storePhone: [
                        { required: true, message: '请输入店铺号码', trigger: 'blur' }
                    ],
                    storeQq: [
                        { required: true, message: '请输入店铺QQ', trigger: 'blur' }
                    ],
                    storeWechat: [
                        { required: true, message: '请输入店铺微信', trigger: 'blur' }
                    ],
                    propaganda: [
                        { required: true, message: '请输入宣传语', trigger: 'blur' }
                    ],
                    averageConsumption: [
                        { required: true, message: '请输入人均消费', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入顺序', trigger: 'blur' }
                    ],
                    keywords: [
                        { required: true, message: '请输入关键词', trigger: 'blur' }
                    ],
                    serviceTime: [
                        { required: true, message: '请输入营业时间', trigger: 'blur' }
                    ],
                    cityArr: [
                        { required: true, message: '请选择所在城市', trigger: 'blur',type:'array' }
                    ],
                    longitude: [
                        { required: true, message: '请输入经度', trigger: 'blur' }
                    ],
                    latitude: [
                        { required: true, message: '请输入纬度', trigger: 'blur' }
                    ],
                    storeAddress: [
                        { required: true, message: '请输入店铺地址', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
        },
        components: {
            getMapPoint,
            QUE
        },
        created() {
        },
        mounted() {
            this.linkUsername = [];            
        },
        methods: {
            // 输入值时触发请求下拉框所属用户数据
            remoteMethod(query) {     
                if (query !== '' && query !== undefined) {
                    this.loading = true;
                    if(query.length < 3){
                        this.loading = false;
                        this.linkUsername = [];
                        this.linkUsername.push({
                            value:query
                        })
                    }else{
                        var params = {username:query}
                        setTimeout(() => {
                            findUserLikeUsername(params).then((resp)=>{
                                this.loading = false;
                                this.userList = resp.data;
                                console.log(resp)
                                if(resp.data == ''){
                                    this.linkUsername = '';
                                    this.noDataText = '没有该用户,请重新核对'
                                }else{
                                    this.linkUsername = this.userList.map(item =>{
                                        // 给数据添加一个key为value,方便下拉框渲染
                                        return {value:item}
                                    })
                                }
                            })
                        }, 300);
                    }
                }
            },
            getCategory(categoryId) {
                fetchCas(null).then(response => {
                    console.log(response, "商品分类");
                    this.categoryList = response.data;
                    this.currCategory.push(categoryId);
                    this.childrenEach(this.categoryList, 0);
                    this.handleChange(this.currCategory)
                });
            },
            childrenEach(childrenData, depthN) {
                let depth = 0;
                for (var j = 0; j < childrenData.length; j++) {
                    depth = depthN; // 将执行的层级赋值 到 全局层级

                    this.tempArr[depthN] = childrenData[j].value;

                    if (childrenData[j].value == this.currCategory) {
                    this.currCategory = this.tempArr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
                    break;
                    } else {
                    if (childrenData[j].hasOwnProperty("children")) {
                        depth++;
                        this.childrenEach(childrenData[j].children, depth);
                    }
                    }
                }
            },
            handleChange(value) {
                this.storeInfo.categoryId = value[value.length - 1];
            },
            getStoreInfo(id){
                fetchStoreInfoById(id).then(res => {
                    console.log(res, '店铺基本信息');
                    //res.data.averageConsumption/10000;
                    this.storeInfo = res.data;
                    console.log(this.storeInfo,'基本信息')
                    this.defaultCenter = [this.storeInfo.longitude,this.storeInfo.latitude];
                    this.storeInfo.averageConsumption = this.storeInfo.averageConsumption/10000
                    this.getCityId();
                    this.getCategory(res.data.categoryId);
                    this.fileList = [];
                    this.fileList.push({name:res.data.iconUrl.indexOf('http')==0 ? res.data.iconUrl : this.baseUrl+res.data.iconUrl,
                        url:res.data.iconUrl.indexOf('http')==0 ? res.data.iconUrl : this.baseUrl+res.data.iconUrl});
                });
            },
            getStartTime(value){
                this.storeInfo.serviceStartTime = value;
            },
            getEndTime(value){
                this.storeInfo.serviceEndTime = value;
            },
            uploadSuccess(res, file) {
                console.log(res,'上传成功');
                this.storeInfo.iconUrl = res.imagePath;
                this.fileList.push({name: this.baseUrl + res.imagePath,
                        url:this.baseUrl + res.imagePath});
            },
            handleRemove(file,fileList){
                this.storeInfo.iconUrl = '';
                this.fileList = [];
            },
            getMapInfo(msg) {
                console.log(msg,'ddd');
                this.storeInfo.longitude = msg[0];
                this.storeInfo.latitude = msg[1];
                this.storeInfo.storeAddress = msg[2];
                this.storeInfo = Object.assign({},this.storeInfo);
                this.defaultCenter = [this.storeInfo.longitude,this.storeInfo.latitude];
            },
            // 编辑信息
            editor(){
                let postData = {
                    appId: 'dudu',
                    categoryId: this.storeInfo.categoryId,
                    storeName: this.storeInfo.storeName,
                    iconUrl: this.storeInfo.iconUrl,
                    storeKeeper: this.storeInfo.storeKeeper,
                    telephone: this.storeInfo.telephone,
                    storePhone: this.storeInfo.storePhone,
                    storeQq: this.storeInfo.storeQq,
                    storeWechat: this.storeInfo.storeWechat,
                    storeAddress: this.storeInfo.storeAddress,
                    serviceTime: this.storeInfo.serviceTime,
                    
                    // serviceStartTime: this.storeInfo.serviceStartTime,
                    // serviceEndTime: this.storeInfo.serviceEndTime,
                    longitude: this.storeInfo.longitude,
                    latitude: this.storeInfo.latitude,
                    propaganda: this.storeInfo.propaganda,
                    averageConsumption: this.storeInfo.averageConsumption,
                    sort: this.storeInfo.sort,
                    keywords: this.storeInfo.keywords,
                    id: this.storeInfo.id,
                    cityId: this.storeInfo.cityId,
                    // 点击编辑带上linkusername
                    linkUsername: this.storeInfo.linkUsername
                }
                console.log(this.storeInfo,'linkUsername')
                console.log(postData,'修改基本信息参数');
                editorStoreInfo(postData).then(res => {
                    console.log(res, '编辑门店基本信息');
                    this.$notify({
                        title: res.statusText,
                        message: res.data.msg,
                        type: "success",
                        duration: 2000
                    });
                });
            },
            getCityId(){
                fetchCity().then(res => {
                    console.log(res, '省市');
                    this.provinceCity = res.data;
                    // 处理省市城市的数据
                    this.filterCityArr(this.storeInfo.cityId);
                    // 遍历省市城市的数据，定义一个空数组
                    res.data.forEach((item, index) => {
                        let templArr = [];
                        /**
                         * 如果有子级城市，遍历子级城市，将子级城市的id和name放入新数组中
                         * 将父级的id和name放入options数组中，以及子级城市的数组放入options的childre属性中
                         * 如果没有子级，就直接将id和name放入options数组中
                         * 渲染的数据属性需要value和label
                         */
                        if(typeof item.cities !== 'undefined'){
                            item.cities.forEach((item, index) => {
                                templArr.push({
                                    value: item.id,
                                    label: item.cityName
                                });
                            });
                            this.options.push({
                                value: item.id,
                                label: item.provinceName,
                                children: templArr
                            });
                        }else {
                            this.options.push({
                                value: item.id,
                                label: item.provinceName,
                            });
                        }
                    });
                });
            },
            changeCity(valueArr){
                console.log(valueArr)
                this.storeInfo.cityId = valueArr[1]
            },
            filterCityArr(cityId) {
                // 遍历省市城市
                this.provinceCity.forEach((item, index) => {
                    // 如果有cities子级城市
                    if(item.cities.length != 0){
                        // 遍历子级城市,如果子级城市的id等于cityid就将对应的id放到数组中
                        item.cities.forEach((item02, index02) => {
                            if(item02.id === Number(cityId)){
                                this.storeInfo.cityArr = [];
                                this.storeInfo.cityArr[0] = item.id;
                                this.storeInfo.cityArr[1] = item02.id;
                            }
                        });
                    }
                });
            },
            editorDescription(html){
                this.storeInfo.description = html;
            },
            submitDesc(){
                let postData = {
                    storeNo: this.storeInfo.storeNo,
                    description: this.storeInfo.description
                }
                editorStoreDesc(postData).then(res => {
                    console.log(res,'修改店铺描述');
                    if(res.data.code == 0){
                        this.$notify({
                           title: res.statusText,
                           message: res.data.msg,
                           type: "success",
                           duration: 2000
                       });
                    }else {
                        this.$notify({
                           title: res.statusText,
                           message: res.data.msg,
                           type: "error",
                           duration: 2000
                       });
                    }
                });
            },
            // 点击添加
            fetchAddStore(formName){
                let postData = {
                    appId: 'dudu',
                    categoryId: this.storeInfo.categoryId,
                    storeName: this.storeInfo.storeName,
                    iconUrl: this.storeInfo.iconUrl,
                    storeKeeper: this.storeInfo.storeKeeper,
                    telephone: this.storeInfo.telephone,
                    storePhone: this.storeInfo.storePhone,
                    storeQq: this.storeInfo.storeQq,
                    storeWechat: this.storeInfo.storeWechat,
                    storeAddress: this.storeInfo.storeAddress,
                    serviceTime: this.storeInfo.serviceTime,
                    longitude: this.storeInfo.longitude,
                    latitude: this.storeInfo.latitude,
                    propaganda: this.storeInfo.propaganda,
                    averageConsumption: this.storeInfo.averageConsumption,
                    sort: this.storeInfo.sort,
                    keywords: this.storeInfo.keywords,
                    cityId: this.storeInfo.cityId,
                    // 点击添加时带上linkusername
                    linkUsername: this.storeInfo.linkUsername
                }
                addStore(postData).then(res => {
                    console.log(res, '添加门店基本信息');
                    if(res.status == 200){
                        this.$notify({
                            title: res.statusText,
                            message: res.data.msg,
                            type: "success",
                            duration: 2000
                        });
                        this.storeInfo.id = JSON.parse(res.data.msg).storeId;
                        this.storeInfo.storeNo = JSON.parse(res.data.msg).storeNo;
                        this.isShowAdd = false;
                    }
                });
                // this.$refs[formName].validate((valid) => {
                //     if(valid){
                //     }
                // });
            },
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(typeof to.query.type != 'undefined'){
                    fetchCas(null).then(response => {
                        console.log(response, "商品分类");
                        vm.categoryList = response.data;
                    });
                    vm.getCityId();
                    vm.isShowAdd = true
                }else {
                    vm.id = to.query.id
                    vm.getStoreInfo(vm.id);
                }
            });
        },
    }
</script>
<style>
    .el-date-editor.el-input{
        width: 220px!important;
    }
</style>

