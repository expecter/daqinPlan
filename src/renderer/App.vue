<template>     
    <div>
      <el-form label-width="80px" :inline="true">
        <el-form-item label="项目名称">
          <el-select v-model="projectType" placeholder="请选择">
            <el-option
              v-for="item in tlProject"
              :key="item.projectId"
              :label="item.name"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员名称">
          <el-select v-model="memberType" placeholder="请选择">
            <el-option
              v-for="item in tlMember"
              :key="item.uid"
              :label="item.nickname"
              :value="item.uid">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="版本名称">
          <el-select v-model="versionType" placeholder="请选择">
            <el-option
              v-for="item in tlVersion"
              :key="item.versionId"
              :label="item.name"
              :value="item.versionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-select v-model="completeType" placeholder="请选择">
            <el-option
              v-for="item in tlCompleteTime"
              :key="item.type"
              :label="item.label"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="radio" label="1">任务</el-radio>
          <el-radio v-model="radio" label="2">bugs</el-radio>
        </el-form-item>
      </el-form>
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
      
      
    </div>
  
</template>

<script>
  import webSQL from '@/js/webSQL/webSQL'
  import util from '@/js/util'
  export default {
    name: 'electronui',
    components: {
    },
    data () {
      return {
        projectType: null,
        memberType: null,
        versionType: null,
        radio: '1',
        tlProject: [],
        tlMember: [],
        tlVersion: [],
        tableData: [],
        tempData: [],
        completeType: null,
        tlCompleteTime: [{type: 0, label: '所有'}, {type: 1, label: '今日任务'}, {type: 2, label: '本月任务'}, {type: 3, label: '上月任务'}]
      }
    },
    created: function () {
      console.log(webSQL)
      console.log(this.projectType)
      let self = this
      window.addEventListener('updateTaskMsg', function (e) {
        self.updateTaskList()
      })
      window.addEventListener('updateProjectMember', function (e) {
        self.updateTaskList()
      })
      webSQL.getAllUsers(this.tlMember)
      webSQL.getProjects(this.tlProject)
      webSQL.getAllTasks()
    },
    watch: {
      projectType: function () {
        this.tlMember = []
        webSQL.getUsers(this.tlMember, this.projectType)
        this.tlVersion = [{versionId: 0, name: '所有'}]
        webSQL.getVersions(this.tlVersion, this.projectType)
      },
      memberType: function () {
        this.updateTableData()
      },
      versionType: function () {
        this.updateTableData()
      },
      radio: function () {
        this.updateTableData()
      },
      completeType: function () {
        this.updateTableData()
      }
    },
    methods: {
      updateTaskList: function () {
      },
      updateTableData: function () {
        var tempData = []
        this.tableData = []
        var self = this
        var curDate = new Date()
        var monthDate
        console.log(curDate)
        let callback = function () {
          for (let index in tempData) {
            var cellData = tempData[index]
            var isadd = true
            if (self.completeType) {
              switch (self.completeType) {
                case 0:
                  break
                case 1:
                  if (cellData.status === 'DONE') {
                    isadd = false
                  }
                  break
                case 2:
                  monthDate = new Date(cellData.lastDateTime)
                  isadd = false
                  if (cellData.status === 'DONE' && monthDate.getFullYear() === curDate.getFullYear() && monthDate.getMonth() === curDate.getMonth()) {
                    isadd = true
                  }
                  break
                case 3:
                  isadd = false
                  monthDate = new Date(cellData.lastDateTime)
                  if (cellData.status === 'DONE' && monthDate.getFullYear() === curDate.getFullYear() && monthDate.getMonth() === (curDate.getMonth() - 1)) {
                    isadd = true
                  }
                  break
                default:
                  break
              }
            }
            if (isadd) {
              cellData.lastDateTime = util.formatDate(cellData.lastDateTime, 'yyyy-MM-dd')
              self.tableData.push(cellData)
            }
          }
        }
        if (this.versionType && this.versionType !== 0) {
          if (this.radio === '1') {
            webSQL.getTaskByPidAndUidAndVid(tempData, this.projectType, this.memberType, this.versionType, callback)
          } else {
            webSQL.getBugsByPidAndUidAndVid(tempData, this.projectType, this.memberType, this.versionType, callback)
          }
        } else {
          if (this.radio === '1') {
            webSQL.getTaskByPidAndUid(tempData, this.projectType, this.memberType, callback)
          } else {
            webSQL.getBugsByPidAndUid(tempData, this.projectType, this.memberType, callback)
          }
        }
      }
    }
  }
</script>

<style>
</style>
