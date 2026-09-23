# Finance Git Practice

Use a private training repository approved by your company. Never add customer
records, account numbers, credentials, real transactions, or company source code.
This project is not a production financial system.\


Making a test change lol

## Understand the two kinds of changes

Adding an expense in the app changes this browser's local storage, not a source
file. Git does not commit or sync that browser data. For these exercises, edit
`practice/expense-policy.md` in the project editor.

A commit saves a local version. A push sends commits to GitHub. A fetch downloads
remote history without integrating it. A pull fetches and integrates history.
A pull request asks for review and merging; it is not the same as `git pull`.

## 1. Connect a training repository

Open Replit's Git pane and connect your GitHub account using its authorization
flow. Do not paste tokens into chat, source files, or remote URLs. Select a new,
private training repository in your personal account or an organization your
company has approved. Check company SSO and repository access requirements.

Follow the current Git pane instructions:
https://docs.replit.com/features/workspace-tools/git-interface

Review the files being staged before your first push. Exclude secrets, generated
build output, local data, and private notes. Complete an initial commit/push using
the Git pane before the following exercises. Nothing in this app connects or
pushes a repository automatically.

The commands below assume the remote is named `origin` and default branch is
`main`. If yours differ, substitute the actual names. Run commands in the project
Shell, one at a time. Start with `git status`; commit your intended work before
switching branches. Never discard unrelated changes to make an exercise work.

## 2. Make a commit

In the editor change the meal allowance in `practice/expense-policy.md` from
USD 25 to USD 30. Then:

```sh
git status
git diff -- practice/expense-policy.md
git add practice/expense-policy.md
git commit -m "Update training meal allowance to USD 30"
git log -1 --oneline
```

Alternatively review, stage, and commit this file in the Git pane. The commit is
local until pushed. If Git asks for author identity, use your approved identity
through the Git settings; do not invent one.

## 3. Push

```sh
git push -u origin main
```

Open the training repository on GitHub and verify the commit and USD 30 line.
If a protected branch rejects the push, use the branch/PR exercise instead.
Never force-push to bypass protection.

## 4. Pull

On GitHub edit the receipts sentence to "Receipts: required within 7 days."
Commit it to the training branch (or merge a PR if branch rules require it).
Back in Replit with no uncommitted changes:

```sh
git switch main
git pull --ff-only origin main
```

Verify the new sentence appears locally. `--ff-only` stops rather than creating
an unexpected merge if the histories diverge. If it stops, inspect the history
and use a reviewed merge rather than resetting or force-pushing.

## 5. Branch and pull request

```sh
git switch main
git pull --ff-only origin main
git switch -c training/receipt-policy
```

Edit the receipt deadline from 7 days to 5 days, then:

```sh
git add practice/expense-policy.md
git commit -m "Propose five-day receipt deadline"
git push -u origin training/receipt-policy
```

On GitHub open a pull request from `training/receipt-policy` to `main`. Inspect
Files changed, add a description, request review if appropriate, and merge only
in your training repository. Then:

```sh
git switch main
git pull --ff-only origin main
```

## 6. Deliberate local merge conflict

Only do this with a clean working tree. It uses two throwaway local branches and
does not change `main` or push anything.

```sh
git switch main
git switch -c training/conflict-a
```

Change the meal allowance to USD 40 and commit:

```sh
git add practice/expense-policy.md
git commit -m "Training proposal A: USD 40"
git switch main
git switch -c training/conflict-b
```

Change the same allowance line to USD 50 and commit, then merge A into B:

```sh
git add practice/expense-policy.md
git commit -m "Training proposal B: USD 50"
git merge training/conflict-a
```

Git should report a conflict. Open the file, choose USD 45 as the training
resolution, and remove all `<<<<<<<`, `=======`, and `>>>>>>>` marker lines.
Keep the surrounding policy text.

```sh
git add practice/expense-policy.md
git commit -m "Resolve training allowance conflict at USD 45"
git status
git switch main
```

If you want to cancel instead, use `git merge --abort` while the merge is in
progress. Leave the practice branches in place for inspection; no forced
deletion is necessary. For a repeat exercise choose unused branch names.

## Finance-team habits

- Keep real financial and personal data out of training repositories.
- Review the staged diff before every commit.
- Use small commits, pull requests, and peer review.
- Follow company requirements for SSO, access, branch rules, and retention.
- Never use force-push, hard reset, or credential-bearing URLs for this guide.
- A private repository is not a substitute for company approval or compliance.