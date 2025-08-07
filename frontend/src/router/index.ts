import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import Projects from '../views/Projects.vue';
// @ts-ignore
import Tasks from '../views/Tasks.vue';
// @ts-ignore
import Login from '../views/Login.vue';
import { getCurrentUser } from '../services/authService';

const routes = [
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 添加路由守卫
router.beforeEach(async (to, _from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    const user = await getCurrentUser();
    
    if (!user) {
      // 如果用户未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // 如果用户已登录，允许访问
      next();
    }
  } else {
    // 不需要认证的路由直接允许访问
    next();
  }
});

export default router;