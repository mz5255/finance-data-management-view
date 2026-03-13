<template>
  <PageContainer
      :show-add="true"
      addButtonText="添加员工"
      subtitle="公司员工体系管理"
      title="员工管理"
      @add="handleAdd"
  >
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <circle cx="9" cy="7" r="4" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </svg>
    </template>

    <!-- 员工表格 -->
    <template v-if="!loading && employeeList.length === 0">
      <el-empty description="暂无员工数据 - Hello World">
        <el-button type="primary" @click="handleAdd">添加第一位员工</el-button>
      </el-empty>
    </template>
    <el-table v-else v-loading="loading" :data="employeeList" stripe>
      <el-table-column label="工号" prop="employeeId" width="120"/>
      <el-table-column label="姓名" prop="name" width="100"/>
      <el-table-column label="手机号" prop="phone" width="130"/>
      <el-table-column label="邮箱" prop="email" width="180"/>
      <el-table-column align="center" label="部门" prop="department" width="120">
        <template #default="{ row }">
          <el-tag :type="getDepartmentTagType(row.department)" class="status-tag">
            {{ row.department }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位" prop="position" width="120"/>
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" class="status-tag">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="入职日期" prop="entryDate" width="120"/>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button class="table-action-btn" link type="primary" @click="handleEdit(row)">
              <el-icon>
                <Edit/>
              </el-icon>
              编辑
            </el-button>
            <el-dropdown class="status-dropdown" @command="(cmd) => handleStatusChange(row, cmd)">
              <el-button class="table-action-btn" link type="warning">
                状态
                <el-icon>
                  <ArrowDown/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="ACTIVE">在职</el-dropdown-item>
                  <el-dropdown-item command="ON_LEAVE">休假</el-dropdown-item>
                  <el-dropdown-item command="RESIGNED">离职</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button class="table-action-btn" link type="danger" @click="handleDelete(row)">
              <el-icon>
                <Delete/>
              </el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 员工表单对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form ref="employeeFormRef" :model="employeeForm" :rules="formRules" label-width="100px">
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="employeeForm.employeeId" :disabled="isEdit" placeholder="请输入工号"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="employeeForm.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="employeeForm.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="employeeForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="employeeForm.department" placeholder="请选择部门" style="width: 100%">
            <el-option label="技术部" value="技术部"/>
            <el-option label="产品部" value="产品部"/>
            <el-option label="运营部" value="运营部"/>
            <el-option label="市场部" value="市场部"/>
            <el-option label="人事部" value="人事部"/>
            <el-option label="财务部" value="财务部"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="employeeForm.position" placeholder="请输入职位"/>
        </el-form-item>
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker
              v-model="employeeForm.entryDate"
              format="YYYY-MM-DD"
              placeholder="选择入职日期"
              style="width: 100%"
              type="date"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="employeeForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="在职" value="ACTIVE"/>
            <el-option label="休假" value="ON_LEAVE"/>
            <el-option label="离职" value="RESIGNED"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {ArrowDown, Delete, Edit} from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'

const employeeList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const employeeFormRef = ref(null)

// 员工表单
const employeeForm = ref({
  employeeId: '',
  name: '',
  phone: '',
  email: '',
  department: '',
  position: '',
  entryDate: '',
  status: 'ACTIVE'
})

// 表单验证规则
const formRules = {
  employeeId: [
    {required: true, message: '请输入工号', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入姓名', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
  ],
  department: [
    {required: true, message: '请选择部门', trigger: 'change'}
  ],
  position: [
    {required: true, message: '请输入职位', trigger: 'blur'}
  ],
  entryDate: [
    {required: true, message: '请选择入职日期', trigger: 'change'}
  ]
}

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑员工' : '添加员工'
})

// 状态映射
const statusMap = {
  ACTIVE: {label: '在职', type: 'success'},
  ON_LEAVE: {label: '休假', type: 'warning'},
  RESIGNED: {label: '离职', type: 'danger'}
}

// 部门颜色映射
const departmentColorMap = {
  '技术部': 'primary',
  '产品部': 'success',
  '运营部': 'warning',
  '市场部': 'danger',
  '人事部': 'info',
  '财务部': ''
}

const getStatusLabel = (status) => {
  return statusMap[status]?.label || '未知'
}

const getStatusTagType = (status) => {
  return statusMap[status]?.type || 'info'
}

const getDepartmentTagType = (department) => {
  return departmentColorMap[department] || ''
}

// 获取员工列表
const fetchEmployees = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // Demo 数据
    employeeList.value = [
      {
        employeeId: 'EMP001',
        name: '张三',
        phone: '13800138001',
        email: 'zhangsan@company.com',
        department: '技术部',
        position: '前端工程师',
        status: 'ACTIVE',
        entryDate: '2024-01-15'
      },
      {
        employeeId: 'EMP002',
        name: '李四',
        phone: '13800138002',
        email: 'lisi@company.com',
        department: '产品部',
        position: '产品经理',
        status: 'ACTIVE',
        entryDate: '2024-02-20'
      },
      {
        employeeId: 'EMP003',
        name: '王五',
        phone: '13800138003',
        email: 'wangwu@company.com',
        department: '运营部',
        position: '运营专员',
        status: 'ON_LEAVE',
        entryDate: '2024-03-10'
      }
    ]
  } catch (error) {
    console.error('获取员工列表失败:', error)
    ElMessage.error('获取员工列表失败')
  } finally {
    loading.value = false
  }
}

// 添加员工
const handleAdd = () => {
  isEdit.value = false
  employeeForm.value = {
    employeeId: `EMP${String(Date.now()).slice(-6)}`,
    name: '',
    phone: '',
    email: '',
    department: '',
    position: '',
    entryDate: '',
    status: 'ACTIVE'
  }
  dialogVisible.value = true
}

// 编辑员工
const handleEdit = (row) => {
  isEdit.value = true
  employeeForm.value = {...row}
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!employeeFormRef.value) return

  await employeeFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑
        const index = employeeList.value.findIndex(e => e.employeeId === employeeForm.value.employeeId)
        if (index !== -1) {
          employeeList.value[index] = {...employeeForm.value}
          ElMessage.success('编辑成功')
        }
      } else {
        // 添加
        employeeList.value.unshift({...employeeForm.value})
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}

// 更改员工状态
const handleStatusChange = async (row, newStatus) => {
  if (row.status === newStatus) {
    return
  }

  const statusLabel = statusMap[newStatus]?.label || newStatus
  const name = row?.name || row?.employeeId || '该员工'

  try {
    await ElMessageBox.confirm(
        `确定要将员工"${name}"的状态更改为"${statusLabel}"吗？`,
        '更改员工状态',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const index = employeeList.value.findIndex(e => e.employeeId === row.employeeId)
    if (index !== -1) {
      employeeList.value[index].status = newStatus
      ElMessage.success('更改成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更改员工状态失败:', error)
      ElMessage.error('更改失败')
    }
  }
}

// 删除员工
const handleDelete = async (row) => {
  const name = row?.name || row?.employeeId || '该员工'

  try {
    await ElMessageBox.confirm(
        `确定要删除员工"${name}"吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const index = employeeList.value.findIndex(e => e.employeeId === row.employeeId)
    if (index !== -1) {
      employeeList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除员工失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 关闭对话框
const handleDialogClose = () => {
  employeeFormRef.value?.resetFields()
}

onMounted(() => {
  console.log('员工管理组件已挂载')
  fetchEmployees()
})
</script>

<style scoped>
@import '@/styles/table.css';

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.table-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-dropdown {
  display: inline-block;
}

.status-tag {
  margin: 0;
}
</style>
