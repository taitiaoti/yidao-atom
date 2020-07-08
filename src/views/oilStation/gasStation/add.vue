<template>
    <div class="container">
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card" v-model="activeName" :before-leave="beforeLeave">
              <el-tab-pane label="基本信息" name="info">
                  <span slot="label"><i class="icon-shangpin-jibenxinxi icon-14"></i> 基本信息</span>
                  <el-form label-width="100px" ref="form" :rules="rules" :model="formData">
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <el-form-item label="油 站 名 称" prop="gasName">
                              <el-input v-model="formData.gasName" placeholder="请输入油站名称"></el-input>
                          </el-form-item>
                          <el-form-item label="油 站 品 牌" prop="gasType">
                              <el-select v-model="formData.gasType" placeholder="请选择">
                                  <el-option
                                  v-for="item in gasTypeData"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="加油站图片" prop="gasLogoSmall">
                              <el-upload
                               class="upload-demo"
                               action="/shop/web/product/uploadMain" 
                               :on-success="uploadSuccess"
                               :file-list="fileList" 
                               list-type="picture">
                                  <el-button size="small" type="primary">点击上传</el-button>
                                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，尺寸大小为534x504</div>
                              </el-upload>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="选择所在城市" prop="citysArr">
                                <el-cascader
                                  v-model="citysArr"
                                  expand-trigger="hover"
                                  :options="cityOptions"
                                  @change="changeCity"
                                  :props="props">
                            </el-cascader>
                            </el-form-item>
                            <el-form-item label="选择地址">
                                <getMapPoint @transferMapInfo="getMapInfo" :mapCenter='defaultCenter'></getMapPoint>
                            </el-form-item>
                            <el-form-item label="经度" class="x" prop="gasAddressLongitude">
                                <el-input v-model="formData.gasAddressLongitude"></el-input>
                            </el-form-item>
                            <el-form-item label="纬度" class="y" prop="gasAddressLatitude">
                                <el-input v-model="formData.gasAddressLatitude"></el-input>
                            </el-form-item>
                            <el-form-item label="地址" class="map-address" prop="gasAddress">
                                <el-input v-model="formData.gasAddress"></el-input>
                            </el-form-item>
                            <el-form-item v-if="gasId">
                                <el-button  type="primary"  @click="editor('form')">修改</el-button>
                            </el-form-item>
                            <el-form-item v-else>
                                <el-button  type="primary"  @click="fetchAddStore('form')">添加</el-button>
                            </el-form-item>
                        </el-col>
                      </el-row>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="油站详情" name="detail">
                  <span slot="label"><i class="icon-shangpin-jibenxinxi icon-14"></i> 油站详情</span>
                  <el-form label-width="140px" v-for="(item, index) in speList" :key="index">
                    <el-form-item :label=" item.speName == '枪号' ? item.speName + '（可多选）' : item.speName " class="textCenter">
                      <el-radio-group v-if="item.speName !== '枪号'" v-model="formCheck[item.speKey]" @change="checkInList">
                        <el-radio v-for="(item2,index2) in item.speValueList" :key="index2" :label="item2">{{ item2 }}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group v-model="formCheck[item.speKey]" v-else>
                        <el-checkbox v-for="(item2,index2) in item.speValueList" :key="index2" @change="checkInList" :label="item2">{{ item2 }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-form>
                  <!-- 规格展示表格 -->
                  <el-table
                    :data="tableList"
                    border
                    style="width:100%;">
                    <div v-for="(header, index) in tabLabel" :key="index">
                      <el-table-column align="center" :label="header.label">
                        <template scope="scope">
                          <el-input v-if=" header.prop == 'priceOfficial' || header.prop == 'priceGun' || header.prop == 'priceGas' " 
                            v-model="scope.row[tabLabel[index].prop]"
                            placeholder=""
                            :disabled="scope.row.isPush"></el-input>
                          <div v-else>
                            <div v-if='Array.isArray(scope.row[tabLabel[index].prop])'>
                              <span v-for="(item,index) in scope.row[tabLabel[index].prop]" :key="index">
                                <span>{{item}},</span>
                              </span>
                            </div>
                            <span v-else>
                              {{ scope.row[tabLabel[index].prop] }}
                            </span>
                          </div>
                        </template>
                      </el-table-column>
                    </div>
                    <el-table-column align="center" label="操作">
                      <template scope="scope">
                        <el-button type='primary' size="mini" @click='update(scope.row, scope.$index)' v-if="scope.row.isPush">编辑</el-button>
                        <el-button type='primary' size="mini" @click='preservation(scope.row, scope.$index)' v-else>保存</el-button>
                        <el-button type='danger' size="mini" @click='detele(scope.row, scope.$index)'>删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button v-if=" detailStatus == 'create' " type="primary" style="margin-top:20px;margin-left:140px;"  @click="addDetail('form')">确认添加</el-button>
                  <el-button v-else type="primary" style="margin-top:20px;margin-left:140px;"  @click="updateDetail('form')">确认修改</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import {citys} from "@/util/city"
import { getStore } from '@/util/store';
import { fetchCity } from "@/api/merchants/merchants";
import { addGasStation, queryOilNoBaseInfoList, querySpecificationsList,queryGasStationInfo,addGasStationBaseInfo,updateGasStation,updateGasStationBaseInfo } from "@/api/franchisee/index";
import AMap from 'vue-amap'
import getMapPoint from '@/components/getMapPoint';  //地图组件
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
      gasId: '',
      id: '',     //油站序号
      userId: '',
      operation: '',        //基本信息添加或修改
      detailStatus: '',        //详情添加或修改
      source: '1001',
      framesState: '1002',    //是否上架 1002---下架
      auditStatus: '1001',    // 1001 -- 待审核
      gasUsername: '',
      formData: {
        gasName: '',      //油站名称
        gasAddressLongitude: '',      //经度
        gasAddressLatitude: '',      //纬度
        gasAddress: '',             //详细地址
        provinceName: '',             //省
        cityName: '',             //市
        countyName: '',             //区
        gasLogoBig: '',             //图片大
        gasLogoSmall: '',           //图片小
        gasType: ''
      },
      tabArr: [
        { label: '国标价（元）', prop: 'priceOfficial' },
        { label: '枪价（元）', prop: 'priceGun' },
        { label: '优惠后金额（元）', prop: 'priceGas' }
      ],
      gasTypeData: [
        { label: '中石油', value: '1' },
        { label: '中石化', value: '2' },
        { label: '壳牌', value: '3' },
        { label: '其他', value: '4' }
      ],
      tabLabel: [],
      tableList:[],
      productProperties: [],
      speList: '',        //规格列表
      listQuery: {
        page: 1,
        limit: 30
      },
      citysArr: [],
      props: {
        value: 'label'
      },
      formCheck: {
        isPush: false,
        priceId: ''
      },
      provinceCity: '',
      cityOptions: [],
      activeName: 'info',
      defaultCenter: [114.084429, 22.538261],   //选择的地址
      baseUrl:"http://qiniu.edawtech.com/",
      // 图片
      fileList: [],
      rules:{
        gasName: [
          { required: true, message: '请输入油站名称', trigger: 'blur' }
        ],
        gasType: [
          { required: true, message: '请选择油站品牌', trigger: 'change' }
        ],
        gasLogoSmall: [
          { required: true, message: '请上传油站图片', trigger: 'change' }
        ],
        citysArr: [
          { type: 'Array', required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        gasAddressLongitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        gasAddressLatitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        gasAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    console.log(userInfo,'账号信息')
    this.userId = userInfo.userId;
    this.gasUsername = userInfo.username;
    this.getDetailInfo();
  },
  components: {
      getMapPoint
  },
  methods: {
    beforeUpload(file){
    console.log(file)
    },
    // 获取油站详情可选项
    getDetailInfo(){
      let postData = {
        ...this.listQuery,
        userId: this.userId
      }
      querySpecificationsList(postData).then((res)=>{
        console.log(res,'规格列表')
        let arr = [];
        for(let i=0; i < res.data.records.length; i++){
            this.$set(this.formCheck, res.data.records[i].speKey, []) //在已经创建的实例上动态添加新的根级响应式属性
            this.formCheck.isPush = false;
            let obj = {
              label: res.data.records[i].speName,
              prop: res.data.records[i].speKey
            }
            arr.push(obj)
        }
        this.tabLabel = arr.concat(this.tabArr)
        this.speList = res.data.records;
        console.log(this.tabLabel,'表头')
        console.log(this.formCheck)
      })
    },
    // 选择规格
    checkInList(){
      console.log(this.formCheck,'选中的规格')
      let obj = JSON.parse(JSON.stringify(this.formCheck))
      let isPush = false;
      if(this.tableList.length !== 0){
        for(var i=0; i<this.tableList.length;i++){
            
            if(!this.tableList[i].isPush){
              // 未保存
              console.log(obj,'未保存')
              for(let k in obj){
                this.tableList[i][k] = obj[k]
              }
              return;
            }else{
              isPush = true;
              console.log(obj,'保存')
            }
        }
        if(isPush){
          this.tableList.push(obj)
        }
      }else{
        this.tableList.push(obj)
      }
      console.log(this.tableList,'渲染的表格')
    },
    // 保存
    preservation(obj,index){
      console.log(index)
      this.tableList[index].isPush = true;
      this.getDetailInfo();
      console.log(this.tableList,'渲染的列表')
      console.log(this.formCheck,'绑定的数据')
    },
    //编辑
    update(obj,index){
      this.tableList.forEach((res)=>{
        res.isPush = true
      })
      this.tableList[index].isPush = false;
      this.formCheck = JSON.parse(JSON.stringify(obj));
      this.checkInList()
    },
    // 删除
    detele(obj,index){
      this.tableList.splice(index,1);
      this.getDetailInfo();
    },
    // 添加油站详情
    addDetail(){
      let arr = JSON.parse(JSON.stringify(this.tableList));
      arr.forEach((item)=>{
        console.log(item)
        if(item.oilType){
          let text;
          switch(item.oilType) {
            case '汽油':
              text = '1';
              break;
            case '柴油':
              text = '2';
              break;
            case '天然气':
              text = '3';
              break;
            return text;
          }
          item.oilType = text;
        }
        if(item.oilNo){
          item.oilNo = item.oilNo.replace("#",'');
        }
        if(item.gunNoList.length !== 0){
          item.gunNoList.forEach((i,index)=>{
            item.gunNoList[index] = i.replace('号','')
          })
        }
      })
      console.log(arr,'处理后')
      let postData = {
        gasId: this.gasId,
        voList: arr,
        source: this.source,
        userId: this.userId,
        gasUsername: this.gasUsername
      }
      console.log(postData,'添加油站详情')
      // console.log(JSON.stringify(postData))
      addGasStationBaseInfo(postData).then((res)=>{
        console.log(res,'新增油站详情')
        this.$notify({
          title: res.data.code == 0 ? "成功" : '失败',
          message: res.data.msg,
          type: res.data.code == 0 ? "success" : 'error',
          duration: 1500
        });
        if(res.data.code == 0){
          // this.detailStatus = 'update';
          // this.getGasDetail(this.gasId);
          this.$router.go(-1);
        }
      })
    },
    // 编辑油站详情
    updateDetail(){
      let arr = JSON.parse(JSON.stringify(this.tableList));
      arr.forEach((item)=>{
        console.log(item)
        if(item.oilType){
          let text;
          switch(item.oilType) {
            case '汽油':
              text = '1';
              break;
            case '柴油':
              text = '2';
              break;
            case '天然气':
              text = '3';
              break;
            return text;
          }
          item.oilType = text;
        }
        if(item.oilNo){
          item.oilNo = item.oilNo.replace("#",'');
        }
        if(item.gunNoList.length !== 0){
          item.gunNoList.forEach((i,index)=>{
            item.gunNoList[index] = i.replace('号','')
          })
        }
      })
      console.log(arr,'修改处理后')
      let postData = {
        gasId: this.gasId,
        voList: arr,
        source: this.source,
        gasUsername: this.gasUsername,
        userId: this.userId
      }
      console.log(postData,'修改油站详情')
      console.log(JSON.stringify(postData))
      updateGasStationBaseInfo(postData).then((res)=>{
        console.log(res,'修改油站详情')
        this.$notify({
          title: res.data.code == 0 ? "成功" : '失败',
          message: res.data.msg,
          type: res.data.code == 0 ? "success" : 'error',
          duration: 1500
        });
        if(res.data.code == 0){
          // this.detailStatus = 'update';
          // this.getGasDetail(this.gasId);
          this.$router.go(-1);
        }
      })
    },
    // 切换导航栏之前
    beforeLeave(activeName, oldActiveName){
      if(this.gasId){
        return true;
      }else{
        this.$message({
          message: '请先保存油站基本信息',
          type: 'warning',
          duration: 3000
        });
        return false;
      }
    },
    // 编辑获取基本信息
    getGasInfo(gasId){
      let postData = {
        gasId: gasId,
        framesState: this.framesState,
        id: this.id,
        auditStatis: this.auditStatus
      }
      queryGasStationInfo(postData).then((res)=>{
        let gasInfo = res.data;
        console.log(res,'基本信息')
        if(gasInfo){
          this.formData.gasName = gasInfo.gasName;
          this.formData.gasType = gasInfo.gasType;
          this.formData.preDeposit = gasInfo.preDeposit;
          this.formData.source = gasInfo.source;
          this.source = gasInfo.source;
          this.formData.gasUsername = gasInfo.gasUsername;
          this.formData.parUsername = gasInfo.parUsername;
          this.formData.deviceId = gasInfo.deviceId;
          this.formData.gasLogoBig = gasInfo.gasLogoBig;
          this.formData.gasLogoSmall = gasInfo.gasLogoSmall;
          this.fileList = [];
          this.fileList.push({name:gasInfo.gasLogoSmall.indexOf('http')==0 ? gasInfo.gasLogoSmall : this.baseUrl+gasInfo.gasLogoSmall, 
          url:gasInfo.gasLogoSmall.indexOf('http')==0 ? gasInfo.gasLogoSmall : this.baseUrl+gasInfo.gasLogoSmall});
          this.formData.gasAddressLongitude = gasInfo.gasAddressLongitude;      //经度
          this.formData.gasAddressLatitude = gasInfo.gasAddressLatitude;      //纬度
          this.defaultCenter = [gasInfo.gasAddressLongitude,gasInfo.gasAddressLatitude];
          this.formData.gasAddress = gasInfo.gasAddress;             //详细地址
          this.formData.provinceName = gasInfo.provinceName;             //省
          this.formData.cityName = gasInfo.cityName;             //市
          this.formData.countyName = gasInfo.countyName;            //区
          this.id = gasInfo.id;            //区
          this.citysArr = [gasInfo.provinceName,gasInfo.cityName,gasInfo.countyName];
          this.getGasDetail(gasId);
        }
      })
    },
    // 编辑获取油站详情
    getGasDetail(id){
      let postData = {
        gasId: id,
        source: this.source
      }
      queryOilNoBaseInfoList(postData).then((res)=>{
        console.log(res,'油站详情')
        if(res.data.length !== 0){
          res.data.forEach((item)=>{
            item.isPush = true;
            if(item.oilType){
              let text;
              switch(item.oilType) {
                case '1':
                  text = '汽油';
                  break;
                case '2':
                  text = '柴油';
                  break;
                case '3':
                  text = '天然气';
                  break;
                return text;
              }
              item.oilType = text;
            }
            if(item.oilNo){
              item.oilNo = item.oilNo + '#';
            }
            if(item.gunNoList.length !== 0){
              item.gunNoList.forEach((i,index)=>{
                item.gunNoList[index] = i + '号'
              })
            }
          })
          this.tableList = res.data;
        }else{
          this.detailStatus = 'create'
        }
      })
    },
     // 处理城市区域数据
    getCitys(){
      let data = '';
      let cityArr = [];
      for(var i = 0,length = citys.districts.length; i<length; i++){
          data = citys.districts[i].districts;
      }
      data.forEach(item => {
          cityArr.push({
              label: item.name,
              value: item.adcode,
              children: item.districts
          })
          cityArr.forEach((item2)=>{
              item2.children.forEach((child)=>{
                  child.value = child.adcode;
                  child.label = child.name;
                  child.children = child.districts;
                  child.children.forEach((child2)=>{
                      child2.value = child2.adcode;
                      child2.label = child2.name;
                  })
              })
          })
      });
      this.cityOptions = cityArr;
      // console.log(cityArr,'cityArr')
    },
    // 上传图片
    uploadSuccess(res, file,fileList) {
      console.log(res,'上传成功');
      if(fileList.length > 1){
        this.fileList = [{name:res.imagePath.indexOf('http')==0 ? res.imagePath : this.baseUrl+res.imagePath, url:res.imagePath.indexOf('http')==0 ? res.imagePath : this.baseUrl+res.imagePath}];
      }
      this.formData.gasLogoSmall = res.imagePath;
      this.formData.gasLogoBig = res.imagePath;
    },
    // 地图选择
    getMapInfo(msg) {
        // console.log(msg,'ddd');
        this.formData.gasAddressLongitude = msg[0];
        this.formData.gasAddressLatitude = msg[1];
        this.formData.gasAddress = msg[2];
        this.formData = Object.assign({},this.formData);
        this.defaultCenter = [this.formData.gasAddressLongitude,this.formData.gasAddressLatitude];
    },
    // 选择城市
    changeCity(valueArr){
        // console.log(valueArr)
        this.citysArr = valueArr;
        let center;
        this.formData.provinceName = valueArr[0];
        this.formData.cityName = valueArr[1];
        this.formData.countyName = valueArr[2];
        this.cityOptions.forEach((i)=>{
          if(i.label == valueArr[0]){
            i.children.forEach((j)=>{
              if(j.label == valueArr[1]){
                if(j.children && j.children.length !== 0){
                  j.children.forEach((k)=>{
                    if(k.label == valueArr[2]){
                      center = k.center
                    }
                  })
                }else{
                  center = j.center
                }
              }
            })
          }
        })
        this.defaultCenter = center.split(",");
    },
    // 修改油站基本信息
    editor(formName){
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
          let postData = {
            userId: this.userId,
            ...this.formData,
            gasId: this.gasId,
            source: this.source,
            id: this.id,
            gasUsername: this.gasUsername
          }
          console.log(JSON.stringify(postData),'kkkkkkkk')
          updateGasStation(postData).then((res)=>{
            console.log(res,'修改基本信息')
            this.$notify({
              title: res.data.code == 0 ? "成功" : '失败',
              message: res.data.msg,
              type: res.data.code == 0 ? "success" : 'error',
              duration: 1500
            });
            if(res.data.code == 0){
              // 修改成功
              this.auditStatus = '1001';
              this.getGasInfo(this.gasId);
              this.activeName = 'detail'
            }
          })
      //   } else {
      //     console.log('效验失败');
      //     return false;
      //   }
      // });
    },
    // 添加油站基本信息
    fetchAddStore(){
      // this.$refs['form'].validate((valid) => {
      //   console.log(valid,'kkkk')
      //   if (valid) {
          let postData = {
            userId: this.userId,
            ...this.formData,
            source: this.source,
            gasUsername: this.gasUsername
          }
          addGasStation(postData).then((res)=>{
            console.log(res,'添加基本信息')
            this.$notify({
              title: res.data.code == 0 ? "成功" : '失败',
              message: res.data.msg,
              type: res.data.code == 0 ? "success" : 'error',
              duration: 1500
            });
            if(res.data.code == 0){
              // 添加成功
              this.gasId = res.data.data;
              this.getGasInfo(res.data.data)
              this.activeName = 'detail'
            }
          })
        // } else {
        //   console.log('效验失败');
        //   return false;
        // }
      // });
    },
  },
  beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getCitys();
        if(to.query.id){
          // 修改
          vm.gasId = to.query.gasId;
          vm.id = to.query.id;
          vm.framesState = to.query.framesState;
          vm.auditStatus = to.query.auditStatus;
          vm.source = to.query.source;
          vm.getGasInfo(to.query.gasId);
          vm.operation = 'update';
        }else{
          // 添加
          vm.operation = 'create';
          vm.detailStatus = 'create';
        }
      });
  },
}
</script>

<style lang='scss'>
  .textCenter .el-form-item__label{
    text-align: center;
  }
  .textCenter .el-checkbox{
    display: inline-block;
  }
</style>

