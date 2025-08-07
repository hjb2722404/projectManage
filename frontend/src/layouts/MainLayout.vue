<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '../services/authService'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

const navigation = [
  { name: '项目管理', path: '/projects' },
  { name: '任务管理', path: '/tasks' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- 头部 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-primary-700">项目管理系统</h1>
          </div>
          
          <!-- 桌面端导航 -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              :class="{ 'text-primary-600': route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
            
            <!-- 登出按钮 -->
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center"
            >
              <i class="i-mdi-logout mr-1"></i>
              登出
            </button>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <div class="md:hidden flex items-center">
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-primary-600 mr-4"
            >
              <i class="i-mdi-logout text-xl"></i>
            </button>
            
            <button
              @click="toggleMenu"
              class="text-gray-700 hover:text-primary-600"
            >
              <i class="i-mdi-menu text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 移动端导航 -->
      <div v-show="isMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="container mx-auto px-4 py-2">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            @click="isMenuOpen = false"
            class="block py-2 text-gray-700 hover:text-primary-600 font-medium"
            :class="{ 'text-primary-600': route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- 主要内容 -->
    <main class="flex-grow">
      <slot />
    </main>
    
    <!-- 底部 -->
    <footer class="bg-white border-t border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} 项目管理系统. 保留所有权利.
        </p>
      </div>
    </footer>
  </div>
</template>