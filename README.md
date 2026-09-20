# 随机数生成器

一个使用 Vite 和原生 JavaScript 构建的轻量随机数网页工具。

## 功能

- 指定最小值、最大值和生成数量
- 支持一次生成 1 到 100 个整数
- 支持生成不重复结果
- 使用浏览器 `crypto.getRandomValues()` 生成随机数
- 支持一键复制结果
- 保留本次会话最近 6 条生成记录
- 自动适配桌面端、移动端和深色模式

## 本地运行

```bash
npm install
npm run dev
```

也可以使用 pnpm：

```bash
pnpm install
pnpm dev
```

浏览器打开终端中显示的本地地址即可。

## 构建

```bash
npm run build
```

构建结果位于 `dist` 目录。

## 技术栈

- Vite
- HTML
- CSS
- JavaScript
