# 航班筛选系统 Flight Filter System

一个基于 HTML/JavaScript 的航班数据筛选和可视化系统，支持多种筛选条件和实时数据展示。

## 功能特性

- 🛫 航班数据实时筛选
- 🌍 支持航空公司、出发地、目的地筛选
- 📊 数据统计和可视化
- 📱 响应式设计，支持移动端
- 🔄 自动从在线数据源获取最新数据

## 项目结构

```
airplane-search/
├── index.html          # 主页面文件
├── flights_data.json   # 航班数据文件
├── _redirects          # Netlify重定向配置
├── netlify.toml        # Netlify部署配置
├── vercel.json         # Vercel部署配置
└── README.md           # 项目说明文档
```

## 本地运行

1. 克隆或下载项目到本地
2. 在项目根目录启动本地服务器：
   ```bash
   python3 -m http.server 8000
   # 或者使用Node.js
   npx serve .
   ```
3. 打开浏览器访问 `http://localhost:8000`

## 部署选项

### 1. GitHub Pages 部署

**步骤：**

1. 将项目推送到 GitHub 仓库
2. 进入仓库设置页面
3. 找到"Pages"选项
4. 选择"Deploy from a branch"
5. 选择"main"分支和"/ (root)"文件夹
6. 点击"Save"保存设置
7. 等待几分钟后，访问 `https://yourusername.github.io/repository-name`

**优点：**

- 完全免费
- 与 GitHub 集成良好
- 自动部署

### 2. Netlify 部署

**方法一：拖拽部署**

1. 访问 [Netlify](https://netlify.com)
2. 注册/登录账户
3. 将项目文件夹直接拖拽到 Netlify 部署区域
4. 等待部署完成，获得访问链接

**方法二：Git 集成**

1. 将项目推送到 GitHub/GitLab
2. 在 Netlify 中选择"New site from Git"
3. 连接你的 Git 仓库
4. 选择分支（通常是 main）
5. 构建设置保持默认（静态站点无需构建）
6. 点击"Deploy site"

**优点：**

- 免费额度充足
- 支持自定义域名
- 自动 HTTPS
- 表单处理功能

### 3. Vercel 部署

**步骤：**

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击"New Project"
4. 选择你的 GitHub 仓库
5. 保持默认设置，点击"Deploy"
6. 等待部署完成

**优点：**

- 极快的全球 CDN
- 自动优化
- 零配置部署
- 优秀的开发者体验

### 4. 其他部署选项

**Surge.sh（命令行部署）：**

```bash
npm install -g surge
surge
```

**Firebase Hosting：**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 配置说明

### 数据源配置

项目默认从 `https://flight-route.surge.sh/flights_data.json` 获取航班数据。如需修改数据源，请编辑 `index.html` 文件中的 `loadFlightData` 函数。

### 跨域问题解决

如果遇到跨域问题，项目已配置本地数据源作为备用方案。确保 `flights_data.json` 文件存在于项目根目录。

## 技术栈

- HTML5
- CSS3 (响应式设计)
- Vanilla JavaScript
- Fetch API
- JSON 数据处理

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**快速部署链接：**

- [部署到 Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/airplane-search)
- [部署到 Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/airplane-search)
