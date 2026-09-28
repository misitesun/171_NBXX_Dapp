# @jcy/create-template-react
React H5 DApp 模板创建工具。

Build the local package from the template repository.
先从模板仓库生成本地包。

```bash
git clone https://github.com/misitesun/react_dapp_demo.git
cd react_dapp_demo
pnpm create:local
```

Create a sibling project directory from the generated package.
使用生成的包创建同级项目目录。

```bash
pnpm dlx ./packages/create-template-react/jcy-create-template-react-0.1.0.tgz ../my-dapp
```

Then install dependencies and start the project.
然后安装依赖并启动项目。

```bash
cd my-app
pnpm install
pnpm dev
```
