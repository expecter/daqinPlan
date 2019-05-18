<template>     
    <div>
      <!-- 选择项目 -->
      <el-select v-model="projectType" placeholder="大秦">
      <el-option
        v-for="item in tlProject"
        :key="item.type"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-select>
    <!-- 选择人员 -->
    <el-select v-model="memberType" placeholder="尖尖">
      <el-option
        v-for="item in tlMember"
        :key="item.type"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-select>
    <!-- 是否完成 -->
    <el-select v-model="completeType" placeholder="完成">
      <el-option
        v-for="item in tlComplete"
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
          <el-table-column
            prop="project"
            label="项目"
            width="180">
          </el-table-column>
          <el-table-column
            prop="menber"
            label="成员"
            width="180">
          </el-table-column>
          <el-table-column
            prop="task"
            label="任务"
            width="180">
          </el-table-column>
          <el-table-column
            prop="isComplete"
            label="是否完成"
            width="180">
          </el-table-column>
          <el-table-column
            prop="usetime"
            label="时间"
            width="180">
          </el-table-column>
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
      return {
        projectType: '',
        memberType: '',
        completeType: '',
        tlProject: [],
        tlMember: [],
        tlComplete: [],
        tableData: []
      }
    },
    created: function () {
      // webSQL.webconnect()
      console.log(webSQL)
      console.log(this.projectType)
      let self = this
      window.addEventListener('updateTaskMsg', function (e) {
        self.updateTaskList()
      })
    },
    methods: {
      updateTaskList: function () {
        console.log('AAAAA')
      }
    }
  }
</script>

<style>
</style>
