<template>
    <div>
        <div class="freight-wrapper">
            <h4 class="freight-title">新增运费模板</h4>
            <el-form ref="form" :model="form" label-width="150px" :rules="rules">
                <el-form-item label="模  板   名  称：" prop="templateName">
                    <el-input v-model="form.templateName"></el-input>
                </el-form-item>
                <el-form-item label="是  否   包  邮：" prop="isPost">
                    <el-radio-group v-model="form.isPost">
                        <el-radio label="0">自定义运费</el-radio>
                        <el-radio label="1">卖家承担运费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="运  送   方  式：" prop="deliveryType">
                    <el-radio-group v-model="form.deliveryType" @change="toggleExpress">
                        <el-radio label="express">快递</el-radio>
                        <el-radio label="logistics">物流</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="快递计费方式：" prop="chargType" v-if="form.isPost == 1 || form.deliveryType == 'logistics' ? false : true">
                    <el-radio-group v-model="form.chargType" @change="billingChange">
                        <el-radio :label="0">按件数</el-radio>
                        <el-radio :label="1">按重量</el-radio>
                        <el-radio :label="2">按体积</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="物流计费方式：" prop="logisticsChargType" v-if="form.isPost == 1 || form.deliveryType == 'express' ? false : true">
                    <el-radio-group v-model="form.logisticsChargType" @change="billingChange">
                        <el-radio :label="0">按件数</el-radio>
                        <el-radio :label="1">按重量</el-radio>
                        <el-radio :label="2">按体积</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="快  递   类  型：" prop="shipperCode" v-if="form.isPost == 1 ? false : true">
                    <el-radio-group v-model="form.shipperCode" style="margin: 15px 0 10px 0;">
                        <el-radio style="margin: 0 30px 10px 0;" v-for="item in shipperNameList" :key="item.label" :label="item.label">{{item.value}}</el-radio>
                    </el-radio-group>
                    <div class="shipping-wrapper">     
                        <div class="shipping-top">
                           <div v-if="form.deliveryType == 'express'">
                                <span >默认运费</span>
                                <el-input v-model="defaultFreightExpress.firstWeight" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">{{unit01}}内</span>
                                <el-input v-model="defaultFreightExpress.firstWeightMoney" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">元，</span>
                                <span>每增加</span>
                                <el-input v-model="defaultFreightExpress.continuedWeight" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">{{unit01}},</span>
                                <span>增加运费</span>
                                <el-input v-model="defaultFreightExpress.continuedWeightMoney" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">元</span>
                           </div>
                           <div v-else>
                                <span >默认运费</span>
                                <el-input v-model="defaultFreightLogistics.firstWeight" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">{{unit01}}内</span>
                                <el-input v-model="defaultFreightLogistics.firstWeightMoney" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">元，</span>
                                <span>每增加</span>
                                <el-input v-model="defaultFreightLogistics.continuedWeight" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">{{unit01}},</span>
                                <span>增加运费</span>
                                <el-input v-model="defaultFreightLogistics.continuedWeightMoney" style="width: 70px;" size="small"></el-input>
                                <span style="color: #909399;">元</span>
                           </div>
                        </div>
                        <el-table
                            :data="form.deliveryType == 'express' ? exporessData : logisticsData"    
                            stripe                        
                            style="width: 100%"
                            :header-cell-class-name="headerClassName"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="selection" v-if="isBatch"  width="30">
                            </el-table-column>
                            <el-table-column label="运送到" width="250">
                                <template scope="scope">
                                    <div style="display: flex;justify-content: space-between;align-items: center;">
                                        <span style="font-size: 14px;color: #666;">
                                            {{scope.row.provinceId ? filterPrivinceName(scope.row.provinceId) : '未选择地区'}}
                                            <el-select v-model="scope.row.cityId" @focus="getCity(scope.row.provinceId, scope.$index, 'freight')" style="width:130px;margin-left:20px;" placeholder="全部城市" size="mini">
                                                <el-option
                                                    v-for="item in scope.row.citys"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </span>
                                        <!-- <el-button size="mini" @click="selectProvince(scope.$index)">编辑</el-button> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :label="'首'+unit02+'('+unit01+')'">
                                <template scope="scope">
                                    <el-input v-model="scope.row.firstWeight" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="首费(元)">
                                <template scope="scope">
                                    <el-input v-model="scope.row.firstWeightMoney" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="'续'+unit02+'('+unit01+')'">
                                <template scope="scope">
                                    <el-input v-model="scope.row.continuedWeight" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="续费(元)">
                                <template scope="scope">
                                    <el-input v-model="scope.row.continuedWeightMoney" size="small"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button @click="deleteFreight(scope.$index, scope.row.id)" size="mini">删除1</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="shipping-batch" v-show="isBatch">
                            <el-button size="mini" @click="addSelectFreight">批量设置</el-button>
                            <el-button size="mini" @click="deleteSelectFreight">批量删除</el-button>
                        </div>
                        <div class="shipping-bottom">
                            <el-button size="mini" @click="addFreight" type="primary">为指定地区城市设置运费</el-button>
                            <!-- <el-button size="mini" @click="doBatch">{{isBatch ? '取消批量操作' : '批量操作'}}</el-button> -->
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="指定条件包邮：" v-if="form.isPost == 1 ? false : true">
                    <el-switch
                        v-model="switchValue">
                    </el-switch>
                    <div style="border:1px solid #ebeef5;" v-if="switchValue">
                        <el-table
                            :data="form.deliveryType == 'express' ? tableData02Express : tableData02LogisticsData"
                            stripe
                            :header-cell-class-name="headerClassName">
                            <el-table-column label="选中地区" width="250">
                                <template scope="scope">
                                    <div style="display: flex;justify-content: space-between;align-items: center;">
                                        <span style="font-size: 14px;color: #666;">
                                            {{scope.row.provinceId ? filterPrivinceName(scope.row.provinceId) : '未选择地区'}}
                                            <el-select v-model="scope.row.cityId" @focus="getCity(scope.row.provinceId, scope.$index, 'free')" style="width:130px;margin-left:20px;" placeholder="全部城市" size="mini">
                                                <el-option
                                                    v-for="item in scope.row.citys"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </span>
                                        <!-- <el-button size="mini" @click="selectProvince02(scope.$index)">编辑</el-button> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="选择运送方式" align="center">
                                <template>
                                    <!-- <el-select v-model="scope.row.shipperCode" size="small" placeholder="请选择">
                                        <el-option
                                        v-for="item in shipperNameList"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.label">
                                        </el-option>
                                    </el-select> -->
                                    <el-tag>{{filterShipper(form.shipperCode)}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="设置包邮条件" width="350">
                                <template scope="scope">
                                    <el-select v-model="scope.row.condition" size="small" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <div v-if="scope.row.condition && scope.row.condition.length != 2">
                                        <span v-if="scope.row.condition !='3'">在大于或等于</span>
                                        <span v-if="scope.row.condition =='3'">在大于</span>
                                        <!-- <span>在大于或等于</span> -->
                                        <el-input v-model="scope.row.conditionValue01" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>{{scope.row.condition | filterText}}包邮</span>
                                    </div>
                                    <div v-if="scope.row.condition && scope.row.condition.length == 2">
                                        <span>在大于或等于</span>
                                        <el-input v-model="scope.row.conditionValue02" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>{{scope.row.condition[1] | filterText}}</span>
                                        <el-input v-model="scope.row.conditionValue03" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>元以上包邮</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button  @click="deleteFreight02(scope.$index, scope.row.id)" size="mini">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="shipping-bottom">
                            <el-button @click="addFreight02()" type="primary" size="mini">增加指定条件包邮</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="指定特殊条件邮费：" v-if="form.isPost == 1 ? false : true">
                    <el-switch
                        v-model="switchValue02">
                    </el-switch>
                    <div style="border:1px solid #ebeef5;" v-if="switchValue02">
                        <el-table
                            :data="form.deliveryType == 'express' ? tableData03Express : tableData03LogisticsData"
                            stripe
                            :header-cell-class-name="headerClassName">
                            <el-table-column label="选中地区" width="250">
                                <template scope="scope">
                                    <div style="display: flex;justify-content: space-between;align-items: center;">
                                        <span style="font-size: 14px;color: #666;">
                                            {{scope.row.provinceId ? filterPrivinceName(scope.row.provinceId) : '未选择地区'}}
                                            <el-select v-model="scope.row.cityId" @focus="getCity(scope.row.provinceId, scope.$index, 'specify')" style="width:130px;margin-left:20px;" placeholder="全部城市" size="mini">
                                                <el-option
                                                    v-for="item in scope.row.citys"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </span>
                                        <!-- <el-button size="mini" @click="selectProvince03(scope.$index)">编辑</el-button> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="选择运送方式" align="center">
                                <template>
                                    <el-tag>{{filterShipper(form.shipperCode)}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="设置包邮条件" width="370">
                                <template scope="scope">
                                    <el-select v-model="scope.row.condition" size="small" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <div v-if="scope.row.condition && scope.row.condition.length != 2">
                                        <span>在</span>
                                        <el-input v-model="scope.row.min" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>至</span>
                                        <el-input v-model="scope.row.max" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>{{scope.row.condition | filterText}}内</span>
                                        <el-input v-model="scope.row.money" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>元</span>
                                    </div>
                                    <!-- <div v-if="scope.row.condition && scope.row.condition.length == 2">
                                        <span>在</span>
                                        <el-input v-model="scope.row.conditionValue02" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>{{scope.row.condition[1] | filterText}}内,</span>
                                        <el-input v-model="scope.row.conditionValue03" style="width: 70px;margin-top: 5px;" size="mini"></el-input>
                                        <span>元以上包邮</span>
                                    </div> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button  @click="deleteFreight03(scope.$index, scope.row.id)" size="mini">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="shipping-bottom">
                            <el-button @click="addFreight03()" type="primary" size="mini">增加指定条件包邮</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <!-- <el-button @click="update" >修改并返回</el-button> -->
                    <el-button @click="submit('form')" v-if="form.isPost == 0">保存并返回</el-button>
                    <el-button @click="submitTwo('form')" v-else>保存并返回</el-button>
                    <el-button @click="cancleAdd">取消</el-button>
                </el-form-item>
            </el-form>
            <el-dialog
                title="省份"
                :visible.sync="dialogVisible"
                width="40%">
               <el-checkbox-group 
                    v-model="checkedList">
                    <el-checkbox v-for="item in provinceList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSelectProvice">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="省份"
                :visible.sync="dialogVisible02"
                width="40%">
                <el-checkbox-group 
                    v-model="checkedList02">
                    <el-checkbox v-for="item in provinceList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible02 = false">取 消</el-button>
                    <el-button type="primary" @click="handleSelectProvice02">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="省份"
                :visible.sync="dialogVisible03"
                width="40%">
               <el-checkbox-group
                    v-model="checkedList03">
                    <el-checkbox v-for="item in provinceList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible03 = false">取 消</el-button>
                    <el-button type="primary" @click="handleSelectProvice03">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { addFreightTemplate, fetchTempalteInfoById, delFreight, delCondition, delSpecify } from '@/api/freight/index'
    import { getAllProvince, getCityByProvinceId } from '@/api/product/purchase'
    import { fetchShipper } from '@/api/order/index'
    import { filterAddressData, resolveUrlPath } from '@/util/util'
    export default {
        data(){
            return {
                form: {
                    templateName: '',
                    isPost: '0',
                    chargType: '',
                    logisticsChargType: '',
                    shipperCode: '',
                    deliveryType: 'express'
                },
                visible1: false,
                visible2: false,
                visible3: false,
                tableData: [],
                exporessData: [],
                logisticsData: [],
                isBatch: false,
                selectTableData: [],
                unit01: '',
                unit02: '',
                switchValue: false, //是否指定条件包邮
                switchValue02: false,
                tableData02: [],
                tableData02Express: [],
                tableData02LogisticsData: [],
                tableData03: [],
                tableData03Express: [],
                tableData03LogisticsData: [],
                options: [{
                    value: '0',
                    label: '件'
                },{
                    value: '3',
                    label: '金额'
                },{
                    value: '30',
                    label: '件 + 金额'
                }],
                rules: {
                    templateName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' }, 
                    ],
                    isPost: [
                        { required: true, message: '请选择包邮方式', trigger: 'change' }
                    ],
                    chargType: [
                        { required: true, message: '请选择计费方式', trigger: 'change' }
                    ],
                    logisticsChargType: [
                        { required: true, message: '请选择物流计费方式', trigger: 'change' }
                    ],
                    shipperCode: [
                        { required: true, message: '请选择运送方式', trigger: 'change' }
                    ],
                    deliveryType: [
                        { required: true, message: '请选择运送方式' }
                    ]
                },
                provinceList: [],
                dialogVisible: false,
                dialogVisible02: false,
                dialogVisible03: false,
                checkedList: [],
                checkedList02: [],
                checkedList03: [],
                tempIndex: 0,
                shipperNameList: [],
                condition01: '',
                condition02: '',
                // defaultFreight: {
                //     firstWeight: null,
                //     firstWeightMoney: '',
                //     continuedWeight: null,
                //     continuedWeightMoney: ''
                // },
                defaultFreight: [],
                defaultFreightExpress: {
                    deliveryType: 'express'
                },
                defaultFreightLogistics: {
                    deliveryType: 'logistics'
                },
                id: '',
                cityList: []
            }
        },
        created(){
            this.getProvince();
            this.getShipper();
            this.id = this.$route.query.id;
            if(this.id){
                this.getTemplateById(this.id);
            }
        },
        methods: {
            async getProvince(){
                const res = await getAllProvince();
                this.provinceList = filterAddressData(res.data.result, true);
            },
            async getCity(value, index, type){
                let cityList = [];
                let postData = {
                    provinceId: value
                }
                const res = await getCityByProvinceId(postData);
                cityList = filterAddressData(res.data.result, true);
                if(type == 'freight'){
                    this.tableData.forEach((item, index02) => {
                        if(item.provinceId == value){ //省份id相等时
                            item.citys = cityList
                        }
                    });
                    this.tableData = Object.assign([],this.tableData);
                    this._tableDataDeffi(this.tableData);
                }else if(type == 'specify'){
                    this.tableData03.forEach((item, index02) => {
                        if(item.provinceId == value){
                            item.citys = cityList
                        }
                    })
                    this.tableData03 = Object.assign([],this.tableData03);
                    this._tableDataDeffi03(this.tableData03);
                }else if(type == 'free'){
                    this.tableData02.forEach((item, index02) => {
                        if(item.provinceId == value){
                            item.citys = cityList
                        }
                    })
                    this.tableData02 = Object.assign([],this.tableData02);
                    this._tableDataDeffi02(this.tableData02);
                }
            },
            headerClassName({ row, rowIndex }){
                return 'header-class-name'
            },
            addFreight(){
                this.dialogVisible = true;
                this.checkedList = [];
                this.tableData.forEach(item => {
                    if(item.deliveryType == this.form.deliveryType){ //通过判断运送方式获取对应的省份Id
                        this.checkedList.push(Number(item.provinceId))
                    }
                })
            },
            addFreight02(){
                this.dialogVisible02 = true;
                this.checkedList02 = [];
                this.tableData02.forEach(item => {
                    if(item.deliveryType == this.form.deliveryType){ //通过判断运送方式获取对应的省份Id
                        this.checkedList02.push(Number(item.provinceId))
                    }
                })
            },
            addFreight03(){
                this.dialogVisible03 = true;
                this.checkedList03 = [];
                this.tableData03.forEach(item => {
                    if(item.deliveryType == this.form.deliveryType){ 
                        //通过判断运送方式获取对应的省份Id
                        this.checkedList03.push(Number(item.provinceId))
                    }
                })
            },
            async deleteFreight(index, id){
                if(id){
                    const res = await delFreight(id);
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                    this.tableData.forEach((item, index02) => {
                        if(item.id == id){
                            this.tableData.splice(index02, 1);
                        }
                    });
                    this._tableDataDeffi(this.tableData);
                }else{
                    if(this.form.deliveryType == 'express'){
                        this.exporessData.splice(index,1)
                    }else if(this.form.deliveryType == 'logistics'){
                        this.logisticsData.splice(index,1)
                    }
                }
            },
            async deleteFreight02(index,id){
                if(id){
                    const res = await delCondition(id);
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                    this.tableData02.forEach((item, index02) => {
                        if(item.id == id){
                            this.tableData02.splice(index02, 1);                    
                        }
                    });
                    this._tableDataDeffi02(this.tableData02);
                }
            },
            async deleteFreight03(index,id){
                if(id){
                    const res = await delSpecify(id);
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                    this.tableData03.forEach((item, index02) => {
                        if(item.id == id){
                            this.tableData03.splice(index02, 1);                    
                        }
                    });
                    this._tableDataDeffi03(this.tableData03);
                }
            },
            doBatch(){
                this.isBatch = !this.isBatch;
            },
            handleSelectionChange(val){
                console.log(val,'val');
                this.selectTableData = val;
            },
            toggleExpress(val){
                // this.defaultFreight.deliveryType = val;
                // this.exporessData = [];
                // this.tableData.forEach(item => {
                //     if(item.deliveryType === "express"){
                //         this.exporessData.push(item)
                //     }else {
                //         this.logisticsData.push(item)
                //     }
                // });
            },
            _tableDataDeffi(dataList){ //把tableData数据分到express和logistics
                this.exporessData = [];
                this.logisticsData = [];
                console.log(dataList,'分配城市')
                dataList.forEach(item => {
                    if(item.provinceId){
                        if(item.deliveryType === "express"){
                            this.exporessData.push(item)
                        }else if(item.deliveryType === "logistics"){
                            this.logisticsData.push(item)
                        }
                    }
                });
                this.exporessData.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
                this.logisticsData.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
            },
            _tableDataDeffi02(dataList){
                this.tableData02Express = [];
                this.tableData02LogisticsData = [];
                dataList.forEach(item => {
                    if(item.deliveryType === "express"){
                        this.tableData02Express.push(item)
                    }else if(item.deliveryType === "logistics"){
                        this.tableData02LogisticsData.push(item)
                    }
                });
                this.tableData02Express.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
                this.tableData02LogisticsData.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
            },
            _tableDataDeffi03(dataList){
                this.tableData03Express = [];
                this.tableData03LogisticsData = [];
                dataList.forEach(item => {
                    if(item.deliveryType === "express"){
                        this.tableData03Express.push(item)
                    }else if(item.deliveryType === "logistics"){
                        this.tableData03LogisticsData.push(item)
                    }
                });
                this.tableData03Express.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
                this.tableData03LogisticsData.forEach((item, index) => {
                    this.$set(item, 'citys', item.citys);
                });
            },
            defaultFreightDeffi(dataList){
                dataList.forEach(item => {
                    if(item.deliveryType === "express"){
                        this.defaultFreightExpress = {};
                        this.defaultFreightExpress = item
                    }else if(item.deliveryType === "logistics"){
                        this.defaultFreightLogistics = {};
                        this.defaultFreightLogistics = item
                    }
                });
            },
            deleteSelectFreight(){ //批量删除
            },
            addSelectFreight(){  //批量增加
            },
            selectProvince(index){
                this.tempIndex = index;
                this.dialogVisible = true;
            },
            selectProvince02(index){
                this.tempIndex = index;
                this.dialogVisible02 = true;
            },
            selectProvince03(index){
                this.tempIndex = index;
                this.dialogVisible03 = true;
            },
            handleSelectProvice(){
                console.log(this.checkedList,'chengchi')
                let temArr = [];
                let isAdd = false;
                let index = 0;
                this.checkedList.forEach(item => {
                    this.tableData.forEach((item02, index02) => {
                        if(item == Number(item02.provinceId) && item02.deliveryType == this.form.deliveryType){ //省份Id相同，并且运送方式相同时才不需要push
                            isAdd = true;
                            index = index02;
                        }
                    })
                    if(!isAdd){
                         temArr.push({
                            provinceId: item,
                            firstWeight: 0,
                            firstWeightMoney: '',
                            continuedWeight: 0,
                            continuedWeightMoney: '',
                            deliveryType: this.form.deliveryType
                        })
                    }else {
                        isAdd = false;
                    }
                });
                console.log(temArr,'arr')
                if(temArr.length !== 0 ){
                    this.tableData = this.tableData.concat(temArr);
                }
                this.tableData = Object.assign([], this.tableData);
                this.tableData.forEach((i,idx)=>{
                    if(!i.provinceId){
                        this.tableData.splice(idx,1)
                    }
                })
                this._tableDataDeffi(this.tableData);
                this.dialogVisible = false;
            },
            handleSelectProvice02(){
                let temArr = [];
                let isAdd = false;
                let index = 0;
                this.checkedList02.forEach(item => {
                    this.tableData02.forEach((item02, index02) => {
                        if(item == Number(item02.provinceId) && item02.deliveryType == this.form.deliveryType){
                            isAdd = true;
                            index = index02;
                        }
                    })
                    if(!isAdd){
                        temArr.push({
                            provinceId: item,
                            shipperCode: '',
                            condition: '',
                            conditionValue01: '',
                            conditionValue02: '',
                            conditionValue03: '',
                            deliveryType: this.form.deliveryType
                        })
                    }else {
                        isAdd = false;
                    }
                });
                if(temArr.length != 0 ){
                    this.tableData02 = this.tableData02.concat(temArr);
                }
                this.tableData02 = Object.assign([], this.tableData02);
                this._tableDataDeffi02(this.tableData02);
                this.dialogVisible02 = false;
            },
            handleSelectProvice03(){
                let temArr = [];
                let isAdd = false;
                let index = 0;
                this.checkedList03.forEach(item => {
                    this.tableData03.forEach((item02, index02) => {
                        if(item == Number(item02.provinceId) && item02.deliveryType == this.form.deliveryType){
                            isAdd = true;
                            index = index02;
                        }
                    })
                    if(!isAdd){
                        temArr.push({
                            provinceId: item,
                            shipperCode: '',
                            condition: '',
                            conditionValue01: '',
                            conditionValue02: '',
                            conditionValue03: '',
                            deliveryType: this.form.deliveryType
                        })
                    }else {
                        isAdd = false;
                    }
                });
                if(temArr.length != 0 ){
                    this.tableData03 = this.tableData03.concat(temArr);
                }
                this.tableData03 = Object.assign([], this.tableData03);
                this._tableDataDeffi03(this.tableData03);
                this.dialogVisible03 = false;
            },
            async getShipper(){
                const res = await fetchShipper();
                this.shipperNameList = []
                res.data.forEach((item, index) => {
                    this.shipperNameList.push({
                        label: item.shipperCode,
                        value: item.shipperName,
                    });
                });
            },
            changePostage(val){
            },
            submit(formName){
                this.$refs[formName].validate(async (valid) => {
                    console.log(this.$refs[formName], 'this.$refs[formName]');
                    if(valid){
                        let template = {
                            chargType: this.form.chargType,
                            logisticsChargType: this.form.logisticsChargType,
                            shipperCode: this.form.shipperCode,
                            isPost: Number(this.form.isPost),
                            templateName: this.form.templateName,
                            id: this.form.id
                        }
                        let tempDefaultFreight = [];
                        this.defaultFreight = [];
                        this.defaultFreight.push(this.defaultFreightExpress);
                        this.defaultFreight.push(this.defaultFreightLogistics);
                        this.defaultFreight.forEach(item => {
                            tempDefaultFreight.push({
                                isDefaultis: 0,
                                firstWeight: item.firstWeight,
                                firstWeightMoney: item.firstWeightMoney,
                                continuedWeight: item.continuedWeight,
                                continuedWeightMoney: item.continuedWeightMoney,
                                provinceId: '',
                                id: item.id,
                                templateId: item.templateId,
                                deliveryType: item.deliveryType
                            })
                        });
                        if(this.tableData.length > 0){
                            this.tableData.forEach(item => {
                                item.isDefaultis = 1;
                                item.firstWeight = Number(item.firstWeight);
                                item.continuedWeight = Number(item.continuedWeight);
                                item.provinceId = String(item.provinceId);
                            });
                        }
                        console.log(tempDefaultFreight,'tempDefaultFreight');
                        tempDefaultFreight.forEach((item)=>{
                            if(item.continuedWeight == undefined || item.continuedWeightMoney == undefined || item.firstWeight == undefined || item.firstWeightMoney == undefined){
                                console.log('000')
                            }else{
                                this.tableData.push(item);
                            }
                        })
                        // this.tableData.push(tempDefaultFreight[0]);
                        // this.tableData.push(tempDefaultFreight[1]);
                        
                        let freight = this.tableData;
                        console.log(freight,'参数')
                        let free = [];
                        if(this.tableData02.length > 0){
                            this.tableData02.forEach(item => {
                                if(item.condition.length == 1){
                                    free.push({
                                        provinceId: String(item.provinceId),
                                        shipperCode: this.form.shipperCode,
                                        condition: item.condition,
                                        cityId: item.cityId,
                                        id: item.id,
                                        deliveryType: item.deliveryType,
                                        templateId: item.templateId,
                                        content: Number(item.condition[0]) == 3 ? [String(Number(item.conditionValue01)*10000)] : [String(Number(item.conditionValue01))]
                                    });
                                }
                                if(item.condition.length == 2){
                                    free.push({
                                        provinceId: String(item.provinceId),
                                        shipperCode: this.form.shipperCode,
                                        condition: item.condition,
                                        cityId: item.cityId,
                                        id: item.id,
                                        deliveryType: item.deliveryType,
                                        templateId: item.templateId,
                                        content: [String(item.conditionValue02),String(Number(item.conditionValue03)*10000)]
                                    });
                                }
                            });
                        }
                        let specify = [];
                        if(this.tableData03.length > 0){
                            this.tableData03.forEach(item => {
                                specify.push({
                                    provinceId: String(item.provinceId),
                                    shipperCode: this.form.shipperCode,
                                    condition: item.condition,
                                    cityId: item.cityId,
                                    id: item.id,
                                    templateId: item.templateId,
                                    min: item.min,
                                    max: item.max,
                                    money: item.money,
                                    deliveryType: item.deliveryType,
                                });
                            });
                        }
                        let postData = {
                            template: template,
                            freight: freight,
                            free: free.length > 0 ? free : null,
                            specify: specify.length > 0 ? specify : null
                        }
                        const res = await addFreightTemplate(postData);
                        console.log(res)
                        if(this.id){
                            this.$notify({
                                title: res.data.data ? res.statusText : res.data.msg,
                                message: res.data.data ? '修改成功' : '修改失败',
                                type: res.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                            // this.$router.push({
                            //     path: resolveUrlPath("/freight/index"),
                            //     query: {
                            //         isAdd: false
                            //     }
                            // });
                            if(res.data.data){
                                this.$router.go(-1)
                            }else{
                                this.tableData.forEach((i,dex)=>{
                                    if(!String(i.continuedWeightMoney) || !String(i.continuedWeightMoney) || !String(i.firstWeight) || !String(i.firstWeightMoney)){
                                        this.tableData.splice(dex,1)
                                    }
                                })
                                this._tableDataDeffi(this.tableData)
                            }
                        }else {
                            this.$notify({
                                title: res.data.data ? res.statusText : res.data.msg,
                                message: res.data.msg,
                                type: res.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                            // this.$router.push({
                            //     path: resolveUrlPath("/freight/index"),
                            //     query: {
                            //         isAdd: true
                            //     }
                            // });
                            if(res.data.data){
                                this.$router.go(-1)
                            }else{
                               this.tableData.forEach((i,dex)=>{
                                    if(!String(i.continuedWeightMoney) || !String(i.continuedWeightMoney) || !String(i.firstWeight) || !String(i.firstWeightMoney)){
                                        this.tableData.splice(dex,1)
                                    }
                                })
                                this._tableDataDeffi(this.tableData)
                            }
                        }
                    }else {
                        return false
                    }
                })
            },
            submitTwo(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        let postData = {
                            template: {
                                isPost: Number(this.form.isPost),
                                templateName: this.form.templateName,
                                id: this.form.id
                            },
                            freight: null,
                            free: null
                        }
                        const res = await addFreightTemplate(postData);
                        if(this.id){
                            this.$notify({
                                title: res.data.data ? res.statusText : res.data.msg,
                                message: res.data.data ? '修改成功' : '修改失败',
                                type: res.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                            // this.$router.push({
                            //     path: resolveUrlPath("/freight/index"),
                            //     query: {
                            //         isAdd: false
                            //     }
                            // });
                            this.$router.go(-1)

                        }else {
                            this.$notify({
                                title: res.data.data ? res.statusText : res.data.msg,
                                message: res.data.msg,
                                type: res.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                            // this.$router.push({
                            //     path: resolveUrlPath("/freight/index"),
                            //     query: {
                            //         isAdd: true
                            //     }
                            // });
                            this.$router.go(-1)

                        }
                    }else {
                        return false;
                    }
                });
            },
            cancleAdd(){
                // this.$router.push({
                //     path: resolveUrlPath("/freight/index"),
                //     query: {
                //         isAdd: false
                //     }
                // });
                this.$router.go(-1)

            },
            async getTemplateById(id){  //通过id获取运费模板信息
                const res = await fetchTempalteInfoById(id);
                console.log(res, '模板信息')
                this.form = {
                    templateName: res.data.templateName,
                    chargType: res.data.chargType,
                    logisticsChargType: res.data.logisticsChargType,
                    shipperCode: res.data.shipperCode,
                    isPost: String(res.data.isPost),
                    id: res.data.id,
                    deliveryType: 'express'
                }
                //通过chargType筛选this.options
                this.billingChange(res.data.chargType);
                res.data.freights.forEach(item => {
                    item.firstWeightMoney = Number(item.firstWeightMoney)/10000;
                    item.continuedWeightMoney = Number(item.continuedWeightMoney)/10000;
                });
                this.defaultFreight= [];
                res.data.freights.forEach((item, index) => {
                    if(item.cityId) item.cityId = Number(item.cityId);

                    if(!item.isDefaultis){
                        this.defaultFreight.push(item);
                        res.data.freights.splice(index, 1);
                    }
                });
                this.defaultFreightDeffi(this.defaultFreight);
                this.tableData = res.data.freights;
                
                this.tableData.forEach(async item02 => {
                    let postData = {
                        provinceId: item02.provinceId
                    }
                    const res02 = await getCityByProvinceId(postData);
                    item02.citys = filterAddressData(res02.data.result, true);
                    this.tableData = Object.assign([],this.tableData);
                });
                this._tableDataDeffi(this.tableData);
                if(res.data.freightConditions.length > 0){
                    this.switchValue = true;
                    res.data.freightConditions.forEach(item => {
                        if(item.cityId) item.cityId = Number(item.cityId);

                        item.condition = String(item.condition);
                        item.content = JSON.parse(item.content);
                        if(item.condition.length == 1){
                            if(Number(item.condition[0]) == 3){
                                item.conditionValue01 = Number(item.content[0])/10000;
                            }else {
                                item.conditionValue01 = Number(item.content[0]);
                            }
                        } 
                        if(item.condition.length == 2){
                            item.conditionValue02 = Number(item.content[0]);
                            item.conditionValue03 = Number(item.content[1])/10000;
                        }
                    });
                    this.tableData02 = Object.assign([],res.data.freightConditions);
                    this.tableData02.forEach(async item03 => {
                        let postData = {
                            provinceId: item03.provinceId
                        }
                        const res03 = await getCityByProvinceId(postData);
                        item03.citys = filterAddressData(res03.data.result, true);
                        this.tableData02 = Object.assign([],this.tableData02);
                    });
                    this._tableDataDeffi02(this.tableData02);
                }
                if(res.data.freightSpecifies.length > 0){
                    this.switchValue02 = true;
                    res.data.freightSpecifies.forEach(item => {
                        if(item.cityId) item.cityId = Number(item.cityId);
                        item.condition = String(item.condition);
                    });
                    this.tableData03 = Object.assign([],res.data.freightSpecifies);
                    this.tableData03.forEach(async item03 => {
                        let postData = {
                            provinceId: item03.provinceId
                        }
                        const res03 = await getCityByProvinceId(postData);
                        item03.citys = filterAddressData(res03.data.result, true);
                        this.tableData03 = Object.assign([],this.tableData03);
                    });
                    this._tableDataDeffi03(this.tableData03);
                }
            },
            async update(){
                this.defaultFreight.forEach(item => {
                    if(this.form.deliveryType == item.deliveryType){
                        this.tableData.push(item);
                    }
                });
                let postData = {
                    template: {
                        ...this.form
                    },
                    freight: this.tableData,
                    free: this.tableData02
                }
                const res = await addFreightTemplate(postData);
                this.$notify({
                    title: res.data.data ? res.statusText : res.data.msg,
                    message: res.data.data ? '修改成功' : '修改失败',
                    type: res.data.data ? 'success' : 'error',
                    duration: 2000
                });
            },
            billingChange(val){
                switch(val){
                    case 0:
                        this.unit01 = '件';
                        this.unit02 = '件';
                        this.options = [{
                            value: '0',
                            label: '件'
                        },{
                            value: '3',
                            label: '金额(元)'
                        },{
                            value: '30',
                            label: '件 + 金额'
                        }];
                        break;
                    case 1:
                        this.options = [{
                            value: '1',
                            label: '重量(kg)'
                        },{
                            value: '3',
                            label: '金额(元)'
                        },{
                            value: '31',
                            label: '重量(kg) + 金额'
                        }],
                        this.unit01 = 'kg';
                        this.unit02 = '重量';
                        break;
                    case 2:
                        this.options = [{
                            value: '2',
                            label: '体积(m³)'
                        },{
                            value: '3',
                            label: '金额(元)'
                        },{
                            value: '32',
                            label: '体积(m³) + 金额'
                        }],
                        this.unit01 = 'm³';
                        this.unit02 = '体积';
                        break;
                }
            },
            filterPrivinceName(val){
                let tempLabel = '' 
                this.provinceList.forEach(item => {
                    if(item.value == val){
                        tempLabel = item.label
                    }
                });
                return tempLabel;
            },
            filterShipper(val){
                console.log(val, 'val');
                console.log(this.shipperNameList, 'this.shipperNameList');
                let tempName = '';
                this.shipperNameList.forEach(item => {
                    if(item.label == val){
                        tempName = item.value
                    }
                });
                return tempName;
            }
        },
        filters: {
            filterText(val){
                let stateMap = {
                    '0': '件',
                    '1': '重量(kg)',
                    '2': '体积(m³)',
                    '3': '金额(元)'
                }
                return stateMap[val];
            },
        }
    }
</script>
<style lang="scss">
    .freight-wrapper{
        width: 60%;
        margin: 0 auto;
        .freight-title{
            margin-bottom: 10px;
        }
        .shipping-wrapper{
            border: 1px solid #ebeef5;
            .shipping-top{
                padding: 5px 10px;
                background-color: #e9f2ff;
            }
            .shipping-batch{
                padding: 0 0 10px 10px;
            }
        }
        .shipping-bottom{
            padding: 0 10px;
        }
        .header-class-name{
            background-color: #fafafa;
        }
    }
</style>

