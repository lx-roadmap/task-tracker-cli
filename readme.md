
#### 背景

[任务跟踪器 CLI (roadmap.sh)](https://roadmap.sh/projects/task-tracker#set-up-your-development-environment)

#### prepare

dependencies：
```
npm i pkg -g
```

build：
```
npm run build
```

#### example

```bash
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```


#### 相关资源

关于命令行 字体/背景 颜色：
- [如何在 JS 控制台日志输出中添加颜色？前言 为了使控制台长输出更容易查看，我们可以为 JavaScript 的控制台日 - 掘金 (juejin.cn)](https://juejin.cn/post/7030623928120770591)
- [ANSI转义代码(ansi escape code) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/570148970)

打包 `.js` 文件
- [pkg - npm (npmjs.com)](https://www.npmjs.com/package/pkg)

