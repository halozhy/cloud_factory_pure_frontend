<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 1rem">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.describe" placeholder="设备描述" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-col :span="8">
          <el-input v-model="listQuery.id" placeholder="ID" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.username" placeholder="设备名称" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.name" placeholder="设备描述" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="ID" prop="id" sortable align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备描述" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备规格" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.spec }}</span>
          <!-- <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.name | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="设备状态" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属部门" width="120px" align="center">
        <template slot-scope="{row}">

          <el-tag>{{ row.dept_name }}</el-tag>
          <!-- <span>{{ row.type }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="租用状态" width="110px" align="center">
        <template slot-scope="{row}">

          <el-button v-if="row.rent_rec_id != null " @click="showRentInfo(row)">已租用</el-button>
          <span v-else-if="row.dept_name ==='自有' ">工厂自有</span>
          <el-button v-else @click="showRentInfo(row)">未租用</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.state === '关机'" size="mini" type="" @click="handleOpen(row)">
            开机
          </el-button>
          <el-button v-if="row.state === '闲置' || row.state === '开机' " size="mini" type="" @click="handleShutdown(row,$index)">
            关机
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            更改
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button v-if="row.rent_rec_id != null && row.dept_name ==='中心'" size="mini" @click="handleRecycle(row)">
            收回
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleConfCap(row,$index)">
            产能
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination class="filter-container" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    <pagination class="filter-container-1" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="overflow:scroll" @pagination="getList"/>

    <el-dialog title="添加" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="addrules" :model="temp" label-position="left">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="设备描述" prop="describe">
          <el-input v-model="temp.describe" />
        </el-form-item>
        <el-form-item label="设备规格" prop="spec">
          <el-input v-model="temp.spec" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type_id">
          <el-select v-model="temp.type_id" placeholder="请选择">
            <el-option
              v-for="item in device_type_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-radio-group v-model="temp.dept_name">
            <el-radio v-if="user_type === '云工厂管理员'" label="自有">自有</el-radio>
            <el-radio v-if="user_type === '超级管理员'" label="中心">中心</el-radio>
          </el-radio-group>
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

      <el-form ref="dataForm" :rules="addrules" :model="temp" label-position="left">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="设备描述" prop="describe">
          <el-input v-model="temp.describe" />
        </el-form-item>
        <el-form-item label="设备规格" prop="spec">
          <el-input v-model="temp.spec" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type_id">
          <el-select v-model="temp.type_id" placeholder="请选择">
            <el-option
              v-for="item in device_type_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-radio-group v-model="temp.dept_name">
            <el-radio :label="temp.dept_name">{{ temp.dept_name }}</el-radio>

          </el-radio-group>
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

    <el-dialog :visible.sync="dialogShowRentInfo" title="租用记录">
      <el-table :data="rentData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column prop="rent_time" label="租用时间" min-width="160" />
        <el-table-column prop="expire_time" label="过期时间" min-width="160"/>
        <el-table-column prop="recycle_time" label="收回时间" min-width="160"/>
        <el-table-column prop="factory_id" label="租用工厂ID" min-width="100"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShowRentInfo = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="配置产能" :visible.sync="dialogConfCapVisible" top="15vh">

      <DeviceCapMgr :device-id="selectedRow.id" />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfCapVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div> -->
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import jsCookie from 'js-cookie'
import DeviceCapMgr from '../../device-cap/device-cap-mgr'

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
  name: 'DeviceMgr',
  components: { Pagination, DeviceCapMgr },
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
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (flag.test(value)) {
        callback(new Error('不能输入特殊字符'))
        console.log(value)
      } else if (value.length > 10) {
        callback(new Error('输入不能超过10个字符'))
      } else {
        callback()
      }
    }
    return {
      device_type_all: [{
        id: '0',
        name: 'test'
      }],
      user_id: '',
      user_type: '',
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
      dialogConfCapVisible: false,
      dialogShowRentInfo: false,
      selectedRow: '',
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      addrules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入设备描述', trigger: 'blur' }
        ],
        spec: [
          { required: true, message: '请输入设备规格', trigger: 'blur' }
        ],
        type_id: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.user_id = jsCookie.get('userId')
    this.user_type = jsCookie.get('type')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.list = response.data.items

      this.$axios.post('/api/device/list', this.listQuery).then(r => {
        if (r.data.data.length === 0) {
          this.$message.error('未查询到设备信息')
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
        id: '',
        name: '',
        spec: '',
        describe: '',
        state: '',
        dept_name: '',
        type_id: '',
        type_name: '',
        fac_id: '',
        fac_name: '',
        rent_rec_id: ''
      }
    },
    handleCreate() {
      this.$axios.get('api/device_type/list_all').then(r => {
        // console.log(r.data)
        this.device_type_all = r.data
      })
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if (this.user_type === '云工厂管理员') {
        this.temp.dept_name = '自有'
      } else if (this.user_type === '超级管理员') {
        this.temp.dept_name = '中心'
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
              this.$message.error('设备名重复')
              return
            }
            this.temp.user_id = this.user_id
            this.$axios.post('/api/device/add', this.temp).then(r => {
              console.log(r)
              if (r.data === -2) {
                this.$message.error('表单未填写完整')
              } else if (r.data === -1) {
                this.$message.error('设备类型id错误')
              } else if (r.data === -3) {
                this.$message.error('用户id不正确')
              } else if (r.data === -4) {
                this.$message.error('权限错误')
              } else if (r.data === 0) {
                this.$message.success('添加成功')
                this.dialogFormVisible = false
                this.handleReFresh()
              }
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.$axios.get('api/device/can_update', { params: { dId: row.id }}).then(r => {
        if (r.data !== 0) {
          if (r.data === -1) {
            this.$message.error('设备被租用，无法修改')
          } else if (r.data === -2) {
            this.$message.error('设备在生产中，无法修改')
          }
        } else {
          this.$axios.get('api/device_type/list_all').then(r => {
            // console.log(r.data)
            this.device_type_all = r.data
            this.temp = Object.assign({}, row) // copy obj
            console.log(this.temp)
            this.dialogUpdateFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
              this.$message.error('设备名重复')
              return
            }
            this.temp.user_id = this.user_id
            this.$axios.post('/api/device/update', this.temp).then(r => {
              // console.log(r)
              if (r.data === -2) {
                this.$message.error('表单未填写完整')
              } else if (r.data === -1) {
                this.$message.error('无此设备')
              } else if (r.data === -3) {
                this.$message.error('设备类型id错误')
              } else if (r.data === -4) {
                this.$message.error('设备被租用，无法修改')
              } else if (r.data === 0) {
                this.$message.success('更改成功')
                this.dialogUpdateFormVisible = false
                this.handleReFresh()
              }
            })
          }
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/device/delete', { params: {
          dId: row.id
        }}).then(r => {
          // 0 ok -1 此设备下仍有未完成的订单 -2 无此设备
          if (r.data === -2) {
            this.$message.error('无此设备')
          } else if (r.data === -1) {
            this.$message.error('设备仍在开机生产中，无法删除')
          } else if (r.data === -3) {
            this.$message.error('设备被租用，无法删除')
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
      this.listQuery.name = null
      this.listQuery.describe = null
      // this.listQuery.page = 1
      this.getList()
    },
    handleOpen(row) {
      // alert(row.id)
      this.$axios.post('/api/device/open', { id: row.id }).then(r => {
        if (r.data === -2) {
          this.$message.error('此设备已是闲置状态')
        } else if (r.data === -1) {
          this.$message.error('无此设备')
        } else if (r.data === 0) {
          this.$message.success('开机成功')
          this.handleReFresh()
        }
      })
    },
    handleShutdown(row, index) {
      // alert(row.id)
      this.$axios.post('/api/device/shutdown', { id: row.id }).then(r => {
        if (r.data === -2) {
          this.$message.error('此设备已关机')
        } else if (r.data === -1) {
          this.$message.error('无此设备')
        } else if (r.data === -3) {
          this.$message.error('无法关机，设备仍有排产计划')
        } else if (r.data === 0) {
          this.$message.success('关机成功')
          this.handleReFresh()
        }
      })
    },
    handleRecycle(row) {
      var info = { 'device_id': row.id,
        'user_id': this.user_id }
      this.$axios.post('api/device/recycle_device', info).then(r => {
        this.listRentable = r.data
        console.log(r.data)
        if (r.data === 0) {
          this.$message.success('收回成功')
          this.handleReFresh()
        } else if (r.data === -5) {
          this.$message.error('收回失败，设备仍在生产中')
        } else if (r.data === -6) {
          this.$message.error('收回失败，设备未到期')
        } else {
          this.$message.error('收回失败')
        }
      })
    },
    handleConfCap(row) {
      this.selectedRow = row
      this.dialogConfCapVisible = true
      console.log(this.selectedRow)
    },
    showRentInfo(row) {
      this.$axios.get('api/rr/list_by_device_id', { params: { 'deviceId': row.id }}).then(r => {
        this.rentData = r.data
        this.dialogShowRentInfo = true
      })
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
