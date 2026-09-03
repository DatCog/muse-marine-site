# MUSE MARINE 官网开发说明书

> 本文件是 MUSE MARINE 官网（`DatCog/muse-marine-site`，私有仓库）的唯一开发入口文档。后续任何会话想继续开发/修改本站，先完整读取本文件，再按"产品页维护指南"和"首页核心产品维护"两节操作。

## 1. 项目概况

MUSE MARINE（缪斯海事）公司官网，面向国际船舶行业客户，主打**海事工业电池与船用电子设备**。当前站点基于《小电池.xlsx》的 56 个 SKU 重建产品体系，后经两轮扩改（补 GMDSS 分类 + 国产高性价比线、砍充电器/配件），现为 **79 个 SKU、6 大分类**，并确定了三大主打产品方向：

1. **GMDSS 安全电池**（EPIRB/SART/VDR/双向 VHF 强制更换电池，Jotron TR20、X-82615 SART、80059/80060、JRC NBB-248/NBB-389、McMurdo S4 SART 等）
2. **PLC 内存备份电池**（OMRON CJ1W/CS1W/CPM2A/C200H、三菱 Q6BAT/A6BAT/FX3U/FX2NC、东芝 ER17500V 等带插头电池）
3. **工业锂亚电池 Li-SOCl2 3.6V**（Saft LS14500/LS14250/LS17500、ER6C/ER3V、Maxell、东芝）

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
  assets/             logo.png、favicon.svg、images/（首页轮播与案例图，全部本地化）
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
| `gmdss` | GMDSS Safety | EPIRB/SART/VDR/双向 VHF 强制更换电池（Jotron、JRC、McMurdo 等） |
| `liso` | Li-SOCl2 3.6V | 工业锂亚电池 LS/ER 系列（进口 Saft/Maxell + 国产 EVE/Fanso） |
| `plc` | PLC Backup | 欧姆龙/三菱/东芝 PLC 带插头电池 |
| `coin` | Coin Cells | CR/BR 纽扣电池 |
| `cyl` | Cylindrical Li | 18650/CR123A/21700/CR2/锂锰柱式/锂离子 等 |
| `nimh` | NiMH & Rechargeable | VARTA 镍氢、AA/AAA 可充、9V 可充 |

分类筛选按钮在 `products.html` 顶部 `section` 里；筛选脚本在文件底部 `<script>`（白名单数组 `['gmdss','liso','plc','coin','cyl','nimh']`）。**新增分类时两个地方都要改。**

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

- **桌面端**：悬浮 Products 弹出 8 个分类（`products.html?category=xxx`），带 `data-cat-link` 属性；
- **移动端**：Products 是可展开的 `<details>` 子菜单；
- 进入 `products.html?category=xxx` 时，共享脚本（`src/_partials/scripts.html`）会自动高亮对应分类项。

**新增分类时需同步 3 处**：① `products.html` 筛选按钮；② 卡片 `data-category`；③ 导航下拉链接（桌面 + 移动各一次）。

## 6. 首页核心产品维护

首页 `src/pages/index.html` 中"Core Products."板块的 3 张卡片 = 三大主打品，各自链接到产品页分类：

| 卡片标题 | 链接 | 对应分类 |
| --- | --- | --- |
| GMDSS Safety Batteries | `products.html?category=gmdss` | gmdss |
| PLC Memory Backup Batteries | `products.html?category=plc` | plc |
| Industrial Li-SOCl2 Cells | `products.html?category=liso` | liso |

改主打品 = 改这 3 张卡片的标题/型号行/描述/链接。改卡片时保持 `delay-100/delay-200` 的入场错峰。

## 7. 全站配置（build.mjs 顶部的 site 对象）

以下信息目前仍是占位符，**等用户提供真实资料后替换**：

| 配置项 | 当前值 | 说明 |
| --- | --- | --- |
| `url` | `https://musemarine.com` | 真实域名待定 |
| `phone` | `+1 (555) 123-4567` | 真实电话待补 |
| `address` | `123 Harbor Way, Port City` | 真实地址待补 |
| `email/salesEmail/supportEmail` | `info@musemarine.com` 等 | 真实邮箱待补 |
| `ogImage` | `https://musemarine.com/assets/images/hero-1.jpg` | 已本地化，域名上线后自动生效 |
| `formEndpoint` + `web3formsKey` | web3forms 已配置 | 询盘表单已可用 |

公司 Logo 在 `src/assets/logo.png`（官网导航栏 M 字形 logo），已在导航使用；如需在单据系统等其它地方使用，可从该文件复制。

### 7.1 首页/案例图片维护

- 所有大图存放在 `src/assets/images/`：`hero-1.jpg`、`hero-2.jpg`（首屏轮播）、`case-1.jpg`、`case-2.jpg`、`case-3.jpg`（案例卡片）、`about-1.jpg`（关于页）、`news-1.jpg`/`news-2.jpg`（新闻页），引用路径为 `assets/images/xxx.jpg`；
- **当前全部大图为无水印原图**（v1.1.3 起按用户要求移除全部 logo 水印；如后续要加水印，需先由用户确认正确的 logo 文件）；
- 原 hero 图为 AVIF 格式，Pillow 写 AVIF 不可靠，已统一转为 JPG（质量 84，最长边 1920）本地化，避免外链依赖；
- `case-3.jpg` 原 Unsplash 图已 404 下架，换成 Wikimedia Commons 的救生艇吊艇架照片；`news-1.jpg` 原 Unsplash 图也 404，换成 Wikimedia Commons 的船舶机舱集控室照片；news 页头图复用 `case-1.jpg`。

## 8. 部署与发布

### 8.1 本地推送（本机特殊注意事项）

- 本机对 `github.com` 直连不稳定，`git push` 可能失败；
- 已登录 `gh`（账号 DatCog），可用 `gh` 相关命令；
- 若 `git push` 失败，改用 Git Data API 推送（参考工作区 `work/push_repo.py`，把仓库名换成 `DatCog/muse-marine-site`，Token 用 `gh auth token` 输出值设置到环境变量 `SG_GITHUB_TOKEN`）。

### 8.2 CI 与托管

`.github/workflows/build.yml`：push 到 `main` 后自动 `pnpm install && pnpm build`，产物 `dist/` 上传为 artifact。站点可部署到 Netlify/Vercel/Cloudflare Pages 等任意静态托管（构建命令 `pnpm build`，输出目录 `dist`）。

## 9. 版本记录

### v1.1.6（2026-09-03）

- **全站配色重设计**（`tailwind.config.js`）：弃用 Apple 黑白 + 通用企业蓝，改为海洋系配色 —— `appleDark` 深海蓝 `#0A2540`、`appleBlue` 海洋青 `#0E7C86`、新增 `appleAccent` 琥珀 `#F59E0B`（CTA/强调）、`appleGray` 雾白 `#F6F8FA`、`appleMuted` 石板灰 `#475569`、`appleEmerald` 青绿 `#2DD4BF`、`appleGreen` 深青绿 `#0F3D36`；footer 与首页 hero 的硬编码颜色同步改为深海蓝。
- **定位翻转「制造商 → 专业供应商」**：`build.mjs` about 页 title/description/keywords 由 `Manufacturer` 改为 `Specialist Marine Battery Supplier`；首页、关于页全文改写为诚实定位（懂船 / 快 / 专）。
- **首页去假**（`index.html`）：删除 3 个假案例（15 万 DWT 集装箱船队 / 北海钻井平台 / 救生艇充电器），替换为「Why Work With Us」能力板块（IMPA 匹配 / 小批量快发 / 专注单线）；删除 2 条假新闻（通过 SOLAS 认证 / 新一代研发），替换为 3 条真实行业趋势（GMDSS 2029 / IMO 脱碳 / 数字化采购）；新增首屏信任条（IMPA 对齐 · UN38.3+MSDS · 小批量空海运 · DDP 门到门）。
- **关于页去假**（`about.html`）：删除假里程碑（2016 成立 / 2020 认证 / 500+ 船队 / 三地仓）与假认证（CCS / CE / ISO9001 / IMPA Compliant），改为「How We Work」三步流程（匹配 / 采购核验 / 全球发货）与「随货提供文档」（UN38.3 / MSDS / IMPA 编码 / DDP）。
- **待办**：`cases.html`（假案例 + 假客户证言 + 500+/12M+ 假数据）与 `services.html`（三地仓 / 24×7 假承诺）尚未去假，属下一批。

### v1.1.7（2026-09-03）

- **案例页去假 + 重定位**（`cases.html`）：删除假客户证言（Capt. Magnus Lindstrom）、假数据（500+ 船队 / 12M 海里 / 99.9% 可靠率）、3 个假案例（15,000 TEU 锂电替换 / LNG 油轮 ATEX / 北海 OSV AGM），整页重写为「Applications & Use Cases」——用真实行业事实（~95,000 艘商船 2029 前 GMDSS 升级、4-5 年更换周期、IMPA Class 17）＋ 六个应用场景卡片（对应六大分类）；
- **服务页去假**（`services.html`）：删除假承诺（24/7 支持、Rotterdam/Singapore/Shanghai 三地仓），改为诚实的「文档＋物流＋合规」支持（UN38.3 / MSDS / IMPA 匹配、小批量空海运、DDP 门到门）；FAQ 澄清 IMPA 是编码而非认证；表单「12 小时响应」改为「一个工作日内回复」；
- **联系页去假**（`contact.html`）：删除假仓库点（Rotterdam/Singapore/Shanghai/Houston）、24/7 热线、regional hubs / next-port-of-call 话术，改为「交付方式」（空运 / 海运 LCL / DDP / 电池小包专线）；响应承诺统一为「一个工作日」；
- **导航与 SEO**：`nav.html` 桌面＋移动端「Cases」标签改为「Applications」；`build.mjs` cases/services 页 title/description/keywords 同步去假。

### v1.1.5（2026-09-03）

- **删除 `charger`（Chargers & Modules）与 `general`（Accessories）两个分类**：移除筛选按钮、12 张卡片、导航下拉链接（桌面 + 移动）、白名单项，同步清理首页案例标题/新闻摘要与 `build.mjs` SEO 中 charger/shipboard accessories 相关文案；
- **补 26 张国产高性价比 SKU 卡片**（打价格差，UNICELL 在售同款）：
  - `gmdss` +2（Furuno BP-1207、Sailor SP3520）；
  - `liso` +10（国产锂亚 ER14250/ER14505/ER17335/ER17505/ER18505/ER26500/ER34615/ER9V/ER14335/ER10450，与进口 Saft/Maxell 并列）；
  - `coin` +4（CR2025/CR2016/CR2430/CR2320）；
  - `cyl` +10（锂锰柱式 CR2/CR1/3N/CR14250/CR14505/CR17335/CR17450/CR17505 + 锂离子 21700/14500/16340）；
- 最终产品页为 **79 个 SKU / 6 大分类**（gmdss/liso/plc/coin/cyl/nimh），hero 描述与 SEO 数字同步为 70+。

### v1.1.4（2026-08-31）

- **新增 GMDSS Safety 分类**（`gmdss`），产品页加入 9 张 GMDSS 安全电池卡片（EPIRB/SART/VDR/双向 VHF，含 Jotron TR20、X-82615 SART、80059/80060、JRC NBB-248/NBB-389、McMurdo S4 SART 等），同步更新筛选按钮、白名单数组、导航下拉（桌面 + 移动）；
- **首页三大主打品调整**：主打品 1 由 PLC 改为 GMDSS Safety Batteries（链接 `?category=gmdss`），主打品 2=PLC 备份、主打品 3=锂亚（移除救生艇充电器主打位）；
- **新闻页**：头条替换为《GMDSS 2029 Deadline》强制更换潮（IMO MSC.511(105)、约 95,000 艘商船），新增两篇行业分析卡片（IMO 脱碳时间表 CII/EEXI/碳定价、船供数字化去中介化 Moscord/ShipServ）；
- **SEO**：`build.mjs` 更新 index/products 页 title/description/keywords，加入 GMDSS safety batteries 关键词。

### v1.1.3（2026-08-24）

- 按用户要求**移除全部大图上的 logo 水印**，8 张图全部从原始来源重新下载恢复为无水印原图；
- 图片仍保持本地化（hero/news 最长边统一 1920、JPG 质量 84）；
- 本 README 7.1 改为"图片维护"，删除水印相关说明。

### v1.1.2（2026-08-24）

- **全站大图（首页 5 张 + 关于页 1 张 + 新闻页 3 处）全部本地化**到 `src/assets/images/`（hero-1/hero-2 由 AVIF 转 JPG），移除 i.ibb.co / Unsplash 外链依赖；
- **所有大图叠加公司 M logo 水印**（右下角半透明，约 65% 透明度，带柔和投影）；
- `case-3.jpg` 原图 404，换用 Wikimedia Commons 救生艇吊艇架照片；
- `build.mjs` 改为递归复制 `src/assets`（此前 images/ 子目录不会被复制到 dist，属修复）；`ogImage` 改为本地 hero-1.jpg；
- 本 README 补充 7.1 图片与水印维护说明。

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
2. **News 文章页**：新闻卡片目前都指向 `news.html` 本身，需建独立文章页；
3. **产品图片**：79 个 SKU 目前用 SVG 示意图，后续可逐品类替换成真实产品图（建议先做三大主打品）；若需要 AI 生图或批量配图，需配置生图通道或由用户提供素材；
4. **中英文双语**：如需加中文版，可加 `lang` 参数或独立中文页面；
5. **与单据系统联动**：客户询价后可用 sg-trade-docs 系统直接出 Quotation/Invoice/DO。
