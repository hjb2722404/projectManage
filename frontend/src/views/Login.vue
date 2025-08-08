<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
    <div class="relative z-10 max-w-md w-full space-y-8 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-800">
          项目管理系统
        </h2>
        <p class="mt-2 text-center text-sm text-gray-700">
          {{ showSignup ? '创建新账户' : '登录到您的账户' }}
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">邮箱地址</label>
            <!-- 使用OpenTiny Vue输入框组件 -->
            <tiny-input
              id="email-address"
              name="email"
              type="text"
              required
              v-model="email"
              placeholder="邮箱地址"
              :valid-type="validType"
            ></tiny-input>
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <!-- 使用OpenTiny Vue密码框组件 -->
            <tiny-input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              placeholder="密码"
              :valid-type="validType"
            ></tiny-input>
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
          <!-- 使用OpenTiny Vue按钮组件 -->
          <tiny-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 shadow-lg"
          >
            {{ loading ? '处理中...' : (showSignup ? '注册' : '登录') }}
          </tiny-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login, signup, clearAuthData } from '../services/authService';

// 引入OpenTiny Vue组件
import { Input as TinyInput, Button as TinyButton } from '@opentiny/vue';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showSignup = ref(false);
const router = useRouter();
const validType = ref('text');

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
    // 处理特定的认证错误
    if (err.message === 'Invalid Refresh Token: Already Used') {
      error.value = '会话已过期，请重新登录。';
    } else {
      error.value = err.message || (showSignup.value ? '注册失败' : '登录失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>