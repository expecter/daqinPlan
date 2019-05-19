<template>
<el-dialog
  title="提示"
  :visible.sync="mgshowDialog"
  width="80%">
  <div>
    <el-form ref="form" :model="form" label-width="80px">
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
          <el-select v-model="versionType" placeholder="请选择">
            <el-option
              v-for="item in tlVersion"
              :key="item.versionId"
              :label="item.name"
              :value="item.versionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="radio" label="1">任务</el-radio>
          <el-radio v-model="radio" label="2">bugs</el-radio>
        </el-form-item>
      </el-form>
  </div>
</el-dialog>
</template>
<script>

</script>