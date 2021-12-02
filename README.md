# Soul++ Chrome插件

提升魂+论坛使用体验

[TG群](https://t.me/joinchat/pHRL19h_vCY5MmFh)

## 功能
- 免刷新
  - [X] 购买免刷新
  - [X] 回复免刷新
- 无缝加载
  - [X] 无缝加载板块帖子列表
  - [X] 无缝加载贴内楼层列表
  - [X] 无缝加载搜索页结果
  - [X] 无缝加载图墙模式帖子
  - [X] 无缝加载用户资料帖子
- SFW 安全模式
  - [X] 折叠贴内图片
  - [X] 按需加载图片
  - [X] 替换用户头像
  - [X] 折叠版块公告大图
- 其它
  - [X] 暗黑模式
  - [X] 开启Mark++
  - [X] 自动领取和完成论坛任务
  - [X] 标记已阅读过的帖子
  - [X] 给[回复第X楼/引用第X楼]增加跳转到该楼层的链接
  - [X] 折叠网赚区搜索结果
  - [X] 百度网盘链接失效检测
  - [X] 编辑器下方增加外部图床 [ 可通过 拖放/选取/粘贴 3种方式上传 ]
  - [X] 默认勾选"新回复站内通知
  - [X] 域名跳转
  - [X] 强制使用桌面版

- 页面增强
  - 在[点击进入图墙模式]旁边增加了"在该版块默认打开图墙模式"复选框

## 使用方法

1. 你需要一个使用`Chromium`核心的浏览器 (只测试过最新版 Chrome / Edge / Brave)
2. 下载[最新版本(那个zip压缩包)](https://github.com/FetchTheMoon/soul-plus-plus-chrome-extension/releases/latest)
3. 在你的浏览器的`设置` - `扩展程序` - 右上角打开`开发者模式`
4. 如果你使用的是 Edge 浏览器, 你现在可以直接把压缩包拖到设置页面里, 即可开始愉快的使用. 如果不是, 往下看
5. 解压刚才下载的 zip 压缩包到某个文件夹里
6. 点击左上角的`加载已解压的扩展程序`按钮, 选择存放已解压扩展的文件夹, 开始愉快的使用吧.

## 欢迎 issue / PR

第一次用TS, 也是第一次用前端打包. 当然, 也是第一次写扩展

加之一个人也精力有限, 肯定有很多测试不到的地方

项目肯定有很多不足之处, 希望有缘的+人们和大佬们多多指教, 爱你们!

## 编译

1. 此处假设你应安装有`nodejs`, 并且知道如何安装和使用`yarn`包管理器

2. 开发机器环境:
```
$ node -v
v14.17.0

$ npm -v
6.14.13

$ yarn -v
1.22.17
```

3. 执行
```shell
git clone https://github.com/FetchTheMoon/soul-plus-plus-chrome-extension
cd soul-plus-plus-chrome-extension/
yarn        
yarn build
```
打包完成后应在源码目录下发现新生成的了一个`dist`目录

4. 在Chrome的`设置` - `扩展程序` - 右上角打开`开发者模式`

5. 点击左上角的`加载已解压的扩展程序`按钮, 找到刚才打包后生成的`dist`目录

6. 在Chrome的右上角的扩展里应该能找到了

