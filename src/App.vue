<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  /*
   * 解决ElementUI表格线不对齐
   */
  body .el-table th.gutter {
    display: table-cell !important;
  }
  
  /*
   * 解决el-dialog手机端适配
   */
  @media screen and (max-width: 640px) {
  .el-dialog__wrapper .el-dialog {
    width: 95% !important;
    margin-top: 5vh !important;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__body {
    overflow: auto
  }

  .el-message-box {
    width: auto;
  }
}
</style>
