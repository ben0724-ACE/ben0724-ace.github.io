# Git 使用指南

这份指南针对当前个人主页仓库，适合日常维护页面、更新 README、替换简历和推送到 GitHub Pages。

当前仓库信息：

- 远端：`origin`
- 仓库：`https://github.com/ben0724-ACE/ben0724-ace.github.io.git`
- 主分支：`main`

## 一次最常见的更新流程

### 1. 先查看当前状态

```powershell
git status --short --branch
```

### 2. 拉取远端最新提交

```powershell
git pull --rebase origin main
```

### 3. 修改文件

常见会改到的文件：

- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `README.md`
- `简历.pdf`
- `CV.pdf`

### 4. 查看哪些文件变了

```powershell
git status --short
```

### 5. 暂存改动

如果只提交主页代码：

```powershell
git add -- index.html assets/css/style.css assets/js/main.js README.md
```

如果连新的中文简历一起提交：

```powershell
git add -- index.html assets/css/style.css assets/js/main.js README.md "简历.pdf"
```

如果连英文简历也一起提交：

```powershell
git add -- index.html assets/css/style.css assets/js/main.js README.md CV.pdf "简历.pdf"
```

### 6. 提交

```powershell
git commit -m "feat: update homepage content and docs"
```

常见提交信息写法：

- `feat: ...` 新增功能或明显增强
- `fix: ...` 修复问题
- `docs: ...` 文档更新
- `style: ...` 纯样式调整
- `refactor: ...` 重构但不改功能

### 7. 推送到 GitHub

```powershell
git push origin main
```

推送成功后，GitHub Pages 可能会有几十秒到几分钟的刷新延迟。

## 常用检查命令

查看最近提交：

```powershell
git log --oneline --decorate -n 10
```

查看具体差异：

```powershell
git diff
```

查看已暂存差异：

```powershell
git diff --cached
```

查看远端地址：

```powershell
git remote -v
```

## 常见安全操作

### 取消暂存某个文件

```powershell
git restore --staged "简历.pdf"
```

### 丢弃某个未提交文件的改动

请谨慎使用，这会直接恢复到上一次提交的版本。

```powershell
git restore -- index.html
```

### 恢复所有未提交改动

风险较高，不建议在没确认前使用。

```powershell
git restore --worktree --staged .
```

## 推荐习惯

- 每次开始改之前先 `git pull --rebase origin main`
- 改 README、主页、简历时尽量一次任务一个提交
- 大改动前先看 `git status`
- 推送前先看 `git diff --cached`
- 对二进制文件如 `简历.pdf`，建议单独确认是否真的需要一起提交

## 如果要回退某次提交

### 方式 1：生成一个“反向提交”

最安全，适合已经推送到远端后的回退。

```powershell
git revert <commit-id>
git push origin main
```

### 方式 2：直接改历史后强推

风险更高，只适合你明确知道自己在做什么的时候。

```powershell
git reset --hard <older-commit-id>
git push --force origin main
```

注意：`--force` 会改写远端历史，如果别人也在用这个仓库，要非常小心。

## 关于“删除过去的 commit”

可以，但不是直接在 GitHub 网页上点几下就删除。

一般做法是：

1. 在本地用 `git rebase -i`、`git reset` 或 `git filter-repo` 改写历史
2. 然后执行 `git push --force origin main`

这适合：

- 删除误提交的敏感信息
- 合并零碎历史
- 清理不想保留的旧 commit

不太适合：

- 仓库已经公开且很多人依赖当前历史
- 只是单纯觉得历史不够整齐

如果你只是想让历史更好看，通常更推荐从现在开始保持更清晰的提交粒度，而不是频繁重写旧历史。
