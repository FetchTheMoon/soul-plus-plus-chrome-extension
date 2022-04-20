# Soul++ Chrome插件

提升魂+论坛使用体验

[TG群](https://t.me/joinchat/pHRL19h_vCY5MmFh)

## 近况

由于个人工作生活安排，暂时无法分出时间精力来维护插件，但此期间会对新增域名进行支持。
 
感谢各位使用拙作以及对在下的包容。

2022/04/21 已在 Chrome 插件商店通过审核。[\[安装地址\]](https://chrome.google.com/webstore/detail/soul%20%20/bleoonmhjmcnoflcfnlgfondalejbacp?hl=zh-CN)

~~2022/04/16 已提交 Chrome 插件商店审核，能否通过审核尚未可知，目前手动更新的正确姿势为：~~

## 从压缩包版本切换为商店版本的正确姿势为：

1. 在插件设置的调试栏中导出配置
2. 到浏览器的 [插件管理](chrome://extensions) 中移除旧版插件
3. 到 [Chrome 插件商店](https://chrome.google.com/webstore/detail/soul%20%20/bleoonmhjmcnoflcfnlgfondalejbacp?hl=zh-CN) 重新安装
4. 重新导入配置


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

