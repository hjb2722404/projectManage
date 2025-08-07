<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
    <div class="relative z-10 max-w-md w-full space-y-8 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-800">
          项目管理系统
        </h2>
        <p class="mt-2 text-center text-sm text-gray-700">
          {{ showSignup ? '创建新账户' : '登录您的账户' }}
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">邮箱地址</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
              placeholder="邮箱地址"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
              placeholder="密码"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-purple-700 hover:text-purple-500" @click="showSignup = !showSignup">
              {{ showSignup ? '已有账户？登录' : '没有账户？注册' }}
            </a>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-500/80 p-4 backdrop-blur-sm">
          <div class="text-sm text-white text-center">
            {{ error }}
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 shadow-lg"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!loading" class="h-5 w-5 text-purple-300 group-hover:text-purple-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? '处理中...' : (showSignup ? '注册' : '登录') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login, signup, clearAuthData } from '../services/authService';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showSignup = ref(false);
const router = useRouter();

// 清除之前的认证数据
onMounted(() => {
  clearAuthData();
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = '请填写所有字段';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (showSignup.value) {
      // 注册
      await signup(email.value, password.value);
      error.value = '注册成功！请检查邮箱确认账户。';
    } else {
      // 登录
      await login(email.value, password.value);
      router.push('/projects');
    }
  } catch (err: any) {
    console.error('认证错误:', err);
    error.value = err.message || (showSignup.value ? '注册失败' : '登录失败');
  } finally {
    loading.value = false;
  }
};
</script>