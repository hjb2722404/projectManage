import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://apsclhrgghvefoqhgggz.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 登录函数
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('登录错误:', error);
    // 处理特定的认证错误
    if (error.message === 'Invalid Refresh Token: Already Used') {
      // 如果是刷新令牌错误，清除本地认证数据并重新登录
      clearAuthData();
    }
    throw error;
  }
};

// 注册函数
export const signup = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('注册错误:', error);
    throw error;
  }
};

// 登出函数
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('登出错误:', error);
      // 即使有错误也继续清除本地数据
    }
    
    // 清除认证数据
    clearAuthData();
    
    return { success: true };
  } catch (error) {
    console.error('登出错误:', error);
    // 即使有异常也继续清除本地数据
    clearAuthData();
    throw error;
  }
};

// 清除认证数据
export const clearAuthData = () => {
  try {
    // 清除 localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // 清除 sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('已清除所有认证数据');
  } catch (error) {
    console.error('清除认证数据时出错:', error);
  }
};

// 获取当前用户
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // 如果有认证错误，清除本地数据
      if (error.message === 'Invalid Refresh Token: Already Used') {
        clearAuthData();
      }
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('获取当前用户错误:', error);
    return null;
  }
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // 处理认证状态变化
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      clearAuthData();
    }
    callback(event, session);
  });
  return subscription;
};