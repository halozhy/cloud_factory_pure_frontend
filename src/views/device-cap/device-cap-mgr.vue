<template>
  <div class="app-container">
    <el-button size="small" type="primary" style="margin-bottom: 10px" @click="handleCreate()">
      添加
    </el-button>
    <el-table v-loading="listLoading" :data="listCPs" border fit highlight-current-row style="width: 200%" max-height="400">
      <el-table-column label="ID" prop="id" sortable align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <!-- <span>{{ row.product_name }}</span> -->
      <el-table-column label="产能（件/小时）" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加" :visible.sync="dialogFormVisible" append-to-body>

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 50%; margin-left:50px;">
        <el-form-item label="产品">
          <el-select v-model="temp.product_id" placeholder="请选择">
            <el-option
              v-for="item in product_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产能（件/小时）">
          <el-input-number v-model="temp.num" :min="0" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="更改" :visible.sync="dialogUpdateFormVisible" append-to-body>

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 50%; margin-left:50px;">
        <el-form-item label="产品">
          <el-select v-model="temp.product_id" placeholder="请选择">
            <el-option
              v-for="item in product_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产能（件/小时）">
          <el-input-number v-model="temp.num" :min="0" />
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import jsCookie from 'js-cookie'

export default {
  name: 'DeviceCapMgr',
  directives: { waves },
  props: { deviceId: { type: Number, required: true }},
  data() {
    return {
      device_id: '',
      product_all: [{
        id: '0',
        name: 'test'
      }],
      user_id: '',
      user_type: '',
      tableKey: 0,
      list: null,
      listRentable: [],
      listCPs: [],
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
      dialogRentFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogConfirmRentFormVisible: false,
      rentConfirm: { expireTime: '' },
      expireTime: '',
      pickerOptions: {},
      selectedRentDeviceId: '',
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {
    deviceId: {
      handler(newVal) {
        // alert('call---'+newVal.questionId);
        // alert('call---'+newVal);
        // alert('---call----' + newVal)
        this.deviceId = newVal
        this.listCPs = []
        this.getList()
        // TODO
      },
      deep: true,
      immediate: true
    }},
  mounted() {
    // alert(this.deviceId)
  },
  created() {
    // alert(this.deviceId)
    this.user_id = jsCookie.get('userId')
    this.user_type = jsCookie.get('type')
    this.getList()
    this.pickerOptions = {
      disabledDate(time) {
        return time.getTime() <= new Date().getTime()
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.list = response.data.items
      this.listQuery.user_id = this.user_id
      this.$axios.get('/api/dc/list_by_device_id', { params: { 'deviceId': this.deviceId }}).then(r => {
        this.listCPs = r.data
        // this.list = this.temp
        console.log(r.data)
        // this.total = r.data.count
        this.listLoading = false
      })
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
    resetTemp() {
      this.temp = {
        device_id: '',
        num: '',
        product_id: '',
        product_name: ''
      }
    },
    handleCreate() {
      this.$axios.get('api/prod/list_all').then(r => {
        this.product_all = r.data
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    createData() {
      this.temp.user_id = this.user_id
      this.temp.device_id = this.deviceId
      console.log(this.temp)
      this.$axios.post('/api/dc/add', this.temp).then(r => {
        console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -5) {
          this.$message.error('已存在此产品的产能配置，请使用修改')
        } else if (r.data === 0) {
          this.$message.success('添加成功')
          this.dialogFormVisible = false
          this.handleReFresh()
        }
      })
      console.log(this.temp)
    },
    handleUpdate(row) {
      this.$axios.get('api/prod/list_all').then(r => {
        // console.log(r.data)
        this.product_all = r.data
        this.temp = Object.assign({}, row) // copy obj
        console.log(this.temp)
        this.dialogUpdateFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.temp.user_id = this.user_id
      this.$axios.post('/api/dc/update', this.temp).then(r => {
        // console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -5) {
          this.$message.error('已存在此产品的产能配置，请使用其对应的修改')
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
      this.$confirm('此操作将删除该产能配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/dc/delete', { params: {
          id: row.id
        }}).then(r => {
          // 0 ok
          if (r.data === 0) {
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
    handleListRent() {
      this.$axios.get('api/device/list_rentable').then(r => {
        this.dialogRentFormVisible = true
        this.listRentable = r.data
        console.log(r.data)
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      })
    },
    handleRent(row) {
      this.selectedRentDeviceId = row.id
      this.dialogConfirmRentFormVisible = true
    },
    rentDevice() {
      var info = { 'device_id': this.selectedRentDeviceId,
        'user_id': this.user_id,
        'expire_time': this.expireTime }
      this.$axios.post('api/device/rent_device', info).then(r => {
        this.dialogRentFormVisible = true
        this.listRentable = r.data
        console.log(r.data)
        if (r.data === 0) {
          this.$message.success('租用成功')
          this.dialogConfirmRentFormVisible = false
          this.dialogRentFormVisible = false
          this.handleReFresh()
        } else {
          this.$message.error('租用失败')
        }
      })
    },
    handleDisRent(row) {
      var info = { 'device_id': row.id,
        'user_id': this.user_id }
      this.$axios.post('api/device/dis_rent_device', info).then(r => {
        this.listRentable = r.data
        console.log(r.data)
        if (r.data === 0) {
          this.$message.success('解租成功')
          this.handleReFresh()
        } else if (r.data === -7) {
          this.$message.error('解租失败，设备仍在生产中')
        } else {
          this.$message.error('解租失败')
        }
      })
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
<style lang="scss" scoped>
.pub_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
        margin: 0 auto !important;
        height: 90%;
        overflow: hidden;
        .el-dialog__body {
            position: absolute;
            left: 0;
            top: 54px;
            bottom: 0;
            right: 0;
            padding: 0;
            z-index: 1;
            overflow: hidden;
            overflow-y: auto;
        }
    }
}
</style>
