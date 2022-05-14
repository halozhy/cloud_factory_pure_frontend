<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 1rem">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.product_name" placeholder="产品名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.receiver_name" placeholder="接收人名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReFresh">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="" icon="el-icon-plus" @click="handleListRent">
        租用
      </el-button> -->
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <el-table-column label="产品数量" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收人名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiver_name }}</span>
          <!-- <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.name | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiver_tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收人地址" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiver_addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投标截止日期" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bid_end_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货截止日期" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deliver_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="{row}">

          <el-tag>{{ row.state }}</el-tag>
          <!-- <span>{{ row.type }}</span> -->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="280px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="" @click="handleChooseBid(row)">
            选标
          </el-button>
          <el-button v-if="row.state !== '已发货' && row.state !== '已完成' " type="primary" size="mini" @click="handleUpdate(row)">
            更改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button v-if="row.state === '已发货'" size="mini" type="primary" @click="handleRecv(row)">
            收货
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="添加" :visible.sync="dialogFormVisible" top="8vh">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" top="0" style="width: 400px; margin-left:50px;">
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
        <el-form-item label="产品数量">
          <el-input-number v-model="temp.num" :min="1" label="描述文字" />
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="temp.receiver_name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.receiver_tel" />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="temp.receiver_addr" />
        </el-form-item>
        <el-form-item label="投标截止日期">
          <el-date-picker
            v-model="temp.bid_end_date"
            type="date"
            placeholder="选择投标截止日期"
            :picker-options="bid_end_date_picker_options"
          />
        </el-form-item>
        <el-form-item label="收货截止日期">
          <el-date-picker
            v-model="temp.deliver_date"
            type="date"
            placeholder="选择收货截止日期"
            :picker-options="deliver_date_picker_options"
          />
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" top="0" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品">
          <el-select v-model="temp.product_id" disabled placeholder="请选择">
            <el-option
              v-for="item in product_all"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品数量">
          <el-input-number v-model="temp.num" disabled :min="1" label="描述文字" />
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="temp.receiver_name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.receiver_tel" />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="temp.receiver_addr" />
        </el-form-item>
        <el-form-item label="投标截止日期">
          <el-date-picker
            v-model="temp.bid_end_date"
            disabled
            type="date"
            placeholder="选择投标截止日期"
            :picker-options="bid_end_date_picker_options"
          />
        </el-form-item>
        <el-form-item label="收货截止日期">
          <el-date-picker
            v-model="temp.deliver_date"
            disabled
            type="date"
            placeholder="选择收货截止日期"
            :picker-options="deliver_date_picker_options"
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

    <el-dialog title="选标" :visible.sync="dialogChooseBidFormVisible" class="pub_dialog" top="0">
      <el-table :data="listBids" border fit highlight-current-row style="width: 100%" max-height="400">
        <el-table-column label="ID" prop="id" sortable align="center" min-width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工厂名称" min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.fac_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工厂描述" min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.fac_describe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="竞标价格" prop="price" sortable min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="竞标状态" min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.state === '已中标' || row.state === '未中标'" size="mini" type="primary" @click="handleBid(row)">
              中标
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogChooseBidFormVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="租用" :visible.sync="dialogRentFormVisible" class="pub_dialog" top="0">
      <el-table :data="listRentable" border fit highlight-current-row style="width: 100%" max-height="400">
        <el-table-column label="ID" prop="id" sortable align="center" min-width="80">
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
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleRent(row)">
              租用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="确认租用" :visible.sync="dialogConfirmRentFormVisible" append-to-body>
        <el-form ref="dataForm" :model="rentConfirm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="选择到期时间">
            <el-date-picker
              v-model="expireTime"
              type="datetime"
              placeholder=""
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="rentDevice()">
            确认租用
          </el-button>
          <el-button size="mini" type="" @click="dialogConfirmRentFormVisible = false">关闭</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogRentFormVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import jsCookie from 'js-cookie'

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
  name: 'DealerOrderMgr',
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
      product_all: [{
        id: '0',
        name: 'test'
      }],
      user_id: '',
      user_type: '',
      tableKey: 0,
      list: null,
      listRentable: [],
      listBids: [],
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        receiver_name: '',
        product_name: '',
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
        id: '',
        state: '',
        num: '',
        receiver_name: '',
        receiver_tel: '',
        receiver_addr: '',
        deliver_date: '',
        bid_end_date: '',
        product_id: '',
        product_name: '',
        user_id: '',
        user_true_name: ''
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
      dialogChooseBidFormVisible: false,
      rentConfirm: { expireTime: '' },
      expireTime: '',
      pickerOptions: {},
      // bid_end_date_picker_options: {},
      // deliver_date_picker_options: {},
      selectedRentDeviceId: '',
      selectedOrderId: '',
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    bid_end_date_picker_options() {
      // const _this = this
      return {
        disabledDate(time) {
          return (time.getTime() < new Date().getTime())
        }
      }
    },
    deliver_date_picker_options() {
      // const _this = this
      return {
        disabledDate(time) {
          return (time.getTime() < new Date().getTime())
          // return time.getTime() < _this.temp.bid_end_date.getTime()
        }
      }
    }
  },
  created() {
    this.user_id = jsCookie.get('userId')
    this.user_type = jsCookie.get('type')
    this.getList()
    this.temp.deliver_date = new Date().getTime()
    this.temp.bid_end_date = new Date().getTime()
    // this.deliver_date_picker_options = {
    //   disabledDate(time) {
    //     console.log(this.temp.deliver_date)
    //     return time.getTime() < this.temp.deliver_date.getTime()
    //   }
    // }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.user_id = this.user_id
      this.$axios.post('/api/order/list_dealer', this.listQuery).then(r => {
        this.list = r.data.data
        console.log(r.data)
        this.total = r.data.count
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
        id: '',
        state: '',
        num: '',
        receiver_name: '',
        receiver_tel: '',
        receiver_addr: '',
        deliver_date: '',
        bid_end_date: '',
        product_id: '',
        product_name: '',
        user_id: '',
        user_true_name: ''
      }
    },
    handleCreate() {
      this.$axios.get('api/prod/list_all').then(r => {
        // console.log(r.data)
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
      console.log(this.temp)
      this.temp.user_id = this.user_id
      this.$axios.post('/api/order/add', this.temp).then(r => {
        console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -1) {
          this.$message.error('产品id错误')
        } else if (r.data === -3) {
          this.$message.error('用户id不正确')
        } else if (r.data === -4) {
          this.$message.error('权限错误')
        } else if (r.data === -5) {
          this.$message.error('投标或收货截止日期必须晚于当前日期')
        } else if (r.data === -6) {
          this.$message.error('收货截止日期必须晚于投标截止日期')
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
      this.$axios.get('api/order/can_update', { params: { oId: row.id }}).then(r => {
        if (r.data !== 0) {
          if (r.data === -1) {
            this.$message.error('此状态不可修改')
          }
        } else {
          // this.$axios.get('api/product/list_all').then(r => {
          // console.log(r.data)
          // this.device_type_all = r.data
          this.temp = Object.assign({}, row) // copy obj
          console.log(this.temp)
          this.dialogUpdateFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
          // })
        }
      })
    },
    updateData() {
      this.temp.user_id = this.user_id
      this.$axios.post('/api/order/update', this.temp).then(r => {
        // console.log(r)
        if (r.data === -2) {
          this.$message.error('表单未填写完整')
        } else if (r.data === -1) {
          this.$message.error('无此订单')
        } else if (r.data === -3) {
          this.$message.error('此状态不可修改')
        } else if (r.data === -6) {
          this.$message.error('权限错误')
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
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/order/delete', { params: {
          dId: row.id
        }}).then(r => {
          // 只能删除未中标的订单
          // 0 ok -1 此设备下仍有未完成的订单 -2 无此设备
          if (r.data === -2) {
            this.$message.error('无此订单')
          } else if (r.data === -1) {
            this.$message.error('只可删除未中标的订单')
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
      this.listQuery.receiver_name = ''
      this.listQuery.product_name = ''
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
    handleChooseBid(row) {
      // alert('here')
      this.selectedOrderId = row.id
      this.$axios.get('/api/bid/list_by_oId', { params: { 'oId': row.id }}).then(r => {
        this.dialogChooseBidFormVisible = true
        this.listBids = r.data
      })
    },
    handleBid(row) {
      // alert('here')
      // TODO 中标
      var info = {
        'order_id': this.selectedOrderId,
        'bid_id': row.id,
        'user_id': this.user_id }
      // console.log(info)
      this.$axios.post('api/bid/choose_bid', info).then(r => {
        this.listRentable = r.data
        console.log(r.data)
        if (r.data === 0) {
          this.$message.success('中标成功')
          this.dialogChooseBidFormVisible = false
          this.handleReFresh()
        } else {
          this.$message.error('中标失败')
        }
      })
    },
    handleRecv(row) {
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/api/order/recv', { params: {
          orderId: row.id
        }}).then(r => {
          // 0 ok
          if (r.data === 0) {
            this.$message.success('成功')
            this.handleReFresh()
          } else if (r.data === -1) {
            this.$message.error('无法收货，状态不是已发货')
            this.handleReFresh()
          }
        })
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
