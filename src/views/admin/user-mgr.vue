<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 1rem">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 150px; margin-left:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="真实姓名" style="width: 150px; margin-left:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left:10px;" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReFresh">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>
    <div class="filter-container-1" style="margin-bottom: 1rem;">
      <el-row gutter="10">
        <el-col :span="8">
          <el-input v-model="listQuery.id" placeholder="ID" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.username" placeholder="用户名" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.name" placeholder="真实姓名" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
      </el-row>
      <el-row style="margin-top:1rem; margin-left:0px">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReFresh">
          重置
        </el-button>
        <el-button class="filter-item" type="primary" style="float:right;" icon="el-icon-plus" @click="handleCreate">
          添加
        </el-button>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <template slot="empty">
        暂无数据
      </template>
      <el-table-column label="ID" prop="id" sortable align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
          <!-- <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.name | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120px" align="center">
        <template slot-scope="{row}">

          <el-tag>{{ row.type }}</el-tag>
          <!-- <span>{{ row.type }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="工厂ID" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fac_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工厂名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fac_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工厂描述" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fac_describe }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            更改
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="overflow:scroll" @pagination="getList" />

    <el-dialog title="添加" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="temp.password"
            show-password
          />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.contact" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="temp.type">
            <el-radio :label="1">云工厂管理员</el-radio>
            <el-radio :label="2">经销商</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="temp.type == 1">
          <el-form-item label="工厂名称">
            <el-input v-model="temp.fac_name" />
          </el-form-item>
          <el-form-item label="工厂描述">
            <el-input v-model="temp.fac_describe" />
          </el-form-item>
        </div>
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="更改" :visible.sync="dialogUpdateFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="temp.password"
            show-password
          />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.contact" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="temp.type" disabled />
        </el-form-item>
        <div v-if="temp.type == '云工厂管理员'">
          <el-form-item label="工厂名称">
            <el-input v-model="temp.fac_name" />
          </el-form-item>
          <el-form-item label="工厂描述">
            <el-input v-model="temp.fac_describe" />
          </el-form-item>
        </div>
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import 'element-ui/lib/theme-chalk/display.css'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserMgr',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        name: '',
        username: '',
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        username: '',
        password: '',
        name: '',
        contact: '',
        type: 1,
        fac_name: '',
        fac_describe: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更改',
        create: '添加'
      },
      dialogPvVisible: false,
      dialogUpdateFormVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.list = response.data.items
      var d = {"data":[{"id":1,"username":"admin111","password":"admin","name":"admin2","contact":"admin3","type":"超级管理员","fac_id":null,"fac_name":null,"fac_describe":null},{"id":12,"username":"113","password":"12","name":"name","contact":"con","type":"云工厂管理员","fac_id":22,"fac_name":"fac_name223","fac_describe":"asff"},{"id":13,"username":"11","password":"22","name":"name","contact":"con","type":"经销商","fac_id":null,"fac_name":null,"fac_describe":null},{"id":14,"username":"114","password":"22","name":"name","contact":"con","type":"云工厂管理员","fac_id":23,"fac_name":"fac_name23","fac_describe":"desc"},{"id":20,"username":"acco","password":"pass","name":"name","contact":"contact","type":"云工厂管理员","fac_id":28,"fac_name":"fac_name","fac_describe":"desc"},{"id":21,"username":"account","password":"pass","name":"name","contact":"contact","type":"云工厂管理员","fac_id":29,"fac_name":"facname","fac_describe":"desc"},{"id":22,"username":"1141","password":"22","name":"name","contact":"con","type":"云工厂管理员","fac_id":30,"fac_name":"fac_name","fac_describe":"desc"},{"id":23,"username":"name123","password":"123","name":"1233","contact":"fdas1","type":"云工厂管理员","fac_id":34,"fac_name":"fac_name11","fac_describe":"123"},{"id":31,"username":"45","password":"435","name":"44","contact":"44","type":"云工厂管理员","fac_id":1,"fac_name":"测试工厂","fac_describe":"测试工厂描述"},{"id":32,"username":"23","password":"2345","name":"4235","contact":"2345","type":"云工厂管理员","fac_id":42,"fac_name":"2435","fac_describe":"34252"},{"id":33,"username":"sad","password":"asd","name":"asd","contact":"sad1","type":"经销商","fac_id":null,"fac_name":null,"fac_describe":null},{"id":34,"username":"dsftest","password":"sd","name":"dsag","contact":"asdf","type":"经销商","fac_id":null,"fac_name":null,"fac_describe":null},{"id":42,"username":"1131","password":"113","name":"name","contact":"con","type":"云工厂管理员","fac_id":46,"fac_name":"adsf","fac_describe":"detail"},{"id":43,"username":"admin1","password":"admin","name":"admin","contact":"admin","type":"经销商","fac_id":null,"fac_name":null,"fac_describe":null},{"id":46,"username":"张岩","password":"123","name":"张岩","contact":"123","type":"经销商","fac_id":null,"fac_name":null,"fac_describe":null}],"count":15}
      this.list = d.data

        // this.list = this.temp
        // console.log(r.data)
        this.total = d.count
        this.listLoading = false
      // this.$axios.post('/api/user/list', this.listQuery).then(r => {
      //   this.list = r.data.data

      //   // this.list = this.temp
      //   console.log(r.data)
      //   this.total = r.data.count
      //   this.listLoading = false
      // })
      // this.$axios.get('/api/user/count').then(r => {
      //   // this.total = r.data
      // })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    // sortChange(data) {
    // const { prop, order } = data
    // console.log(prop, order)
    // if (prop === 'id') {
    //   this.sortByID(order)
    // }
    // },
    // sortByID(order) {
    // if (order === 'ascending') {
    //   this.listQuery.sort = '+id'
    // } else {
    //   this.listQuery.sort = '-id'
    // }
    // this.handleFilter()
    // },
    resetTemp() {
      this.temp = {
        username: '',
        password: '',
        name: '',
        contact: '',
        type: 1,
        fac_name: '',
        fac_describe: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$axios.post('/api/user/add', this.temp).then(r => {
        // console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -1) {
          this.$message.error('用户名重复')
        } else if (r.data === 0) {
          this.$message.success('添加成功')
          this.dialogFormVisible = false
          this.handleReFresh()
        }
      })
      
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      // this.temp.author = 'vue-element-admin'
      // createArticle(this.temp).then(() => {
      //   this.list.unshift(this.temp)
      //   this.dialogFormVisible = false
      //   this.$notify({
      //     title: 'Success',
      //     message: 'Created Successfully',
      //     type: 'success',
      //     duration: 2000
      //   })
      // })
      //   }
      // })
      console.log(this.temp)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // if (row.type === '云工厂管理员') {
      //   this.temp.type = 1
      // } else if (row.type === '经销商') {
      //   this.temp.type = 2
      // }

      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      this.dialogUpdateFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$axios.post('/api/user/update', this.temp).then(r => {
        // console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -1) {
          this.$message.error('无此用户')
        } else if (r.data === 0) {
          this.$message.success('更改成功')
          this.dialogUpdateFormVisible = false
          this.handleReFresh()
        }
      })
      // this.$message.info('he')
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      // updateArticle(tempData).then(() => {
      //   const index = this.list.findIndex(v => v.id === this.temp.id)
      //   this.list.splice(index, 1, this.temp)
      //   this.dialogFormVisible = false
      //   this.$notify({
      //     title: 'Success',
      //     message: 'Update Successfully',
      //     type: 'success',
      //     duration: 2000
      //   })
      // })
      //   }
      // })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/user/delete', { params: {
          uId: row.id
        }}).then(r => {
          // 0 ok -1 此用户下仍有未完成的订单 -2 无此用户
          if (r.data === -2) {
            this.$message.error('无此用户')
          } else if (r.data === -1) {
            this.$message.error('无法删除，此用户下仍有未完成的订单')
          } else if (r.data === 0) {
            this.$message.success('删除成功')
            this.handleReFresh()
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
      // this.list.splice(index, 1)
    },
    handleReFresh() {
      this.listQuery.id = null
      this.listQuery.username = null
      this.listQuery.name = null
      // this.listQuery.page = 1
      this.getList()
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
  }
}
</script>

<style scoped>
.filter-container-1 {
    display: none;
  }
@media screen and (max-width: 820px) {
  .filter-container {
    display: none;
  }
  .filter-container-1 {
    display: block;
  }
}
</style>
