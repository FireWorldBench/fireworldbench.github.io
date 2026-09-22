# FireWorldBench 论文主页

基于 `Fire__Copy_.pdf` 的单页研究项目网站，视觉参考 [MindTopo](https://mind-topo.github.io/)。纯 HTML、CSS、JavaScript，无需安装依赖，无需构建。

## 本地运行

在本目录运行：

```sh
npm run dev
```

打开 http://127.0.0.1:4173 。也可以直接打开 `dist/index.html`；复制引用功能在本地文件模式下会尝试兼容方案。

## 文件与编辑入口

- `dist/index.html`：标题、作者、摘要、能力介绍、论文链接、BibTeX。
- `dist/styles.css`：配色、字号、布局及移动端适配。
- `dist/app.js`：七类场景资料、两种评估设置、结果排序、对比图、图像放大、引用复制。
- `dist/assets/`：从论文抽取的 WebP 图像、原始 PDF 副本及本地字体。
- `dist/assets/paper-assets.json`：图像对应的论文页码、图号、裁切坐标和来源记录。
- `scripts/extract_figures.py`：可复现的论文图像抽取脚本（需要 PyMuPDF、Pillow）。

## 内容依据

结果表为论文 Tables 1 和 3 中四个前沿模型的物理能力平均准确率摘录，汇总 P1–P5 及 choice/open-report，非完整榜单。FireWorldGPT 对比来自 Table 5。真实场景使用 **real-world-aligned**，不把模拟补全的物理场称为实测真值。未添加论文中不存在的会议、arXiv 编号或许可。

BibTeX 是依据提供的稿件整理的引用格式；正式发表后请更新年份、venue、DOI / arXiv 信息。

论文列出的 GitHub 仓库和 Hugging Face 数据集地址已保留；交付时未登录访问分别返回 404 / 401，因此页面标注其公开访问暂不可用。开放资源后可删除 `resource-note` 提示。

## 发布

目标主页：[https://fireworldbench.github.io/](https://fireworldbench.github.io/)。对应仓库为 `FireWorldBench/fireworldbench.github.io`，通过 GitHub Pages 发布。

仓库的 **Settings → Pages → Build and deployment → Source** 应选择 **GitHub Actions**。提交到 `main` 后，`.github/workflows/pages.yml` 会自动将 `dist/` 发布到网站根目录，也可在 Actions 页面手动运行 **Deploy FireWorldBench to GitHub Pages**。工作流只上传 `dist/` 中的公开网站文件；无需依赖安装或构建。

首次发布后，请在 Actions 中确认工作流成功，并打开目标主页验证。以上为部署配置说明，不代表线上部署已经完成。

后续编辑 `dist/` 下的页面、样式和资源并推送到 `main` 即可更新网站。所有资源使用相对路径；论文约 35 MB，只在打开 Paper 时加载。

字体为 Inter，许可见 `dist/assets/Inter-OFL.txt`。论文图片沿用来源论文的权利归属。
