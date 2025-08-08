<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">项目管理</h1>
      <!-- 使用OpenTiny Vue按钮组件 -->
      <tiny-button
        @click="showCreateForm"
        type="primary"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <i class="i-mdi-plus mr-1"></i>
        新建项目
      </tiny-button>
    </div>

    <!-- 项目列表 -->
    <div v-if="projectsStore.loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="projectsStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong>错误:</strong> {{ projectsStore.error }}
    </div>

    <div v-else>
      <!-- 项目卡片列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projectsStore.projects"
          :key="project.id"
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-800">{{ project.name }}</h3>
              <div class="flex space-x-2">
                <!-- 使用OpenTiny Vue按钮组件 -->
                <tiny-button
                  @click="showEditForm(project)"
                  type="text"
                  class="text-blue-600 hover:text-blue-800"
                  title="编辑项目"
                >
                  <i class="i-mdi-pencil"></i>
                </tiny-button>
                <!-- 使用OpenTiny Vue按钮组件 -->
                <tiny-button
                  @click="deleteProject(project.id)"
                  type="text"
                  class="text-red-600 hover:text-red-800"
                  title="删除项目"
                >
                  <i class="i-mdi-delete"></i>
                </tiny-button>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <div v-if="project.startDate || project.endDate" class="flex items-center text-sm text-gray-600">
                <i class="i-mdi-calendar mr-2"></i>
                <span>
                  {{ project.startDate ? formatDate(project.startDate) : '未设置' }} 
                  - 
                  {{ project.endDate ? formatDate(project.endDate) : '未设置' }}
                </span>
              </div>

              <div v-if="project.managers && project.managers.length" class="flex items-start text-sm text-gray-600">
                <i class="i-mdi-account-multiple mr-2 mt-0.5"></i>
                <div>
                  <div class="font-medium">项目负责人:</div>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="(manager, index) in project.managers"
                      :key="index"
                      class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {{ manager.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div class="text-sm text-gray-500">
                {{ getTaskStats(project.id).completed }}/{{ getTaskStats(project.id).total }} 任务完成
              </div>
              <!-- 使用OpenTiny Vue按钮组件 -->
              <tiny-button
                @click="viewProjectTasks(project.id)"
                type="text"
                class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
              >
                查看任务
                <i class="i-mdi-arrow-right ml-1"></i>
              </tiny-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="projectsStore.projects.length === 0" class="text-center py-12">
        <i class="i-mdi-folder-open text-5xl text-gray-300 mx-auto"></i>
        <h3 class="mt-4 text-lg font-medium text-gray-900">暂无项目</h3>
        <p class="mt-1 text-gray-500">开始创建你的第一个项目</p>
        <div class="mt-6">
          <!-- 使用OpenTiny Vue按钮组件 -->
          <tiny-button
            @click="showCreateForm"
            type="primary"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            创建项目
          </tiny-button>
        </div>
      </div>
    </div>

    <!-- 项目表单模态框 -->
    <div v-if="isFormVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">
              {{ editingProjectId ? '编辑项目' : '新建项目' }}
            </h2>
            <!-- 使用OpenTiny Vue按钮组件 -->
            <tiny-button @click="isFormVisible = false" type="text" class="text-gray-500 hover:text-gray-700">
              <i class="i-mdi-close"></i>
            </tiny-button>
          </div>

          <form @submit.prevent="saveProject">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">项目名称 *</label>
                <!-- 使用OpenTiny Vue输入框组件 -->
                <tiny-input
                  v-model="projectForm.name"
                  placeholder="请输入项目名称"
                ></tiny-input>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <!-- 使用OpenTiny Vue日期选择器组件 -->
                  <tiny-date-picker
                    v-model="projectForm.startDate"
                    type="date"
                    placeholder="请选择开始日期"
                  ></tiny-date-picker>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <!-- 使用OpenTiny Vue日期选择器组件 -->
                  <tiny-date-picker
                    v-model="projectForm.endDate"
                    type="date"
                    placeholder="请选择结束日期"
                  ></tiny-date-picker>
                </div>
              </div>

              <!-- 联系人部分 -->
              <div class="border-t border-gray-200 pt-4">
                <h3 class="text-lg font-medium text-gray-800 mb-3">联系人信息</h3>
                
                <div class="mb-4">
                  <div class="flex space-x-2 mb-2">
                    <!-- 使用OpenTiny Vue按钮组件 -->
                    <tiny-button
                      @click="currentContactType = 'manager'"
                      :type="currentContactType === 'manager' ? 'primary' : 'default'"
                      size="mini"
                    >
                      项目负责人
                    </tiny-button>
                    <!-- 使用OpenTiny Vue按钮组件 -->
                    <tiny-button
                      @click="currentContactType = 'upstream'"
                      :type="currentContactType === 'upstream' ? 'primary' : 'default'"
                      size="mini"
                    >
                      上游对接人
                    </tiny-button>
                    <!-- 使用OpenTiny Vue按钮组件 -->
                    <tiny-button
                      @click="currentContactType = 'downstream'"
                      :type="currentContactType === 'downstream' ? 'primary' : 'default'"
                      size="mini"
                    >
                      下游对接人
                    </tiny-button>
                  </div>

                  <div class="flex space-x-2">
                    <!-- 使用OpenTiny Vue输入框组件 -->
                    <tiny-input
                      v-model="contactForm.name"
                      placeholder="姓名"
                      class="flex-1"
                    />
                    <!-- 使用OpenTiny Vue输入框组件 -->
                    <tiny-input
                      v-model="contactForm.phone"
                      placeholder="电话"
                      class="flex-1"
                    />
                    <!-- 使用OpenTiny Vue按钮组件 -->
                    <tiny-button
                      @click="addContact"
                      type="primary"
                    >
                      添加
                    </tiny-button>
                  </div>
                </div>

                <!-- 联系人列表 -->
                <div v-for="(contact, index) in getCurrentContacts()" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-1">
                  <div>
                    <span class="font-medium">{{ contact.name }}</span>
                    <span class="text-gray-600 ml-2">{{ contact.phone }}</span>
                  </div>
                  <!-- 使用OpenTiny Vue按钮组件 -->
                  <tiny-button
                    @click="removeContact(currentContactType, index)"
                    type="text"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="i-mdi-delete"></i>
                  </tiny-button>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <!-- 使用OpenTiny Vue按钮组件 -->
              <tiny-button
                @click="isFormVisible = false"
                type="default"
              >
                取消
              </tiny-button>
              <!-- 使用OpenTiny Vue按钮组件 -->
              <tiny-button
                native-type="submit"
                :disabled="!projectForm.name"
                type="primary"
              >
                保存
              </tiny-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useTasksStore } from '../stores/tasks'
import { useRouter } from 'vue-router'
import type { Contact } from '../types/project'

// 引入OpenTiny Vue组件
import { 
  Button as TinyButton, 
  Input as TinyInput, 
  DatePicker as TinyDatePicker 
} from '@opentiny/vue';

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()
const router = useRouter()

// 表单数据
const projectForm = ref({
  name: '',
  managers: [] as Contact[],
  upstreamContacts: [] as Contact[],
  downstreamContacts: [] as Contact[],
  startDate: '',
  endDate: ''
})

const isFormVisible = ref(false)
const editingProjectId = ref<number | null>(null)

// 联系人表单数据
const contactForm = ref({
  name: '',
  phone: ''
})

const currentContactType = ref<'manager' | 'upstream' | 'downstream'>('manager')

// 添加联系人到表单
const addContact = () => {
  if (!contactForm.value.name || !contactForm.value.phone) return

  const contact = {
    name: contactForm.value.name,
    phone: contactForm.value.phone
  }

  switch (currentContactType.value) {
    case 'manager':
      projectForm.value.managers.push(contact)
      break
    case 'upstream':
      projectForm.value.upstreamContacts.push(contact)
      break
    case 'downstream':
      projectForm.value.downstreamContacts.push(contact)
      break
  }

  // 重置联系人表单
  contactForm.value.name = ''
  contactForm.value.phone = ''
}

// 从表单中移除联系人
const removeContact = (type: 'manager' | 'upstream' | 'downstream', index: number) => {
  switch (type) {
    case 'manager':
      projectForm.value.managers.splice(index, 1)
      break
    case 'upstream':
      projectForm.value.upstreamContacts.splice(index, 1)
      break
    case 'downstream':
      projectForm.value.downstreamContacts.splice(index, 1)
      break
  }
}

// 获取当前类型的联系人
const getCurrentContacts = () => {
  switch (currentContactType.value) {
    case 'manager':
      return projectForm.value.managers
    case 'upstream':
      return projectForm.value.upstreamContacts
    case 'downstream':
      return projectForm.value.downstreamContacts
    default:
      return []
  }
}

// 显示创建表单
const showCreateForm = () => {
  isFormVisible.value = true
  editingProjectId.value = null
  projectForm.value = {
    name: '',
    managers: [],
    upstreamContacts: [],
    downstreamContacts: [],
    startDate: '',
    endDate: ''
  }
}

// 显示编辑表单
const showEditForm = (project: any) => {
  isFormVisible.value = true
  editingProjectId.value = project.id
  projectForm.value = {
    name: project.name,
    managers: project.managers || [],
    upstreamContacts: project.upstreamContacts || [],
    downstreamContacts: project.downstreamContacts || [],
    startDate: project.startDate || project.start_date,
    endDate: project.endDate || project.end_date
  }
}

// 保存项目
const saveProject = async () => {
  try {
    if (editingProjectId.value) {
      // 更新现有项目
      await projectsStore.updateProject(editingProjectId.value, {
        name: projectForm.value.name,
        managers: projectForm.value.managers,
        upstreamContacts: projectForm.value.upstreamContacts,
        downstreamContacts: projectForm.value.downstreamContacts,
        startDate: projectForm.value.startDate,
        endDate: projectForm.value.endDate
      })
    } else {
      // 创建新项目
      await projectsStore.createProject({
        name: projectForm.value.name,
        managers: projectForm.value.managers,
        upstreamContacts: projectForm.value.upstreamContacts,
        downstreamContacts: projectForm.value.downstreamContacts,
        startDate: projectForm.value.startDate,
        endDate: projectForm.value.endDate
      })
    }

    // 重置表单
    isFormVisible.value = false
  } catch (error) {
    console.error('保存项目时出错:', error)
  }
}

// 删除项目
const deleteProject = async (id: number) => {
  if (!confirm('确定要删除这个项目吗？')) return

  try {
    await projectsStore.deleteProject(id)
    // 同时删除关联的任务
    const tasksToDelete = tasksStore.tasks.filter(task => task.projectId === id)
    for (const task of tasksToDelete) {
      await tasksStore.deleteTask(task.id)
    }
  } catch (error) {
    console.error('删除项目时出错:', error)
  }
}

// 查看项目任务
const viewProjectTasks = (projectId: number) => {
  router.push(`/tasks?projectId=${projectId}`)
}

// 获取项目任务统计
const getTaskStats = (projectId: number) => {
  const projectTasks = tasksStore.tasks.filter(task => task.projectId === projectId)
  const completedTasks = projectTasks.filter(task => task.status === 'done')
  return {
    total: projectTasks.length,
    completed: completedTasks.length
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  await projectsStore.fetchProjects()
  await tasksStore.fetchTasks()
})
</script>