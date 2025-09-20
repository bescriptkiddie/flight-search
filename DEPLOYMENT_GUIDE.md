# 航班搜索项目 - GitHub Pages 部署指南

## 🚀 快速部署步骤

### 第一步：创建 GitHub 仓库

1. 打开 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `flight-search` (或您喜欢的名称)
   - **Description**: `航班搜索和筛选系统`
   - 选择 **Public** (GitHub Pages 免费版需要公开仓库)
   - **不要** 勾选 "Add a README file"、"Add .gitignore" 或 "Choose a license"
4. 点击 "Create repository"

### 第二步：连接本地仓库到 GitHub

在终端中执行以下命令（请将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/flight-search.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

### 第三步：启用 GitHub Pages

1. 在您的 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch: 选择 "main"
   - Folder: 选择 "/ (root)"
4. 点击 "Save"

### 第四步：访问您的网站

- GitHub Pages 会自动构建您的网站
- 几分钟后，您可以通过以下地址访问：
  `https://YOUR_USERNAME.github.io/flight-search/`

## 📋 项目特性

✅ **自动部署**: 每次推送代码都会自动更新网站
✅ **响应式设计**: 支持手机、平板、桌面设备
✅ **实时数据**: 自动从在线 API 获取最新航班信息
✅ **高级筛选**: 支持多条件筛选和排序
✅ **全球 CDN**: GitHub Pages 提供全球加速访问

## 🔧 本地开发

如需本地测试，运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`

## 📝 更新网站

要更新已部署的网站，只需：

```bash
git add .
git commit -m "更新描述"
git push
```

GitHub Pages 会自动重新部署您的更改。

## 🎯 下一步

- 考虑添加自定义域名
- 优化 SEO 设置
- 添加更多筛选功能
- 集成更多航班数据源

---

**需要帮助？** 如果遇到任何问题，请检查：

1. GitHub 仓库是否为 Public
2. 分支名称是否为 "main"
3. 文件是否正确推送到仓库
4. GitHub Pages 设置是否正确
