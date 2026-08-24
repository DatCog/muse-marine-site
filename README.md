# MUSE MARINE 官网开发说明书

> 本文件是 MUSE MARINE 官网（`DatCog/muse-marine-site`，私有仓库）的唯一开发入口文档。后续任何会话想继续开发/修改本站，先完整读取本文件，再按"产品页维护指南"和"首页核心产品维护"两节操作。

## 1. 项目概况

MUSE MARINE（缪斯海事）公司官网，面向国际船舶行业客户，主打**海事工业电池与船用电子设备**。当前站点内容基于《小电池.xlsx》的 56 个实际 SKU 重建了产品体系，并确定了三大主打产品方向：

1. **PLC 内存备份电池**（OMRON CJ1W/CS1W/CPM2A/C200H、三菱 Q6BAT/A6BAT/FX3U/FX2NC、东芝 ER17500V 等带插头电池）
2. **工业锂亚电池 Li-SOCl2 3.6V**（Saft LS14500/LS14250/LS17500、ER6C/ER3V、Maxell、东芝）
3. **救生艇充电器与电源模块**（CD4212-1/CD4212-2、CY1-12-5/CY2-12-5、魏德米勒 LA-BA24V）

## 2. 技术栈与目录结构

- 纯静态 HTML：每个页面是一个 `<main>` 内容文件，由 Node 脚本拼接公共头/导航/页脚生成
- Tailwind CSS 3.4（本地编译，无 CDN）
- 零 JS 依赖（只有少量原生页面脚本：轮播、筛选、表单）
- 构建：`build.mjs`（拼接 HTML + 生成 sitemap/robots）+ tailwindcss

```
src/
  _partials/          head.html / nav.html / footer.html / scripts.html（全站公共部分）
  pages/              index.html 首页、products.html 产品页、about/cases/services/news/contact/privacy/terms
  input.css           Tailwind 入口 + 自定义动画
  assets/             logo.png、favicon.svg
build.mjs             全站配置 + HTML 拼接 + robots.txt/sitemap.xml 生成
package.json          npm 脚本（build / dev）
dist/                 构建产物（git 忽略，不要手改）
```

## 3. 本地构建方法

```bash
pnpm install
pnpm build
```

产物输出到 `dist/`。本机注意：`node` 不在系统 PATH，用工作区自带的运行时：

```powershell
$node = "C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$pnpm = "C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
& $pnpm install
& $pnpm build
```

## 4. 页面清单

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 首页 | `src/pages/index.html` | 轮播 + 三大主打品 + 案例 + 环保 + 新闻 + 导流 |
| 产品页 | `src/pages/products.html` | 56 个 SKU 卡片 + 7 个分类筛选 |
| 关于/案例/服务/新闻/联系 | 同名文件 | 品牌内容页，联系方式与表单可配置 |
| 隐私/条款 | `privacy.html` / `terms.html` | 法律页 |

## 5. 产品页维护指南（最重要）

### 5.1 分类体系（勿随意改 id，首页链接依赖它们）

| 分类 id | 按钮文案 | 内容 |
| --- | --- | --- |
| `liso` | Li-SOCl2 3.6V | 工业锂亚电池 LS/ER 系列 |
| `plc` | PLC Backup | 欧姆龙/三菱/东芝 PLC 带插头电池 |
| `coin` | Coin Cells | CR/BR 纽扣电池 |
| `cyl` | Cylindrical Li | 18650/CR123A/CR14250SE/CR18505 等 |
| `nimh` | NiMH & Rechargeable | VARTA 镍氢、AA/AAA 可充、9V 可充 |
| `charger` | Chargers & Modules | 救生艇充电器、魏德米勒电源模块 |
| `general` | Accessories | 通用电池与船用配件 |

分类筛选按钮在 `products.html` 顶部 `section` 里；筛选脚本在文件底部 `<script>`（白名单数组 `['liso','plc','coin','cyl','nimh','charger','general']`）。**新增分类时两个地方都要改。**

### 5.2 如何新增/修改一个产品

在 `products.html` 的 `#products-grid` 里复制任意一张卡片，按模板修改：

```html
<div class="product-card ..." data-category="plc">
  <!-- 图标 SVG（可复用同分类图标） -->
  <span class="...">PLC Backup Battery</span>            <!-- 分类徽标 -->
  <h3>OMRON CJ1W-BAT01 (with plug)</h3>                  <!-- 产品标题 = 型号 -->
  <p>一句话英文描述</p>
  <!-- 参数行：每行是一个 label/value，最多 4 行 -->
  <div class="flex justify-between"><span>Voltage:</span><span>3 V</span></div>
  <!-- 询价链接：product= 后接型号（会被带到联系页表单） -->
  <a href="contact.html?product=CJ1W-BAT01">Request Quote</a>
</div>
```

要点：
- `data-category` 必须是 5.1 的分类 id，否则筛选不出来；
- 参数行放在卡片中间的参数容器里，标签用 `Voltage/Capacity/Size/Termination/System/Brand` 等英文；
- 询价链接 `product=` 参数会自动填入联系页的 "Required IMPA Battery Code / Model" 输入框；
- **不要添加价格、库存（In Stock/Build to Order）等字段** —— 按公司要求产品页不展示价格和库存，客户统一走询价。

### 5.3 当前产品数据来源

卡片数据来自《小电池.xlsx》56 行 SKU（商品编码前缀 `17.BG-DC` / `17.BG-DC-NC` 等）。Excel 原件在公司电脑桌面 `C:\Users\Administrator\Desktop\小电池.xlsx`，提取快照在 `work/battery_xlsx_rows.json`（本仓库不含，仅本地工作区）。

### 5.4 导航栏二级菜单（Products 下拉）

导航栏的 Products 带二级下拉（`src/_partials/nav.html`）：

- **桌面端**：悬浮 Products 弹出 7 个分类（`products.html?category=xxx`），带 `data-cat-link` 属性；
- **移动端**：Products 是可展开的 `<details>` 子菜单；
- 进入 `products.html?category=xxx` 时，共享脚本（`src/_partials/scripts.html`）会自动高亮对应分类项。

**新增分类时需同步 3 处**：① `products.html` 筛选按钮；② 卡片 `data-category`；③ 导航下拉链接（桌面 + 移动各一次）。

## 6. 首页核心产品维护

首页 `src/pages/index.html` 中"Core Products."板块的 3 张卡片 = 三大主打品，各自链接到产品页分类：

| 卡片标题 | 链接 | 对应分类 |
| --- | --- | --- |
| PLC Memory Backup Batteries | `products.html?category=plc` | plc |
| Industrial Li-SOCl2 Cells | `products.html?category=liso` | liso |
| Lifeboat Chargers & Power Modules | `products.html?category=charger` | charger |

改主打品 = 改这 3 张卡片的标题/型号行/描述/链接。改卡片时保持 `delay-100/delay-200` 的入场错峰。

## 7. 全站配置（build.mjs 顶部的 site 对象）

以下信息目前仍是占位符，**等用户提供真实资料后替换**：

| 配置项 | 当前值 | 说明 |
| --- | --- | --- |
| `url` | `https://musemarine.com` | 真实域名待定 |
| `phone` | `+1 (555) 123-4567` | 真实电话待补 |
| `address` | `123 Harbor Way, Port City` | 真实地址待补 |
| `email/salesEmail/supportEmail` | `info@musemarine.com` 等 | 真实邮箱待补 |
| `ogImage` | i.ibb.co 外链图 | 建议改成本地/正式域名图片 |
| `formEndpoint` + `web3formsKey` | web3forms 已配置 | 询盘表单已可用 |

公司 Logo 在 `src/assets/logo.png`（官网导航栏 M 字形 logo），已在导航使用；如需在单据系统等其它地方使用，可从该文件复制。

## 8. 部署与发布

### 8.1 本地推送（本机特殊注意事项）

- 本机对 `github.com` 直连不稳定，`git push` 可能失败；
- 已登录 `gh`（账号 DatCog），可用 `gh` 相关命令；
- 若 `git push` 失败，改用 Git Data API 推送（参考工作区 `work/push_repo.py`，把仓库名换成 `DatCog/muse-marine-site`，Token 用 `gh auth token` 输出值设置到环境变量 `SG_GITHUB_TOKEN`）。

### 8.2 CI 与托管

`.github/workflows/build.yml`：push 到 `main` 后自动 `pnpm install && pnpm build`，产物 `dist/` 上传为 artifact。站点可部署到 Netlify/Vercel/Cloudflare Pages 等任意静态托管（构建命令 `pnpm build`，输出目录 `dist`）。

## 9. 版本记录

### v1.1.1（2026-08-24）

- 导航栏 Products 新增二级下拉菜单：桌面悬浮展开 7 大分类，移动端可展开子菜单；
- 进入指定分类页时自动高亮当前分类；
- 本 README 补充导航维护说明（5.4）。

### v1.1.0（2026-08-24）

- 产品页重做：按《小电池.xlsx》重建为 **56 个 SKU、7 大分类**的产品体系，每张卡片含型号、参数、询价链接；
- **移除产品卡片上的库存徽标（In Stock / Build to Order）**；全站不展示价格与库存（按要求）；
- 首页 Core Products 换成三大主打品：PLC 备份电池、工业锂亚电池、救生艇充电器，并更新对应分类链接；
- 更新产品页 SEO description/keywords 与 sitemap 日期；
- 本 README 重写为完整开发说明书。

### v1.0.0（2026-08-14 前后）

- 原静态站重构：Tailwind 本地编译、模板 partials、询盘表单接 web3forms。

## 10. 后续待办（下次继续开发时优先）

1. **替换占位联系方式**：真实电话、邮箱、地址、域名（见第 7 节）；
2. **图片本地化**：hero 轮播图目前在 i.ibb.co 外链，建议下载到 `src/assets/`；
3. **News 文章页**：新闻卡片目前都指向 `news.html` 本身，需建独立文章页；
4. **产品图片**：56 个 SKU 目前用 SVG 示意图，后续可逐品类替换成真实产品图（建议先做三大主打品）；
5. **中英文双语**：如需加中文版，可加 `lang` 参数或独立中文页面；
6. **与单据系统联动**：客户询价后可用 sg-trade-docs 系统直接出 Quotation/Invoice/DO。
