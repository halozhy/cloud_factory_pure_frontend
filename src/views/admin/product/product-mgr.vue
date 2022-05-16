<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 1rem">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="产品名称" style="width: 150px;margin-left:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.describe" placeholder="产品描述" style="width: 150px;margin-left:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left:10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReFresh">
        重置
      </el-button>
      <el-button class="filter-item" style="float:right" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>
    <div class="filter-container-1" style="margin-bottom: 1rem;">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input v-model="listQuery.id" placeholder="ID" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.name" placeholder="产品名称" style="" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.describe" placeholder="产品描述" style="" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
      </el-row>
      <el-row style="margin-top:1rem; margin-left:0px">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReFresh">
          重置
        </el-button>
        <el-button class="filter-item" style="float:right" type="primary" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column label="产品名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品描述" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
          <!-- <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.name | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="产品规格" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.spec }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type_name }}</span>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="overflow:auto" @pagination="getList" />

    <el-dialog title="添加" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="产品描述" prop="describe">
          <el-input v-model="temp.describe" />
        </el-form-item>
        <el-form-item label="产品规格" prop="spec">
          <el-input v-model="temp.spec" />
        </el-form-item>
        <el-form-item label="产品类型" prop="type_id">
          <el-select v-model="temp.type_id" placeholder="请选择">
            <el-option
              v-for="item in prod_type_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

      <el-form ref="dataForm2" :rules="rules" :model="temp" label-position="left" label-width="70px" style="">
        <el-form-item label="产品ID">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="产品描述" prop="describe">
          <el-input v-model="temp.describe" />
        </el-form-item>
        <el-form-item label="产品规格" prop="spec">
          <el-input v-model="temp.spec" />
        </el-form-item>
        <el-form-item label="产品类型" prop="type_id">
          <el-select v-model="temp.type_id" placeholder="请选择">
            <el-option
              v-for="item in prod_type_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
  name: 'ProdcutMgr',
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
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入产品名称'))
      } else if (value.length > 10) {
        callback(new Error('产品名称应小于10个字符'))
      } else {
        callback()
      }
    }
    var checkDescribe = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入产品描述'))
      } else if (value.length > 10) {
        callback(new Error('产品描述应小于10个字符'))
      } else {
        callback()
      }
    }
    var checkSpec = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入产品规格'))
      } else if (value.length > 10) {
        callback(new Error('产品规格应小于10个字符'))
      } else {
        callback()
      }
    }
    var checkTypeId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择产品类型'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        name: '',
        describe: '',
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      prod_type_all: [{
        // id: '',
        // name: ''
      }],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        name: '',
        spec: '',
        describe: '',
        type_id: '',
        type_name: ''
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
        name: [{ validator: checkName, trigger: 'blur' }],
        describe: [{ validator: checkDescribe, trigger: 'blur' }],
        spec: [{ validator: checkSpec, trigger: 'blur' }],
        type_id: [{ validator: checkTypeId, trigger: 'blur' }]
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

      this.$axios.post('/api/prod/list', this.listQuery).then(r => {
        this.list = r.data.data
        if (r.data.data.length === 0) {
          this.$message.error('未查询到产品信息')
        }
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
        name: '',
        spec: '',
        describe: '',
        type_id: '',
        type_name: ''
      }
    },
    handleCreate() {
      this.$axios.get('api/prod_type/list_all').then(r => {
        console.log(r.data)
        this.prod_type_all = r.data
      })
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/prod/add', this.temp).then(r => {
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
      })
      // this.$axios.post('/api/prod/add', this.temp).then(r => {
      //   // console.log(r)
      //   if (r.data === -2) {
      //     this.$message.error('表单未填写完整')
      //   } else if (r.data === 0) {
      //     this.$message.success('添加成功')
      //     this.dialogFormVisible = false
      //     this.handleReFresh()
      //   }
      // })
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
      this.$axios.get('api/prod_type/list_all').then(r => {
        console.log(r)
        this.prod_type_all = r.data
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
      })
    },
    updateData() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/prod/update', this.temp).then(r => {
            // console.log(r)
            if (r.data === -4) {
              this.$message.error('此产品处于生产中，类型无法更改')
            } else if (r.data === -2) {
              this.$message.error('表单未填写完整')
            } else if (r.data === -1) {
              this.$message.error('无此产品')
            } else if (r.data === 0) {
              this.$message.success('更改成功')
              this.dialogUpdateFormVisible = false
              this.handleReFresh()
            }
          })
        }
      })

      // this.$axios.post('/api/prod/update', this.temp).then(r => {
      //   // console.log(r)
      //   if (r.data === -4) {
      //     this.$message.error('此产品处于生产中，类型无法更改')
      //   } else if (r.data === -2) {
      //     this.$message.error('表单未填写完整')
      //   } else if (r.data === -1) {
      //     this.$message.error('无此产品')
      //   } else if (r.data === 0) {
      //     this.$message.success('更改成功')
      //     this.dialogUpdateFormVisible = false
      //     this.handleReFresh()
      //   }
      // })
      //
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
      this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/prod/delete', { params: {
          pId: row.id
        }}).then(r => {
          if (r.data === -2) {
            this.$message.error('无此产品')
          } else if (r.data === -1) {
            this.$message.error('无法删除，此产品已经被已有订单使用')
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
      this.listQuery.id = ''
      this.listQuery.name = ''
      this.listQuery.describe = ''
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
  @media screen and (max-width: 825px) {
  .filter-container {
    display: none;
  }
  .filter-container-1 {
    display: block;
  }
}
</style>
