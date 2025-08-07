# 数据库设置指南

## 问题说明

当前系统遇到以下错误：
```
"Could not find the table 'public.projects' in the schema cache"
"Could not find the table 'public.tasks' in the schema cache"
```

这是因为 Supabase 数据库中缺少必要的表结构。

## 解决方案

### 方法一：通过 Supabase 控制台执行 SQL

1. 登录到 [Supabase 控制台](https://app.supabase.com/)
2. 选择你的项目
3. 在左侧菜单中点击 "SQL Editor"
4. 点击 "New query"
5. 复制并粘贴 [init-database.sql](file:///d:/projects/studyProjects/projectManage/backend/init-database.sql) 文件中的内容到编辑器中
6. 点击 "Run" 执行 SQL 脚本

### 方法二：使用 Supabase CLI（如果已安装）

1. 确保已安装 Supabase CLI
2. 在项目根目录执行以下命令：
   ```bash
   supabase link --project-ref your_project_id
   supabase db push
   ```

## 表结构说明

### Projects 表
- `id`: 项目唯一标识符（自增）
- `name`: 项目名称
- `managers`: 项目管理人员（JSON数组）
- `upstream_contacts`: 上游对接人（JSON数组）
- `downstream_contacts`: 下游对接人（JSON数组）
- `start_date`: 项目开始日期
- `end_date`: 项目结束日期
- `created_at`: 创建时间
- `updated_at`: 更新时间

### Tasks 表
- `id`: 任务唯一标识符（自增）
- `name`: 任务名称
- `type`: 任务类型（默认为'task'）
- `project_id`: 关联的项目ID（外键）
- `description`: 任务描述
- `status`: 任务状态（默认为'todo'）
- `created_at`: 创建时间
- `due_date`: 截止日期
- `planned_completion_date`: 计划完成日期
- `actual_completion_date`: 实际完成日期
- `progress`: 完成进度（0-100）
- `updated_at`: 更新时间

## 验证表创建成功

执行完上述步骤后，重启你的后端服务并刷新前端页面，应该就不会再看到表不存在的错误了。

## 其他注意事项

如果仍然遇到认证相关问题（如 refresh_token_already_used），可以在 Supabase 控制台的 "Authentication" 部分重置用户会话或创建新用户。