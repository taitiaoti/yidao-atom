<template>
    <!-- 油站规格管理 -->
  <div class="app-container calendar-list-container">
      <div class="filter-container">
            <el-input v-model="speName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加规格名称" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="addSpecifications" v-if='gasStationSpecifications'>添加</el-button>
      </div>

      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="序号">
          <template scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="规格名称">
          <template scope="scope">
            <span>{{ scope.row.speName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可选项">
          <template scope="scope">
            <span v-for="(item,index) in scope.row.speValueList" :key="index">
              <span>{{ item }}，</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作"  v-if='role_updateSpecifications'>
          <template scope="scope">
            <el-button type="primary" size="small" @click="updateSpecifications(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 添加编辑模态  -->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        width="30%"
        :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="规格名称" prop="name">
            <el-select placeholder="选择规格名称" style="width:280px;" v-model="form.name" @change='addSpeName'>
              <el-option
                v-for="item in speData"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDomain" type="primary">增加可选项</el-button>
          </el-form-item>
          <div class="title">
            <span>可选项</span>
          </div>
          <el-form-item v-for="(item, index) in domains" :key="index">
            <el-input v-model="domains[index]"></el-input>
            <el-button type="danger" style="margin-left:10px" @click="removeDomain(item, index)">删除</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog_footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createForm('form')">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')">修 改</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { mapGetters } from 'vuex';
import { querySpecificationsList, delSpecifications, updateSpecifications, addSpecifications } from '@/api/franchisee/index';
export default {
    data(){
        return {
            speName: '',              //规格名称
            listLoading: false,
            dialogFormVisible: false,
            userId: '',
            dialogStatus: '',
            total: 0,
            //页码和条数
            listQuery: {
              page: 1,
              limit: 10
            },
            textMap: {
              update: "编辑",
              create: "创建"
            },
            form: {
              name: '',         //规格名称
              speKey: ''        //规格key
            },
            rules: {
              name: [
                { required: true, message: '请输入规格名称', trigger: 'blur' }
              ]
            },
            speData: [
              { label: '类别', value: 'oilType'},
              { label: '油号', value: 'oilNo'},
              { label: '枪号', value: 'gunNoList'}
            ],
            // 可选项
            domains: [''],
            list: [],
            gasStationSpecifications: false,
            role_updateSpecifications: false
        }
    },
    computed: {
        ...mapGetters(['permissions'])
    },
    created(){
      let userInfo = getStore({name: 'userInfo'});
      this.userId = userInfo.userId;
      this.gasStationSpecifications = this.permissions['gasStationSpecifications'];
      this.role_updateSpecifications = this.permissions['updateSpecifications'];
      this.getList();
    },
    methods:{
        // 搜索
        search(){
          this.getList();
        },
        // 获取展示数据
        getList(){
          this.listLoading = true;
          let postData = {
            ...this.listQuery,
            userId: this.userId,
            speName: this.speName
          }
          querySpecificationsList(postData).then((res)=>{
            console.log(res,'规格列表')
            this.list = res.data.records;
            this.total = res.data.total;
            this.listLoading = false;
          })
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
        // 选择规格名
        addSpeName(e){
          let text;
          switch(e) {
            case '类别':
              text = 'oilType';
              break;
            case '油号':
              text = 'oilNo';
              break;
            case '枪号':
              text = 'gunNoList';
              break;
            return text;
          }
          this.form.speKey = text;
        },
        // 添加规格
        addSpecifications(){
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        },
        // 编辑规格
        updateSpecifications(e){
          let obj = JSON.parse(JSON.stringify(e))
          this.form.name = obj.speName;
          this.form.speKey = obj.speKey;
          this.domains = obj.speValueList;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        },
        // 确定添加
        createForm(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
              console.log(this.domains)
              let postData = {
                userId: this.userId,
                speName: this.form.name,
                speKey: this.form.speKey,
                speValueArr: this.domains
              }
              addSpecifications(postData).then((res)=>{
                console.log(res,'新增规格')
                this.$notify({
                  title: res.data.code == 0 ? '成功' : '失败',
                  message: res.data.msg,
                  type:  res.data.code == 0 ? 'success' : 'error',
                  duration: 2000
                });
                if(res.data.code == 0){
                  this.getList();
                  this.handleClose();
                }
              })
            }else{
              return false;
            }
          })
        },
        // 确定修改
        update(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
              console.log(this.domains)
              let postData = {
                userId: this.userId,
                speName: this.form.name,
                speKey: this.form.speKey,
                speValueArr: this.domains
              }
              updateSpecifications(postData).then((res)=>{
                console.log(res,'修改规格')
                this.$notify({
                  title: res.data.code == 0 ? '成功' : '失败',
                  message: res.data.msg,
                  type:  res.data.code == 0 ? 'success' : 'error',
                  duration: 2000
                });
                if(res.data.code == 0){
                  this.getList();
                  this.handleClose();
                }
              })
            }else{
              return false;
            }
          })
        },
        // 增加可选项
        addDomain(){
          this.domains.push('')
        },
        // 删除可选项
        removeDomain(item, index){
          this.$alert('是否删除规格？', '删除', {
            confirmButtonText: '确定',
            callback: action => {
              if(action == 'confirm'){   
                this.domains.splice(index, 1);
              //   delValProperty(item.id).then(res => {
              //     this.getList();
              //     this.$notify({
              //       title: "成功",
              //       message: "删除成功",
              //       type: "success",
              //       duration: 1500
              //     });
              //   });
              }
            }
          });
        },
        // 取消添加修改
        handleClose(){
          this.dialogFormVisible = false;
          this.form.name = '';
          this.domains = [''];
        }
    }
}
</script>

<style lang='scss' scoped>
  .title {
    width: 50%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    padding-left: 100px;
  }
  .el-input{
    width: 280px;
  }
</style>