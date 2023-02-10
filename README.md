# ZenTao

ZenTao 样式辅助 & 功能扩展

## Development
```bash
# 安装依赖
pnpm install
# 开发
pnpm run dev
# 打包
pnpm run build
```

## Install

点击安装 [正式版](https://raw.githubusercontent.com/happy-share-forever/tampermonkey-script/main/ZenTao/ZenTao.user.js)

点击安装 [测试版](https://raw.githubusercontent.com/happy-share-forever/tampermonkey-script/test/ZenTao/ZenTao.user.js)

## Compatible version

- 点击安装 [v10](https://raw.githubusercontent.com/happy-share-forever/tampermonkey-script/main/ZenTao/ZenTao.user.js)
- 点击安装 [v12](https://raw.githubusercontent.com/happy-share-forever/tampermonkey-script/main/ZenTao/ZenTao.v12.user.js)

## Usage

此脚本是禅道样式辅助、功能扩展。

1. 看板增强：按人筛选、复制分支、复制标题等
2. 复制分支、复制标题时可自定义git前缀

```javascript
// 修改项目代号，在控制台执行如下代码，点击复制分支或复制标题时，会自动添加前缀，例如： feature/ABC-12345
window.localStorage.setItem('_customFilter_projectPrefix', 'ABC')
```

## Roadmap

- [X] 1.x 脚本上线
- [ ] 下拉筛选需求状态
- [ ] 等等欢迎添加
