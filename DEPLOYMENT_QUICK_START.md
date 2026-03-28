# Quick Start: Deploying to Vercel

## 1. Prepare Your GitHub Repository

```bash
cd /sessions/gracious-serene-goldberg/mnt/01_MBTI/vercel-deploy
git init
git add .
git commit -m "Initial commit: Vercel-deployable MBTI diagnosis app"
git remote add origin https://github.com/YOUR_USERNAME/witch-diagnosis.git
git push -u origin main
```

## 2. Connect to Vercel

Go to https://vercel.com/import and connect your GitHub repository.

## 3. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

| Name | Value |
|---|---|
| `NOTION_API_KEY` | Your Notion API key from https://www.notion.so/my-integrations |
| `NOTION_DATABASE_ID` | Your database ID (from Notion database URL) |

## 4. Deploy

Click "Deploy" in Vercel dashboard or run:

```bash
vercel --prod
```

## 5. Test the API

```bash
curl -X POST https://YOUR_PROJECT.vercel.app/api/result \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INTJ",
    "typeName": "戦略家",
    "ending": "街へ戻る",
    "job": "alchemist",
    "item1": ["map"],
    "item2": ["door"],
    "item3": ["wisdom"],
    "answers": {}
  }'
```

Expected response (201):
```json
{
  "success": true,
  "notionPageId": "...",
  "message": "Result saved successfully"
}
```

## Finding Your Notion Database ID

1. Open your Notion database in browser
2. The URL looks like: `https://notion.so/workspace/abc123?v=def456`
3. The database ID is the part before the `?` → `abc123`

## Troubleshooting

**Q: Getting 401 from Notion API?**
- Verify the API key starts with `secret_`
- Check that the integration is added to the database in Notion
- Regenerate the API key if needed

**Q: Images not loading?**
- Verify symlink: `ls -l public/images`
- Check that image files exist in source directory
- Image paths in HTML are absolute: `/images/...`

**Q: CORS errors?**
- The vercel.json should handle CORS for `/api/*` routes
- Verify vercel.json is in the root of vercel-deploy/

## Support

- Notion API docs: https://developers.notion.com/
- Vercel docs: https://vercel.com/docs
- Notion integration setup: https://www.notion.so/help/add-and-manage-connections-with-the-api
