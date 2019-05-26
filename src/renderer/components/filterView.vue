<template>
<el-dialog
  title="提示"
  :visible.sync="msShowDialog"
  width="80%">
  <div>
    <el-container>
        <el-table
          :data="tableData"
          style="width: 100%"
          height = "380px"
          border
          :default-sort = "{prop: 'lastDateTime', order: 'descending'}"
          >
          <el-table-column
            prop="title"
            label="任务"
            width="380">
          </el-table-column>
          <el-table-column
            prop="status"
            label="是否完成"
            width="180">
          </el-table-column>
          <el-table-column
            prop="lastDateTime"
            label="时间"
            sortable
            width="180">
          </el-table-column>
        </el-table>
      </el-container>
      <el-button @click="formYes">确定</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
  props: ['tableData', 'showDialog'],
  data () {
    return {
      test: false,
      msShowDialog: false
    }
  },
  watch: {
    showDialog: function () {
      this.msShowDialog = true
    }
    // msShowDialog: function () {
    //   console.log(this.msShowDialog)
    //   if (!this.msShowDialog) {
    //     this.$emit('listenToChildEvent', '')
    //   }
    // }
  },
  methods: {
    formYes: function () {
      // this.showDialog = false
      // this.$emit('listenToChildEvent', '')
    }
  }
}
</script>