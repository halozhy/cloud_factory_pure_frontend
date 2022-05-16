<template>
  <div class="app-container">
    <el-button size="small" type="primary" style="margin-bottom: 10px" @click="handleCreate()">
      添加
    </el-button>
    <el-button size="small" type="" style="margin-bottom: 10px" @click="handleFinish()">
      完工
    </el-button>
    <el-table v-loading="listLoading" :data="listCPs" border fit highlight-current-row style="width: 200%" max-height="400">
      <el-table-column label="ID" prop="id" sortable align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>
      <!-- <span>{{ row.product_name }}</span> -->
      <el-table-column label="结束时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
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

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" style="width: 50%; margin-left:50px;">
        <el-form-item label="设备" prop="device_id">
          <el-select v-model="temp.device_id" placeholder="请选择">
            <el-option
              v-for="item in device_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择开始时间" prop="start_time">
          <el-date-picker
            v-model="temp.start_time"
            type="datetime"
            placeholder=""
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="选择结束时间" prop="end_time">
          <el-date-picker
            v-model="temp.end_time"
            type="datetime"
            placeholder=""
            :picker-options="pickerOptions"
          />
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
        <el-form-item label="设备" prop="device_id">
          <el-select v-model="temp.device_id" placeholder="请选择">
            <el-option
              v-for="item in device_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择开始时间" prop="start_time">
          <el-date-picker
            v-model="temp.start_time"
            type="datetime"
            placeholder=""
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="选择结束时间" prop="end_time">
          <el-date-picker
            v-model="temp.end_time"
            type="datetime"
            placeholder=""
            :picker-options="pickerOptions"
          />
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
import router from '@/router'

export default {
  name: 'OrderSchedule',
  directives: { waves },
  props: { orderId: { type: Number, required: true }, userId: { type: String, required: true }},
  data() {
    var checkTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('开始时间不得为空'))
      } else {
        callback()
      }
    }
    var checkTime2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('结束时间不得为空'))
      } else {
        callback()
      }
    }
    var checkdevice = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请选择设备'))
      } else {
        callback()
      }
    }
    return {
      order_id: '',
      device_all: [{
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
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        device_id: [
          { validator: checkdevice, trigger: 'change' }
        ],
        start_time: [
          { validator: checkTime, trigger: 'blur' }
        ],
        end_time: [
          { validator: checkTime2, trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  watch: {
    orderId: {
      handler(newVal) {
        // alert('call---'+newVal.questionId);
        // alert('call---'+newVal);
        // alert('---call----' + newVal)
        this.orderId = newVal
        this.listCPs = []
        this.getList()
        // TODO
      },
      deep: true,
      immediate: true
    },
    userId: {
      handler(newVal) {
      // alert('call---'+newVal.questionId);
      // alert('call---'+newVal);
      // alert('---call----' + newVal)
        this.userId = newVal
        this.listCPs = []
        this.getList()
      // TODO
      },
      deep: true,
      immediate: true
    }},
  mounted() {
    // alert(this.orderId)
  },
  created() {
    // alert(this.orderId)
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
      // alert('1')
      this.listLoading = true
      // this.list = response.data.items
      this.listQuery.user_id = this.user_id
      this.listCPs = []
      this.$axios.get('/api/schedule/list_by_order_id', { params: { 'orderId': this.orderId, 'userId': this.userId }}).then(r => {
        this.listCPs = r.data
        for (var i in r.data) {
          r.data[i].start_time = r.data[i].start_time.replace('T', ' ')
          r.data[i].end_time = r.data[i].end_time.replace('T', ' ')
        }
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
        order_id: '',
        user_id: '',
        device_id: '',
        start_time: '',
        end_time: ''
      }
    },
    handleCreate() {
      this.$axios.get('api/device/list_suit', { params: { 'userId': this.userId, 'orderId': this.orderId }}).then(r => {
        this.resetTemp()
        this.device_all = r.data
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    createData() {
      this.temp.user_id = this.user_id
      this.temp.order_id = this.orderId
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid)=>{
        if (valid) {
          this.$axios.post('/api/schedule/add', this.temp).then(r => {
            console.log(r)
            if (r.data === -2) {
              this.$message.error('表单未填写完整')
            } else if (r.data === -5) {
              this.$message.error('开始时间不能晚于结束时间')
            } else if (r.data === -6) {
              this.$message.error('结束时间或开始时间不能晚于收货截止时间')
            } else if (r.data === -7) {
              this.$message.error('排产时段和已有冲突')
            } else if (r.data === 0) {
              this.$message.success('添加成功')
              this.dialogFormVisible = false
              this.handleReFresh()
            }
          })
        }
      })

      console.log(this.temp)
    },
    handleUpdate(row) {
      this.$axios.get('api/device/list_suit', { params: { 'userId': this.userId, 'orderId': this.orderId }}).then(r => {
        // console.log(r.data)
        this.device_all = r.data
        this.temp = Object.assign({}, row) // copy obj
        console.log(this.temp)
        this.dialogUpdateFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.temp.user_id = this.userId
      this.temp.order_id = this.orderId
      // if (this.temp.start_time !== null) {
      //   this.temp.start_time = String(this.temp.start_time).replace(' ', 'T')
      //   this.temp.start_time = this.temp.start_time + '.000Z'
      // }
      // if (this.temp.end_time !== null) {
      //   this.temp.end_time = this.temp.end_time.replace(' ', 'T')
      //   this.temp.end_time = this.temp.end_time + '.000Z'
      //

      const sd = new Date(this.temp.start_time)
      const ed = new Date(this.temp.end_time)

      this.temp.start_time = sd.getTime()
      this.temp.end_time = ed.getTime()
      this.$axios.post('/api/schedule/update', this.temp).then(r => {
        // console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -5) {
          this.$message.error('开始时间不能晚于结束时间')
        } else if (r.data === -6) {
          this.$message.error('结束时间或开始时间不能晚于收货截止时间')
        } else if (r.data === -7) {
          this.$message.error('排产时段和已有冲突')
        } else if (r.data === 0) {
          this.$message.success('更新成功')
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
      this.$confirm('此操作将删除该生产计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/schedule/delete', { params: {
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
    handleFinish() {
      this.$confirm('将完工此订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/order/finish', { params: {
          orderId: this.orderId
        }}).then(r => {
          // 0 ok
          if (r.data === 0) {
            // eslint-disable-next-line no-undef
            location.reload()
            this.$message.success('成功')
          } else if (r.data === -1) {
            // eslint-disable-next-line no-undef
            location.reload()
            this.$message.error('无法完工，没有排产计划')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消完工'
        })
      })
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
