<template>
  <div style="padding: 10px;">
    <!-- 顶部搜索框开始 -->
    <div style="margin-bottom:10px;">
          <!--APPID 下拉框 -->
       <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto; margin-left: 5px;">
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
      <div style="width:390px;display:inline-block;margin-bottom:10px; margin-right: 5px;">
          <el-date-picker 
            v-model="time" 
            type="datetimerange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期"
            @change="selectTime">
          </el-date-picker>
      </div> 
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <!-- <el-button type="success" @click="getAllList">后退</el-button> -->
    </div>
    <!-- 顶部搜索框结束 -->
    <!--主体展示部分的开始 -->
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
      <el-table-column align="center" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.createTime | fitlerTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分使用记录">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button slot="reference" type="primary" size="small" @click="getList(scope.row)">查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!--主体展示部分的结束 -->
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
  </div>
</template>
<script>
//引入时间戳转换方法
import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
import { getRecordDetail } from "@/api/sign/detail";
export default {
  //数据模块
  data() {
    return {
      appId: "dudu",
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      //输入框绑定的数据
      phone: "",
      //主体展示部分的数据
      list: [],
      //接收传过来的数据
      query: this.$route.query,
      //是否显示加载中动画的字段
      listLoading: false,
      //总条数
      total: null,
      startTime: '',
      endTime: '',
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
      time: ''
    };
  },
  //生命周期函数
  created() {
    
    //如果一进来页面的时候,页面上没有数据的话就获取全部的数据,如果有数据的话就不用获取
    
      // this.getAllList();
    
    // this.getAllList();
      //在生命周期函数里面调用接口获取数据来渲染页面
    // console.log(this.query)
 
       this.getAllList();
      //  this.getList();
      // console.log(this.list)

    
    
   
  },
  //方法模块
  methods: {
    //获取页面上展示的数据
    /**
     * 1.获取到从用户签到页面传过来的数据,然后在接口中传入获取的参数获取到数据
     * 2.把接口返回的数据赋值到定义好的字段
     * 3.关闭加载中的动画
     */
    // async getList(data) {
    //   //获取传递过来的数据
    //   let postData = {
    //     appId:data.appId,
    //     phone:data.phone
    //   };
    //   // console.log(data)
    //   //调用接口并传入获取过来的数据
    //   let res = await getRecordDetail(postData);
      
    //   // console.log(1);
    //   //获取到数据之后把数据赋值给list
    //   this.list = res.data.records;
    //   // console.log(this.list,1)
    //   //总条数
    //   this.total = res.data.total;
    // },
    //搜索按钮的方法
    async search() {
      //如果搜索框不为空的话,就获取搜索框的内容然后调用接口搜索用户信息
      // if (this.phone != "") {
        let postData = {
          appId: this.appId,
          phone: this.phone,
           ...this.listQuery,
           startTime: this.startTime,
           endTime: this.endTime
        };
        console.log(postData);
        let res = await getRecordDetail(postData);
        // console.log(1);
        // console.log(res);
        //获取到数据之后把数据赋值给list
        this.list = res.data.records;
        //总条数
        this.total = res.data.total;
      // }
    },
    //一开始进来页面上获取所有数据的方法
    async getAllList() {
      this.listLoading = true;
      let postData = {
        appId: this.appId,
        phone: this.phone,
        ...this.listQuery,
       startTime: this.startTime,
        endTime: this.endTime
      };

      let res = await getRecordDetail(postData);
      // console.log(1);
      
      //获取到数据之后把数据赋值给list
      this.list = res.data.records;
      
      //总条数
      this.total = res.data.total;
      this.listLoading = false;
    },

    //页码改变事件
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getAllList();
      // console.log(1)
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getAllList();
      // console.log(2)
    },
       //下拉框改变事件
    getDataByAppId(){
      this.search();
    },
    // 时间段查询
    selectTime(res){
        console.log(res)
        if(res){
            this.time = [];
            this.startTime = formartTime(res[0], 5);
            this.endTime = formartTime(res[1], 5);
            this.time.push(formartTime(res[0], 5));
            this.time.push(formartTime(res[1], 5));
        }else {
            this.startTime = null;
            this.endTime = null;
        }
    },
  },

  //过滤器模块
  filters: {
    //时间戳转换方法
    fitlerTime(value) {
      return formartTime(new Date(value), 5);
    }
  }
};
</script>
<style lang="">
</style>