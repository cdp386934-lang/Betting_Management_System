# 基础投注系统 (Mini Project)

基于作业说明实现的简单投注系统：用户查看余额、充值、下注、结算。充值为模拟操作，不接入真实支付。


## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma

## 数据结构

- **users**: id(uuid), email, display_name
- **ledger_entries**（只增不改不删）: id, user_id, type(DEPOSIT | BET_DEBIT | BET_CREDIT), amount, created_at  
  余额 = 所有 DEPOSIT + BET_CREDIT - 所有 BET_DEBIT
- **bets**: id, user_id, amount, status(PLACED | SETTLED), result(WIN | LOSE | null), payout_amount, created_at

## 快速开始

```bash
# 安装依赖
npm install

# 生成 Prisma 客户端并同步数据库
npm prisma generate
npm prisma db push

# 预置 10 个用户（必须执行）
npm run db:seed

# 开发
npm run dev
```

浏览器打开 http://localhost:3000

## 功能说明

1. **首页**：进入「用户列表」
2. **用户列表** (`/users`)：展示所有用户、余额、充值按钮、进入游戏入口
3. **游戏页** (`/game/[userId]`)：当前余额、输入投注金额下单、历史投注、对 PLACED 投注进行「结算-赢」/「结算-输」

- 充值：管理员为用户增加余额，写入一条 `DEPOSIT` 的 ledger_entries
- 下单：金额 > 0 且 ≤ 当前余额，写入 `BET_DEBIT` 并创建 status=PLACED 的 bet
- 结算：仅可结算 PLACED；WIN 赔付 2 倍并写入 `BET_CREDIT`，LOSE 不返还；禁止重复结算

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 生产运行 |
| `npm run db:generate` | 生成 Prisma Client |
| `npm run db:push` | 同步 schema 到 SQLite |
| `npm run db:seed` | 预置 10 个用户 |
| `npm run db:studio` | 打开 Prisma Studio |
