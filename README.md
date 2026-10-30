# dsh-first-principles · 第一性原理追问引擎

The *thinking* discipline (companion to **dsh-frame-kit**, which handles output format): 4-question ladder, Feynman test, three red lines, echo gate.

## 常驻纪律
- **四阶问**：新能力/新方案先答 能不能算法化→脚本化→模型化→复制化，到哪阶落哪阶
- **费曼判据**：术语必须能翻译成一句人话——翻译不出=没懂
- **三红线**：禁权威代推导 / 禁通用套话当结论 / 零件必答四阶问
- **回声门**：长输出与近期发言4词重合率>25%=换角度重写
- **收尾义务**：答毕自问本轮有无可结晶规律

## 工具 `fp_check`
对推演文本做词面体检：权威代推导计数、套话识别、四阶问缺失、回声词标记 → PASS/黄标/拦截。（词面层——判断力仍在你。）

## 安装
```
dsh plugin add github:xushilianzhuren/dsh-first-principles
```
MIT License.
