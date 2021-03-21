# remote-control-electron

本项目基于[极客时间课程-Electron开发实战](https://time.geekbang.org/course/detail/100044201-187014)，是我学习 Electron 的练习项目

### 主要功能

通过 Electron 实现用户桌面流的捕获，通过 WebRTC 和 WebSocket 实现画面及用户间连接和指令传输，以及 robotjs 实现对用户电脑的键盘和鼠标事件进行响应。目标是实现类似 TeamViewer 软件的功能。

### 技术栈
- Electron 
- WebRTC
- WebSocket
- React
- Material-UI
- robotjs



### 改进
1. 把原课程中的信令服务集成到客户端中，每一个客户端都建立自己的 WebSocket Server，既可以充当控制端也可以充当傀儡端。
2. 使用 Material UI 实现了简单的GUI
3. 傀儡端支持响应鼠标拖拽，移动，左右键单击（部分窗口如任务管理器不支持拖拽，原因可能与权限有关）
4. 支持断开连接
5. 支持设置缩放比例的笔记本电脑

### TODO
1. 支持系统快捷键
2. 支持生成日志，方便调试
3. 支持自定义控制码
4. UI界面支持选择当前系统IP，目前的系统IP获取方式可能获取的IP有误。
5. 支持存储连接过的系统IP
