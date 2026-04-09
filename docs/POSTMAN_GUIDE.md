# Postman Collection Guide — Creator's Platform API

## Overview

This guide explains how to import, configure, and use the Creator's Platform API Postman collection for manual testing and API exploration.

---

## Prerequisites

- [Postman Desktop App](https://www.postman.com/downloads/) installed (recommended over the web version — can reach `localhost` without extra setup)
- Server running locally (`npm run server` or `docker-compose up`)

---

## Setup: Import Collection and Environment

### Step 1 — Import the Collection

1. Open Postman
2. Click **Import** (top-left)
3. Select the file: `docs/Creator-Platform-API.postman_collection.json`
4. Click **Import**

### Step 2 — Import the Environment

1. Click **Environments** in the left sidebar
2. Click **Import**
3. Select the file: `docs/Local-Development.postman_environment.json`
4. Click **Import**

### Step 3 — Activate the Environment

1. Click the **Environment dropdown** in the top-right corner of Postman
2. Select **"Local Development"**

---

## Collection Structure

```
Creator's Platform API
├── Health
│   └── Health Check                ← GET  /api/health
├── Auth
│   ├── Register User               ← POST /api/users/register
│   └── Login User                  ← POST /api/auth/login
└── Posts
    ├── Get All Posts               ← GET  /api/posts
    ├── Create Post                 ← POST /api/posts
    ├── Get Post by ID              ← GET  /api/posts/:id
    ├── Update Post                 ← PUT  /api/posts/:id
    └── Delete Post                 ← DELETE /api/posts/:id
```

---

## Environment Variables

| Variable | Description | Set By |
|---|---|---|
| `baseURL` | Server base URL — default: `http://localhost:5000` | You (already configured) |
| `authToken` | JWT returned after Register or Login | **Auto-saved** by the Tests script |
| `postId` | `_id` of the most recently created post | **Auto-saved** by Create Post Tests script |

> **Important:** `authToken` is classified as `secret` — it stays local to your machine and is never synced to the Postman cloud.

---

## How to Run Requests (Recommended Order)

Run requests in this exact order on your first run:

```
1. Health Check          → Confirm server is alive (200 OK)
2. Register User         → Creates account; token auto-saved to authToken
3. Login User            → Re-authenticates; refreshes the token
4. Create Post           → Creates a post; postId auto-saved
5. Get All Posts         → Lists all posts (paginated)
6. Get Post by ID        → Fetches the post created in step 4
7. Update Post           → Updates title and content of that post
8. Delete Post           → Deletes the post
```

> After running **Register** or **Login**, the JWT is automatically stored in `authToken`. You do NOT need to copy-paste tokens manually.

---

## Automated Test Assertions

Each request includes **Tests tab scripts** that run automatically after receiving a response.

### What is checked:

| Request | Assertions |
|---|---|
| Health Check | Status 200, has `message` field, response time < 500ms |
| Register User | Status 201, has `token`, has `user.email`, `user.name` |
| Login User | Status 200, has `token`, response time < 1000ms |
| Get All Posts | Status 200, has `posts` array, `success` is true |
| Create Post | Status 201, has `post._id`, title matches request body |
| Get Post by ID | Status 200, `post._id` matches saved `postId` |
| Update Post | Status 200, title equals updated value |
| Delete Post | Status 200, `success` is true |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Could not get any response` | Start the server: `npm run server` or check the port in `baseURL` |
| `401 Unauthorized` | Run Login User to get a fresh token |
| Variables not resolving `{{...}}` | Select "Local Development" in the environment dropdown |
| `postId` is empty | Run Create Post first to populate it |

---

## Re-sharing This Collection

1. Right-click the collection → **Export**
2. Choose **Collection v2.1**
3. Commit the updated JSON to `docs/` and push

```bash
git add docs/
git commit -m "Update Postman collection"
git push
```
