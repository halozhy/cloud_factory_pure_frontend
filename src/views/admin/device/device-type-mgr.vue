<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 1rem">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="类型名称" style="width: 150px;margin-left: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReFresh">
        重置
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>
    <div class="filter-container-1" style="margin-bottom: 1rem;">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input v-model="listQuery.id" placeholder="ID" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="12">
          <el-input v-model="listQuery.name" placeholder="类型名称" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="设备类型名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
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

    <pagination class="filter-container" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <pagination class="filter-container-1" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="overflow:scroll" @pagination="getList" />
    <el-dialog title="添加" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="">
        <el-form-item label="设备类型名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
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

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="">
        <el-form-item label="设备类型名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
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
  name: 'ProductTypeMgr',
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
    var validatePass = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('输入不能为空'));
      }
      var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (flag.test(value)) {
        callback(new Error('不能输入特殊字符'));
        console.log(value)
      } else if (value.length>10) {
        callback(new Error('输入不能超过10个字符'));
      }
      //   callback(new Error('请输入数字值'));
      // } else {
      //   if (value < 18) {
      //     callback(new Error('必须年满18岁'));
      //   } else {
      //     callback();
      //   }
      // }
    };
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        name: '',
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
        name: ''
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
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // name: [{ required: true, message: 'pas is required', trigger: 'blur' }],
        name: [
          { validator: validatePass, trigger: 'blur' }
        ]
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

      this.$axios.post('/api/device_type/list', this.listQuery).then(r => {
        if (r.data.data.length === 0){
          this.$message.error('无此设备类型信息，请重新输入');
        }
        this.list = r.data.data

        // this.list = this.temp
        console.log(r.data)
        this.total = r.data.count
        this.listLoading = false
      })
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
        name: ''
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
      var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (flag.test(this.temp.name)) {
        this.$message.error('不能输入特殊字符，请重新输入！')
      } else {
        var flag1 = 0
        for (let index = 0; index < this.list.length; index++) {
          const element = this.list[index]
          if (element.name == this.temp.name) {
            flag1 = 1
          }
        }
        if (flag1 == 1) {
          this.$message.error('设备类型名重复')
          return
        }
        this.$axios.post('/api/device_type/add', this.temp).then(r => {
          // console.log(r)
          if (r.data === -2) {
            this.$message.error('表单未填写完整')
          } else if (r.data === 0) {
            this.$message.success('添加成功')
            this.dialogFormVisible = false
            this.handleReFresh()
          }
        })
      }
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
      var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (flag.test(this.temp.name)) {
        this.$message.error('不能输入特殊字符，请重新输入！')
      } else {
        var flag1 = 0
        for (let index = 0; index < this.list.length; index++) {
          const element = this.list[index]
          if (element.name == this.temp.name && element.id != this.temp.id) {
            flag1 = 1
          }
        }
        if (flag1 == 1) {
          this.$message.error('设备类型名重复')
          return
        }
        this.$axios.post('/api/device_type/update', this.temp).then(r => {
          console.log(r)
          if (r.data === -2) {
            this.$message.error('表单未填写完整')
          } else if (r.data === -1) {
            this.$message.error('无此设备类型')
          } else if (r.data === 0) {
            this.$message.success('更改成功')
            this.dialogUpdateFormVisible = false
            this.handleReFresh()
          }
        })
      }

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
      this.$confirm('此操作将删除该设备类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/device_type/delete', { params: {
          dtId: row.id
        }}).then(r => {
          // 0 ok -1 此用户下仍有未完成的订单 -2 无此用户
          if (r.data === -2) {
            this.$message.error('无此设备类型')
          } else if (r.data === -1) {
            this.$message.error('无法删除，此设备类别已关联有设备')
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
