# GitHub Pages 部署指南

## 步骤 1: 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `airplane-search` (或您喜欢的名称)
   - Description: `Flight search application with filtering capabilities`
   - 选择 "Public" (GitHub Pages 免费版需要公开仓库)
   - **不要**勾选 "Add a README file"、"Add .gitignore" 或 "Choose a license"
4. 点击 "Create repository"

## 步骤 2: 连接本地仓库到 GitHub

创建仓库后，GitHub 会显示快速设置页面。复制仓库的 HTTPS URL（类似：`https://github.com/yourusername/airplane-search.git`）

然后在终端中运行以下命令（请替换为您的实际仓库 URL）：

```bash
git remote add origin https://github.com/yourusername/airplane-search.git
git push -u origin main
```

## 步骤 3: 启用 GitHub Pages

1. 在您的 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"

## 步骤 4: 访问您的网站

几分钟后，您的网站将在以下地址可用：
`https://yourusername.github.io/airplane-search/`

## 注意事项

- 首次部署可能需要几分钟时间
- 每次推送到 main 分支都会自动更新网站
- 确保 index.html 文件在仓库根目录

## 故障排除

如果遇到问题：

1. 检查仓库是否为 Public
2. 确认 GitHub Pages 设置正确
3. 等待几分钟让部署完成
4. 检查浏览器控制台是否有错误信息
