# SensoryPath 🧭

> A personalised, sensory-aware itinerary app for neurodivergent commuters in Melbourne CBD.
> FIT5120 TE08 — Monash University

---

## 快速开始（本地运行）

### 前提条件

请确保你的电脑已安装以下工具：

- [Node.js](https://nodejs.org/) **v18 或以上版本**（推荐 v20）
- npm（随 Node.js 自动安装）
- Git

可以在终端运行以下命令检查版本：

```bash
node -v    # 应显示 v18.x.x 或以上
npm -v     # 应显示 9.x.x 或以上
git --version
```

---

### 第一步：克隆仓库

```bash
git clone -b Geng https://github.com/jgen0012-sketch/tenacious-innovator.git
cd tenacious-innovator
```

---

### 第二步：安装依赖

```bash
npm install
```

> 安装完成后，`node_modules` 文件夹会自动生成，大约需要 15–30 秒。

---

### 第三步：配置环境变量（必须）

项目使用 Mock 数据在没有后端的情况下正常运行。需要在项目**根目录**新建一个 `.env.local` 文件：

**方法一：手动创建**

在项目根目录（和 `package.json` 同级）新建文件 `.env.local`，内容如下：

```
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080
```

**方法二：命令行创建（Mac/Linux）**

```bash
echo "VITE_USE_MOCK=true" > .env.local
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env.local
```

**方法二：命令行创建（Windows PowerShell）**

```powershell
"VITE_USE_MOCK=true`nVITE_API_BASE_URL=http://localhost:8080" | Out-File -FilePath .env.local -Encoding utf8
```

> ⚠️ 注意：`.env.local` 文件不会被提交到 Git（已在 `.gitignore` 中忽略），每个人 pull 下来都需要自己创建这个文件。

---

### 第四步：启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示：

```
VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

打开浏览器访问 **http://localhost:5173** 即可看到项目。

---

### 常见问题

**Q：启动后地图不显示或页面空白？**
A：检查 `.env.local` 文件是否存在，且内容中 `VITE_USE_MOCK=true` 是否正确。

**Q：`npm install` 报错？**
A：尝试删除 `node_modules` 文件夹和 `package-lock.json`，然后重新运行 `npm install`。

**Q：端口 5173 被占用？**
A：Vite 会自动切换到 5174、5175 等，注意看终端输出的实际地址。

---

## 页面导航

| 页面 | 地址 | 功能描述 |
|------|------|----------|
| 首页 | `/` | Google Maps 风格全屏地图，显示 8 个传感器实时人流密度（🟢🟡🔴） |
| 实时地图 | `/map` | 全屏 Leaflet 地图，左侧列出所有传感器状态 |
| 路线规划 | `/route` | 输入起终点，返回 3 条不同感官强度的路线 |
| 安静空间 | `/refuges` | 附近公园、图书馆、咖啡馆等低感官场所推荐 |
| 我的偏好 | `/profile` | 设置个人感官阈值、步行距离、提醒开关 |

---

## 项目结构

```
src/
├── api/                  # API 接口层
│   ├── client.js         # Axios 实例（含 JWT 拦截）
│   ├── pedestrian.js     # 行人计数系统接口
│   ├── landmarks.js      # 地标/兴趣点接口
│   ├── routes.js         # 路线规划接口
│   ├── user.js           # 用户账户接口
│   └── mockData.js       # 本地 Mock 数据（开发用）
├── components/
│   ├── common/           # NavBar、Footer、CrowdBadge
│   ├── map/              # LeafletMap 可复用地图组件
│   ├── route/            # RouteCard、SensoryIndicator
│   └── refuge/           # RefugeCard
├── stores/               # Pinia 状态管理
│   ├── usePedestrianStore.js
│   ├── useRouteStore.js
│   ├── useLandmarkStore.js
│   └── useUserStore.js
├── router/               # Vue Router 路由配置
├── views/                # 5 个页面视图
│   ├── HomeView.vue
│   ├── MapView.vue
│   ├── RouteView.vue
│   ├── RefugesView.vue
│   └── ProfileView.vue
├── App.vue
└── main.js
```

---

## Tech Stack

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| 地图 | Leaflet |
| HTTP 请求 | Axios |
| 部署 | Cloudflare Pages |
| CI/CD | GitHub Actions |

---

## 后端 API 接口说明

> 当 `VITE_USE_MOCK=false` 时，前端会请求真实后端。以下是后端需要实现的接口：

### 行人计数（Pedestrian）

| Method | Path | 描述 |
|--------|------|------|
| GET | `/pedestrian/sensors` | 获取所有传感器位置 |
| GET | `/pedestrian/counts/minute` | 获取每分钟实时人流数据（每 15 分钟刷新） |
| GET | `/pedestrian/counts/hour` | 获取每小时人流数据 |
| GET | `/pedestrian/sensors/:id/history` | 获取传感器历史数据 |
| GET | `/pedestrian/crowd-level` | 获取某区域当前拥挤度评分 |
| GET | `/pedestrian/forecast` | 获取未来 1 小时预测人流 |

### 地标（Landmarks）

| Method | Path | 描述 |
|--------|------|------|
| GET | `/landmarks` | 获取所有地标 |
| GET | `/landmarks/refuges/nearby` | 获取附近安静空间 |
| GET | `/landmarks/:id` | 获取地标详情 |
| GET | `/landmarks/types` | 获取地标类型列表 |

### 路线（Routes）

| Method | Path | 描述 |
|--------|------|------|
| POST | `/routes/pedestrian` | 规划感官友好路线 |
| GET | `/routes/:id/crowd` | 获取路线沿途人群数据 |
| POST | `/routes/alternative` | 获取替代路线（人流超出阈值时） |
| GET | `/routes/geocode` | 地址转坐标 |

### 用户（Users）

| Method | Path | 描述 |
|--------|------|------|
| POST | `/users/register` | 注册 |
| POST | `/users/login` | 登录，返回 JWT |
| GET | `/users/me` | 获取当前用户信息 |
| PUT | `/users/me/preferences` | 更新感官偏好设置 |
| GET | `/users/me/history` | 获取历史路线记录 |
| POST | `/users/me/saved-refuges` | 收藏避难场所 |

---

## Cloudflare Pages 部署

项目配置了两个独立的 Cloudflare Pages 环境：

| 环境 | CF 项目名 | GitHub 分支 | 域名 |
|------|-----------|-------------|------|
| 生产 | `sensorypath` | `main` | `sensorypath.pages.dev` |
| 预览 | `sensorypath-staging` | `staging` | `sensorypath-staging.pages.dev` |

### 部署步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 点击 **Connect to Git** → 选择 `jgen0012-sketch/tenacious-innovator`
4. 分支选择 `Geng`（或 `main`）
5. 填写 Build 配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 在 **Environment Variables** 中添加：
   - `VITE_USE_MOCK` = `false`（生产环境使用真实 API）
   - `VITE_API_BASE_URL` = 后端真实地址
7. 点击 **Save and Deploy**

---

## 数据来源

- [行人计数系统 – 传感器位置](https://data.melbourne.vic.gov.au)
- [行人计数系统 – 每分钟数据](https://data.melbourne.vic.gov.au)
- [行人计数系统 – 每小时数据](https://data.melbourne.vic.gov.au)
- [地标与兴趣点数据](https://data.melbourne.vic.gov.au)
