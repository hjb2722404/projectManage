import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { onAuthStateChange } from './services/authService';
// @ts-ignore
import 'uno.css';

// 创建应用实例
const app = createApp(App);

// 创建并使用 Pinia
const pinia = createPinia();
app.use(pinia);

// 使用路由
app.use(router);

// 监听认证状态变化
onAuthStateChange((event, _session) => {
  console.log('认证状态变化:', event);
  
  // 如果用户登出，重定向到登录页
  if (event === 'SIGNED_OUT') {
    router.push('/login');
  }
});

// 挂载应用
app.mount('#app');