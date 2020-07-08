<template>
  <div style="padding: 10px;">
    <!-- 顶部搜索框开始 -->
    <div style="margin-bottom: 10px">
      <!--APPID 下拉框 -->
       <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto;">
                <el-option
                v-for="(item, index) in AppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
            <!-- 下拉框 -->
      <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入手机号码"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!-- 顶部搜索框结束 -->
    <!-- 主题展示部分的开始 -->
    <el-table v-loading="listLoading" :data="list" border stripe style="width: 100%">
      <el-table-column align="center" label="应用名称">
        <template scope="scope">
          <span>{{scope.row.appId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总积分">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <!-- <el-button type="primary" size="small" @click="goDetail(scope.row)">查看</el-button> -->
          <el-button slot="reference" type="primary" size="small" @click="update(scope.row)">调整</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 主题展示部分的结束 -->
    <!-- 分页插件的开始 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 分页插件的结束 -->
    <!-- 调整用户签到积分的弹出框开始 -->
    <el-dialog title="调整签到积分" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form">
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="签到积分" :label-width="formLabelWidth">
          <el-input v-model="form.amount" placeholder="请输入签到积分"></el-input>
        </el-form-item>
        <el-form-item label="操作类型" :label-width="formLabelWidth">
          <el-radio-group v-model="form.action">
            <el-radio :label="'increase'">增加</el-radio>
            <el-radio :label="'subtract'" :disabled="isSubstract">扣除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input v-model="form.remark" type="textarea" placeholder="调整签到积分说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 调整用户签到积分的弹出框结束 -->
  </div>
</template>
<script>
import { getRecordList } from "@/api/sign/record";
import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
// import { mapGetters, mapMutations } from "vuex";
export default {
  //数据模块
  data() {
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      appId: "dudu",
      //输入框绑定的数据
      phone: "",
      //主体展示部分的数据
      list: [],
      //是否显示加载中动画的字段
      listLoading: false,
      //总条数
      total: null,
      //控制调整积分弹出框的字段
      dialogFormVisible: false,
      //弹出框绑定的数据
      form: {
        appId: "",
        amount: "",
        phone: "",
        action: "increase",
        remark: ""
      },
      //弹出框的宽度数据
      formLabelWidth: '75px',
      //弹出框的参数
      isSubstract: false,
      //APP下啦框的参数
      AppList: [{
          appId: 'dudu',
          appName: '嘟嘟'
        }, {
          appId: 'dingdang',
          appName: '叮当'
        }, {
          appId: 'jytx',
          appName: '佳缘通讯'
        }, {
          appId: 'dongdong',
          appName: '东东商城'
        }, {
          appId: 'huihui',
          appName: '慧惠商城'
        }],
      
    };
  },
  //生命周期函数
  created() {
    //在生命周期函数里面调用接口获取数据来渲染页面
    /**
     * 1.调用接口
     */
    this.getList();
    // var test = window.location.href;
    
  },
  //方法模块_
  methods: {
    async getList() {
      this.listLoading = true;
      let postData = {
        appId: this.appId,
        ...this.listQuery
      };
      // const res = await getRecordList(postData);

      const res = await getRecordList(postData);
      //获取到数据之后把数据赋值给list
      this.list = res.data.records;
      console.log(res,123);
      // console.log(1);
      //总条数
      this.total = res.data.total;
      this.listLoading = false;
    },
    // 搜索按钮的事件
   async search() {
      // console.log(1)
      // if(this.phone!=''){
        //非空判断,如果不为空的话就跳转页面
           let postData = {
        appId: this.appId,
        phone:this.phone
      };
      // const res = await getRecordList(postData);
    // console.log(postData)
      let res = await getRecordList(postData);
      //获取到数据之后把数据赋值给list
      this.list = res.data.records;
      console.log(res,123);
      // console.log(1);
      //总条数
      this.total = res.data.total;
      //点击搜索之后清空搜索栏
      // this.phone = '';
      // }
    },
    // //点击查看按钮根据账号拿到当前点击的账号去到详情页
    // goDetail(item) {
    //   // console.log(item);
    //   //把获取到的手机号码赋值给绑定好的输入框的值,然后调用search方法
    //   this.phone = item.phone;
    //   // console.log(this.phone);
     
    // },
    //调整用户签到积分事件
    update(row) {
      this.dialogFormVisible = true;
      this.form.phone = row.phone;
    },
    //页码改变事件
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    //下拉框改变事件
    getDataByAppId(){
      this.getList()
    }
  },
  //过滤器模块
  filters: {}
};
</script>
<style lang="">
</style>