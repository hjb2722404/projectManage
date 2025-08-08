<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useProjectsStore } from '../stores/projects'
import type { Task } from '../types/task'

// 引入OpenTiny Vue组件
import { 
  Button as TinyButton, 
  Input as TinyInput,
  Select as TinySelect,
  DatePicker as TinyDatePicker,
  Slider as TinySlider
} from '@opentiny/vue';

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

// 表单数据
const taskForm = ref({
  name: '',
  type: 'task',
  projectId: null as number | null,
  description: '',
  status: 'todo' as 'todo' | 'in-progress' | 'done',
  createdAt: new Date().toISOString().slice(0, 16),
  dueDate: null as string | null,
  plannedCompletionDate: null as string | null,
  actualCompletionDate: null as string | null,
  progress: 0
})

const isFormVisible = ref(false)
const editingTaskId = ref<number | null>(null)

// 显示创建表单
const showCreateForm = () => {
  isFormVisible.value = true
  editingTaskId.value = null
  taskForm.value = {
    name: '',
    type: 'task',
    projectId: null,
    description: '',
    status: 'todo',
    createdAt: new Date().toISOString().slice(0, 16),
    dueDate: null,
    plannedCompletionDate: null,
    actualCompletionDate: null,
    progress: 0
  }
}

// 显示编辑表单
const showEditForm = (task: Task) => {
  isFormVisible.value = true
  editingTaskId.value = task.id
  taskForm.value = {
    ...task,
    createdAt: task.createdAt.slice(0, 16),
    dueDate: task.dueDate ? task.dueDate.slice(0, 16) : null,
    plannedCompletionDate: task.plannedCompletionDate ? task.plannedCompletionDate.slice(0, 16) : null,
    actualCompletionDate: task.actualCompletionDate ? task.actualCompletionDate.slice(0, 16) : null
  }
}

// 保存任务
const saveTask = async () => {
  try {
    if (editingTaskId.value) {
      // 更新任务
      await tasksStore.updateTask(editingTaskId.value, taskForm.value)
    } else {
      // 创建任务
      await tasksStore.createTask(taskForm.value)
    }
    
    // 重置表单并隐藏
    isFormVisible.value = false
    editingTaskId.value = null
  } catch (error) {
    console.error('保存任务失败:', error)
  }
}

// 删除任务
const deleteTask = async (id: number) => {
  if (confirm('确定要删除这个任务吗？')) {
    try {
      await tasksStore.deleteTask(id)
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }
}

// 格式化日期显示
const formatDate = (dateString: string | null) => {
  if (!dateString) return '无'
  return new Date(dateString).toLocaleDateString()
}

// 获取项目名称
const getProjectName = (projectId: number | null) => {
  if (!projectId) return '无项目'
  const project = projectsStore.projectById(projectId)
  return project ? project.name : '未知项目'
}

onMounted(async () => {
  await tasksStore.fetchTasks()
  await projectsStore.fetchProjects()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-primary-800">任务管理</h1>
      <!-- 使用OpenTiny Vue按钮组件 -->
      <tiny-button 
        @click="showCreateForm"
        type="primary"
        class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <i class="i-mdi-plus mr-1"></i>
        新建任务
      </tiny-button>
    </div>

    <!-- 加载指示器 -->
    <div v-if="tasksStore.loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">正在加载任务...</p>
    </div>

    <!-- 错误信息 -->
    <div v-else-if="tasksStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-700">{{ tasksStore.error }}</p>
      <!-- 使用OpenTiny Vue按钮组件 -->
      <tiny-button 
        @click="tasksStore.fetchTasks"
        type="danger"
        class="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
      >
        重试
      </tiny-button>
    </div>

    <!-- 任务列表 -->
    <div v-else-if="!isFormVisible" class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属项目</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进度</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="task in tasksStore.tasks" :key="task.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ task.name }}</div>
              <div class="text-sm text-gray-500">{{ task.type }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getProjectName(task.projectId || task.project_id) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="{
                  'bg-yellow-100 text-yellow-800': task.status === 'todo',
                  'bg-blue-100 text-blue-800': task.status === 'in-progress',
                  'bg-green-100 text-green-800': task.status === 'done'
                }"
              >
                {{ task.status === 'todo' ? '待办' : task.status === 'in-progress' ? '进行中' : '已完成' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full" 
                    :style="{ width: task.progress + '%' }"
                  ></div>
                </div>
                <div class="text-sm text-gray-500 ml-2">{{ task.progress }}%</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(task.dueDate || task.due_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <!-- 使用OpenTiny Vue按钮组件 -->
              <tiny-button 
                @click="showEditForm(task)"
                type="text"
                class="text-primary-600 hover:text-primary-900 mr-3"
              >
                编辑
              </tiny-button>
              <!-- 使用OpenTiny Vue按钮组件 -->
              <tiny-button 
                @click="deleteTask(task.id)"
                type="text"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </tiny-button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="tasksStore.tasks.length === 0" class="text-center py-12">
        <i class="i-mdi-clipboard-text text-4xl text-gray-300 mb-4 block"></i>
        <p class="text-gray-500">暂无任务</p>
        <!-- 使用OpenTiny Vue按钮组件 -->
        <tiny-button 
          @click="showCreateForm"
          type="primary"
          class="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          创建第一个任务
        </tiny-button>
      </div>
    </div>

    <!-- 任务表单 -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ editingTaskId ? '编辑任务' : '新建任务' }}
      </h2>

      <form @submit.prevent="saveTask">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="task-name">
            任务名称
          </label>
          <!-- 使用OpenTiny Vue输入框组件 -->
          <tiny-input
            id="task-name"
            v-model="taskForm.name"
            placeholder="请输入任务名称"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="task-type">
              任务类型
            </label>
            <!-- 使用OpenTiny Vue选择器组件 -->
            <tiny-select
              id="task-type"
              v-model="taskForm.type"
              :options="[
                { label: '任务', value: 'task' },
                { label: 'Bug', value: 'bug' },
                { label: '功能', value: 'feature' },
                { label: '改进', value: 'improvement' }
              ]"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2" for="task-project">
              所属项目
            </label>
            <!-- 使用OpenTiny Vue选择器组件 -->
            <tiny-select
              id="task-project"
              v-model="taskForm.projectId"
              :options="[
                { label: '无项目', value: null },
                ...projectsStore.projects.map(project => ({
                  label: project.name,
                  value: project.id
                }))
              ]"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="task-description">
            任务描述
          </label>
          <!-- 使用原生textarea元素替代OpenTiny Vue文本域组件 -->
          <textarea
            id="task-description"
            v-model="taskForm.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="4"
            placeholder="请输入任务描述"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="task-status">
              状态
            </label>
            <!-- 使用OpenTiny Vue选择器组件 -->
            <tiny-select
              id="task-status"
              v-model="taskForm.status"
              :options="[
                { label: '待办', value: 'todo' },
                { label: '进行中', value: 'in-progress' },
                { label: '已完成', value: 'done' }
              ]"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2" for="task-progress">
              进度 ({{ taskForm.progress }}%)
            </label>
            <!-- 使用OpenTiny Vue滑块组件 -->
            <tiny-slider
              id="task-progress"
              v-model="taskForm.progress"
              :min="0"
              :max="100"
            />
          </div>
        </div>

        <!-- 日期字段 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="created-at">
              创建时间
            </label>
            <!-- 使用OpenTiny Vue日期选择器组件 -->
            <tiny-date-picker
              id="created-at"
              v-model="taskForm.createdAt"
              type="datetime"
              placeholder="请选择创建时间"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2" for="due-date">
              截止日期
            </label>
            <!-- 使用OpenTiny Vue日期选择器组件 -->
            <tiny-date-picker
              id="due-date"
              v-model="taskForm.dueDate"
              type="datetime"
              placeholder="请选择截止日期"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="planned-completion">
              计划完成时间
            </label>
            <!-- 使用OpenTiny Vue日期选择器组件 -->
            <tiny-date-picker
              id="planned-completion"
              v-model="taskForm.plannedCompletionDate"
              type="datetime"
              placeholder="请选择计划完成时间"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2" for="actual-completion">
              实际完成时间
            </label>
            <!-- 使用OpenTiny Vue日期选择器组件 -->
            <tiny-date-picker
              id="actual-completion"
              v-model="taskForm.actualCompletionDate"
              type="datetime"
              placeholder="请选择实际完成时间"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <!-- 使用OpenTiny Vue按钮组件 -->
          <tiny-button
            @click="isFormVisible = false"
            type="default"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            取消
          </tiny-button>
          <!-- 使用OpenTiny Vue按钮组件 -->
          <tiny-button
            native-type="submit"
            type="primary"
            class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg"
            :disabled="tasksStore.loading"
          >
            <span v-if="tasksStore.loading">保存中...</span>
            <span v-else>{{ editingTaskId ? '更新任务' : '创建任务' }}</span>
          </tiny-button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 添加任何额外的样式 */
</style>