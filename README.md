# 青金契约、冷白遗迹与发条之心 —— FFXI《阿特尔冈的秘宝》在线阅读站

本仓库为长篇游戏批评《青金契约、冷白遗迹与发条之心：《最终幻想XI：阿特尔冈的秘宝》中的现代性铁笼、资本物化与主奴辩证法》（v17.0 最终核验插图定稿）的 **GitHub Pages 静态阅读网站**。

## 美学还原

* 视觉风格仿照 Square Enix 2006 年《FINAL FANTASY XI: Treasures of Aht Urhgan》[PlayOnline 官方入口页](https://www.playonline.com/ff11/ahturhgan/entrance/index.html)：顶部暖暮光白金天际渐变至深褐黑曜石夜色、两侧近东街灯琥珀暖光、左上角暖棕返回徽章、经典 `FINAL FANTASY XI` 衬线与钢蓝横线 `O N L I N E` 锁字、古铜鎏金手写体副标及双线黄铜装饰框。
* 内置三套主题切换（「官网暗金」/「白门羊皮」/「遗迹冷白」）、字号调节、左侧粘性目录与实时全文检索、9 张《最终幻想XI》实机游戏截图灯箱大图、矢量理论架构图、48 条一手尾注悬停预览，以及原生 A4 打印 / 导出 PDF 样式。

## 上线 GitHub Pages 步骤

1. 在 GitHub 新建一个公开仓库（如 `ffxi-toau-critique`），上传本文件夹全部文件至 `main` 分支根目录。
2. 进入仓库 **Settings → Pages → Build and deployment**，Source 选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，点击 Save。
3. 等待约 1 分钟即可通过 `https://<你的用户名>.github.io/<仓库名>/` 在线阅读。

## 本地预览

```bash
python3 -m http.server 8000
```
打开 `http://localhost:8000` 即可预览。
