<template>     
    <div>
      <!-- 选择项目 -->
      <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.type"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-select>
    <!-- 选择人员 -->
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.type"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-select>
    <!-- 是否完成 -->
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.type"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-select>
      <el-container>
        <el-table
    :data="tableData"
    style="width: 100%"
    height = "380px"
    :default-sort = "{prop: 'start', order: 'descending'}"
    >
  </el-table>
      </el-container>
      
      
    </div>
  
</template>

<script>
  import webSQL from '@/js/webSQL/webSQL'
  export default {
    name: 'electronui',
    components: {
    },
    data () {
      return { }
    },
    created: function () {
      webSQL.webconnect()
      console.log(webSQL)
    },
    methods: {
    }
  }
</script>

<style>
</style>
