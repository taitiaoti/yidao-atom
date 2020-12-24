<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container search-add">
      <el-button v-if="pro_property_name_add" class="filter-item"  @click="handleCreate" type="primary" icon="edit">添加
      </el-button>
      <el-input placeholder="请输入分类名称" clearable @change="saveSearchValue" v-model="searchValue" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可选项" prop="color">

      </el-table-column>
      <el-table-column align="center" width="50" label="顺序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="pro_property_name_upd" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="pro_property_name_del" size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

      <!--模态  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="分类绑定">
          <div class="block">
            <el-cascader :options="options"  v-model="currCategory"  @change="handleChange"></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="属性名" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">增加可选项</el-button>
        </el-form-item>
        <div class="title">
          <span>可选项</span>
        </div>
        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" :prop="'domains.' + index + '.value'" :rules="{
                     required: true, message: '输入不能为空', trigger: 'blur'}">
          <el-input v-model="domain.value"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createForm('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchListProperty,
  getObjProperty,
  addObjProperty,
  putObjProperty,
  delObjProperty,
  delValProperty
} from "@/api/product/property";
import { fetchCas } from "@/api/product/category";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { mapGetters,mapMutations } from "vuex";

export default {
  name: "table_pro_property_name",
  directives: {
    waves
  },
  data() {
    return {
      value: "",
      options: [],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      form: {
        categoryId: "",
        name: "",
        sort:0,
        propertyValues:[],
        values: []
      },
      rules: {
        // name: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
      },
      dialogFormVisible: false,
      dialogStatus: "",
      pro_property_name_add: false,
      pro_property_name_upd: false,
      pro_property_name_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      selectedOptions: [],
      selectedOptions2: [],
      arr:[],
      currCategory:[],
      searchValue: ''
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    propertyValue(){
      return this.$store.state.goods.propertyValue
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效"
      };
      return statusMap[status];
    }
  },
  created() {
    this.searchValue = this.propertyValue;
    this.getList();
    this.getCategory();
    this.pro_property_name_add = this.permissions["pro_property_name_add"];
    this.pro_property_name_upd = this.permissions["pro_property_name_upd"];
    this.pro_property_name_del = this.permissions["pro_property_name_del"];
  },
  methods: {
    ...mapMutations([
      'SET_PROPERTY'
    ]),
    getList() {
      this.resetForm();
      this.listLoading = true;
      let postData = {
        page:this.listQuery.page,
        limit:this.listQuery.limit,
        categoryName: this.searchValue
      }
      fetchListProperty(postData).then(response => {
        console.log(response,'sdfs')
        this.total = response.data.total;
        response.data.records.forEach((val, index) => {
          val.color = "";
          val.values.forEach(val2 => {
            val.color += val2.value + " ";
          });
        });
        this.listLoading = false;
        this.list = response.data.records;
      });
    },
    saveSearchValue(value){
      this.SET_PROPERTY(value);
    },
    getCategory() {
      fetchCas(null).then(response => {
        this.options = response.data;
      });
    },
    childrenEach(childrenData, depthN) {
      var depth=0;
      for (let j = 0; j < childrenData.length; j++) {

        depth = depthN; // 将执行的层级赋值 到 全局层级
        this.arr[depthN] = childrenData[j].value;
        if (childrenData[j].value == this.currCategory[0]) {
          this.currCategory = this.arr.slice(0, depthN+1); //将目前匹配的数组，截断并保存到结果数组，
          break;
        } else {
          if (childrenData[j].hasOwnProperty("children")) {
            depth ++;
            this.childrenEach(childrenData[j].children, depth);
          }
        }
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleUpdate(row) {
      let tempArr = [];
      row.values.forEach((item, index) => {
        tempArr.push({
          id: item.id,
          value: item.value
        });
      });
      this.form.values = tempArr;
      this.form.name=row.name;
      this.form.id=row.id;
      this.dynamicValidateForm.domains=row.values;
      this.currCategory = [];
      this.currCategory.push(row.categoryId);
      this.form.categoryId=row.categoryId;
      this.form.sort = row.sort;
      console.log(this.currCategory,'this.currCategory');
      this.childrenEach(this.options,0);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;    
    },
    handleDelete(row) {
      this.$alert('请看清楚需要删除的项，避免误删。', '删除商品规格！', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){
            if(row.id){
              delObjProperty(row.id).then(response => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                });
              });
            }else {
              this.$notify({
                title: "失败",
                message: "id为空",
                type: "error",
                duration: 2000
              });
            }
          }
        }
      });
     
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createForm(formName) {
      this.getPropertyValues();
      addObjProperty(this.form).then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        });
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      //this.form.sort=0;
      let tempValues = [];
      this.dynamicValidateForm.domains.forEach((item, index) => {
        tempValues.push({
          id: item.id || null,
          value: item.value
        });
      });
      this.form.values = tempValues;
      putObjProperty(this.form).then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleChange(value) {
      this.form.categoryId = value[value.length - 1];
    },
    removeDomain(item) {
      this.$alert('', '删除商品规格！', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            delValProperty(item.id).then(res => {
               this.getList();
               this.$notify({
                 title: "成功",
                 message: "删除成功",
                 type: "success",
                 duration: 1500
               });
             });
            this.dialogFormVisible = false;
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
              this.dynamicValidateForm.domains.splice(index, 1);
            }
          }
        }
      });
    },
    getPropertyValues(){
      const arr = [];
      this.dynamicValidateForm.domains.forEach(val => {
        arr.push(val.value);
      });
      this.form.propertyValues = arr;
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    resetForm() {
      this.currCategory=[];
      this.dynamicValidateForm={
        domains: [
          {
            value: ""
          }
        ]
      };
      this.form = {
        permission: undefined,
        name: undefined,
        categoryId:undefined,
        parent: this.currentId,
        url: undefined,
        icon: undefined,
        component: undefined,
        type: undefined,
        method: undefined
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.title {
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 100px;
}
.el-input,
.el-cascader,
.el-input-number {
  width: 280px;
}
.search-add{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.filter-item{
  margin-bottom: 0;
  margin-right: 10px;
}
</style>

