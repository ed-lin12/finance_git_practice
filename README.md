# Finance Git Practice

A small fictional expense tracker and hands-on Git learning project.

- Open the app preview to add, edit, delete, and filter synthetic expenses.
- Expenses and self-reported learning progress are saved only in your browser.
- Follow [the practice guide](docs/GIT_PRACTICE.md) for real commits, pushes,
  pulls, branches, pull requests, and a safe local merge-conflict exercise.
- Edit [the practice policy](practice/expense-policy.md) to learn Git mechanics.

GitHub is not automatically connected. Use Replit's Git pane to authorize your
account and select an approved private training repository. No banking service,
real transaction data, login, or payment integration is used.

## Development

This is a pnpm workspace. The frontend lives in
`artifacts/finance-git-practice`. Replit's managed workflow starts its preview.

```sh
pnpm install
pnpm --filter @workspace/finance-git-practice run typecheck
```

For a local checkout outside Replit:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/finance-git-practice run dev
```

Use synthetic data only. This is a learning tool, not financial advice or a
production expense-management system.