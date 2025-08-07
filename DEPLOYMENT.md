# 项目部署指南

本文档详细说明如何将项目管理系统部署到生产环境。前端将部署到 Netlify，后端将部署到 Render。

## 部署架构

- **前端**: Vue 3 + Vite + UnoCSS + TypeScript 部署到 Netlify
- **后端**: Node.js + Express 部署到 Render
- **数据库**: Supabase

## 前端部署到 Netlify

### 1. 准备工作

1. 确保前端代码已经完成并测试通过
2. 注册 [Netlify](https://netlify.com) 账户
3. 准备好需要的环境变量:
   - `VITE_API_URL`: 后端 API 地址 (部署后端后获取)
   - `VITE_SUPABASE_URL`: Supabase 项目 URL
   - `VITE_SUPABASE_KEY`: Supabase 项目密钥

### 2. 构建项目

在本地构建项目以确保一切正常工作:

```bash
cd frontend
npm run build
```

### 3. 通过 Netlify CLI 部署 (推荐)

1. 安装 Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. 登录 Netlify:
   ```bash
   netlify login
   ```

3. 初始化项目:
   ```bash
   cd frontend
   netlify init
   ```

4. 配置构建设置:
   - 构建命令: `npm run build`
   - 发布目录: `dist`

5. 设置环境变量:
   ```bash
   netlify env:set VITE_API_URL https://your-backend-url.onrender.com/api
   netlify env:set VITE_SUPABASE_URL your-supabase-url
   netlify env:set VITE_SUPABASE_KEY your-supabase-key
   ```

6. 部署:
   ```bash
   netlify deploy --prod
   ```

### 4. 通过 Git 部署

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Netlify 控制台:
   - 点击 "New site from Git"
   - 选择你的代码仓库
   - 配置构建设置:
     - 构建命令: `npm run build`
     - 发布目录: `dist`
   - 添加环境变量
   - 点击 "Deploy site"

## 后端部署到 Render

### 1. 准备工作

1. 注册 [Render](https://render.com) 账户
2. 准备好需要的环境变量:
   - `SUPABASE_URL`: Supabase 项目 URL
   - `SUPABASE_KEY`: Supabase 项目密钥
   - `PORT`: Render 使用的端口 (Render 会自动设置)

### 2. 通过 Render Web Service 部署

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Render 控制台:
   - 点击 "New+" -> "Web Service"
   - 选择你的代码仓库
   - 填写服务设置:
     - Name: 项目名称 (如 `project-management-api`)
     - Runtime: Node
     - Build command: `npm install`
     - Start command: `npm start`
   - 设置环境变量:
     - `SUPABASE_URL`: your-supabase-url
     - `SUPABASE_KEY`: your-supabase-key
   - 点击 "Create Web Service"

### 3. 手动部署配置

如果需要更精细的控制，可以创建 `render.yaml` 配置文件:

```yaml
services:
  - type: web
    name: project-management-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

## 环境变量配置

### 前端环境变量 (.env.production)

```env
VITE_API_URL=https://your-backend-service.onrender.com/api
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-project-key
```

### 后端环境变量

在 Render 控制台设置以下环境变量:
- `SUPABASE_URL`: your-supabase-project-url
- `SUPABASE_KEY`: your-supabase-project-key

## 数据库配置

确保 Supabase 数据库表已创建:

1. 登录 Supabase 控制台
2. 进入 SQL 编辑器
3. 执行以下 SQL 脚本创建表:

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  managers JSONB DEFAULT '[]',
  upstream_contacts JSONB DEFAULT '[]',
  downstream_contacts JSONB DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'task',
  project_id INTEGER REFERENCES projects(id),
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  planned_completion_date DATE,
  actual_completion_date DATE,
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 部署后验证

1. 访问前端 URL，确保页面正常加载
2. 尝试登录或注册新用户
3. 创建、编辑和删除项目和任务
4. 检查数据是否正确保存到数据库

## 常见问题及解决方案

### 1. CORS 错误
确保后端正确配置了 CORS 中间件:
```javascript
app.use(cors());
```

### 2. 环境变量未生效
- 检查环境变量名称是否正确
- 确保前端环境变量以 `VITE_` 开头
- 重新部署以使环境变量生效

### 3. 数据库连接失败
- 检查 Supabase URL 和密钥是否正确
- 确保 Supabase 项目已启用并可访问
- 检查网络连接

### 4. API 请求失败
- 确认后端服务已成功部署并运行
- 检查前端 `VITE_API_URL` 是否指向正确的后端地址

## 后续维护

1. 定期更新依赖包
2. 监控应用性能和错误日志
3. 备份数据库
4. 跟踪安全更新