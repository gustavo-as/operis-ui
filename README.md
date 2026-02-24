# Operis UI

Front-end application for the Operis platform, providing the user interface for authentication, user management, and multi-tenant access control.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React 19

---

## Gitflow

This project follows the [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) branching strategy.

### Branch Structure

| Branch       | Purpose                              |
|--------------|--------------------------------------|
| `main`       | Production-ready code                |
| `develop`    | Integration branch for development   |
| `feature/*`  | New features, branched from develop  |
| `release/*`  | Release preparation, from develop    |
| `hotfix/*`   | Urgent fixes, branched from main     |

### Workflow

**Starting a new feature:**
```bash
git checkout develop
git checkout -b feature/your-feature-name
```

**Finishing a feature:**
```bash
git checkout develop
git merge --no-ff feature/your-feature-name
git branch -d feature/your-feature-name
git push origin develop
```

---

## Related Services

| Service    | Description                              | Repository |
|------------|------------------------------------------|------------|
| Guard      | Authentication & Authorization service  | [operis-guard](https://github.com/gustavo-as/guard) |

---

## Running Locally
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.