# Vercel Deployment - 不思議な森と魔女の館の物語

A Vercel-deployable React app for the MBTI diagnosis experience "The Tale of the Mysterious Forest and the Witch's Mansion".

## Project Structure

```
vercel-deploy/
├── public/
│   ├── index.html          # Main HTML file with embedded React app (Babel standalone)
│   └── images/             # Symlink to image assets
├── api/
│   └── result.js           # Vercel serverless function for Notion API integration
├── vercel.json             # Vercel configuration
├── package.json            # Project metadata
└── README.md              # This file
```

## Setup & Deployment

### Prerequisites

- Vercel account (https://vercel.com)
- Notion API key (from https://www.notion.so/my-integrations)
- Notion database with appropriate properties set up

### Environment Variables

Set the following environment variables in your Vercel project settings:

```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### Database Properties

The Notion database must have the following properties:

| Property Name | Type | Description |
|---|---|---|
| タイプ | Title | MBTI type (INTJ, ENFP, etc.) |
| タイプ名 | Rich Text | Type name in Japanese |
| エンディング | Select | "留まる" or "街へ戻る" |
| 職業 | Select | Job choice (knight, detective, etc.) |
| アイテム1 | Rich Text | Selected items from phase 1 |
| アイテム2 | Rich Text | Selected items from phase 2 |
| アイテム3 | Rich Text | Selected items from phase 3 |
| 回答データ | Rich Text | JSON-stringified answers |
| プレイ日時 | Date | Timestamp of gameplay |
| UserAgent | Rich Text | User's browser agent string |

### Deployment Steps

1. **Clone or push this directory to GitHub**

2. **Import to Vercel**
   ```bash
   vercel
   ```

3. **Configure environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add `NOTION_API_KEY` and `NOTION_DATABASE_ID`

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Local Development

To test locally with Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

The app will be available at `http://localhost:3000`.

## How It Works

### Frontend (public/index.html)

- Uses React 18 and ReactDOM from unpkg CDN
- Babel standalone for JSX transformation
- localStorage-based storage stub (`window.storage`)
- Self-contained single HTML file for easy deployment
- Dark theme (`#0f0c1a` background)
- Japanese content with proper meta tags (OGP, charset, viewport)

### Game Flow

1. **Title Screen** - Introduction
2. **Q1 Screen** - Select 3 items for the forest journey
3. **Q2 Screen** - Select 3 items at the mansion
4. **Q3 Screen** - Select 3 skills/powers
5. **Result Screen** - Display MBTI type and job options
6. **Ending Screen** - Show final story with selected job

### Backend (api/result.js)

- Serverless Node.js function
- Receives POST requests with result data
- Maps to Notion database properties
- Sends data to Notion API
- Returns CORS headers for browser access
- Handles OPTIONS preflight requests

### Data Mapping

Incoming request body:
```json
{
  "type": "INTJ",
  "typeName": "戦略家",
  "ending": "街へ戻る",
  "job": "alchemist",
  "item1": ["map", "crystal"],
  "item2": ["door", "light"],
  "item3": ["wisdom"],
  "answers": { /* raw answers */ },
  "playedAt": "2026-03-28T12:00:00Z"
}
```

Is converted to Notion page with properties automatically.

## API Endpoints

### POST /api/result

Save a diagnosis result to Notion.

**Request:**
```bash
curl -X POST https://your-project.vercel.app/api/result \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INTJ",
    "typeName": "戦略家",
    "ending": "街へ戻る",
    "job": "alchemist",
    "item1": ["map", "crystal"],
    "item2": ["door", "light"],
    "item3": ["wisdom"],
    "answers": {}
  }'
```

**Response (201):**
```json
{
  "success": true,
  "notionPageId": "uuid-of-created-page",
  "message": "Result saved successfully"
}
```

## Browser Support

- Modern browsers with ES6+ support
- React 18+ (via CDN)
- localStorage support (for data persistence)

## Troubleshooting

### Notion API 500 error
- Verify `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set correctly
- Ensure the Notion page has access to your integration
- Check Notion API token has "create content" permission

### Images not loading
- Verify the `public/images` symlink is correct
- Images should be accessible at `/images/*` paths
- Ensure image files exist in the source directory

### CORS errors in browser
- The `/api/result.js` endpoint includes CORS headers
- Ensure vercel.json is properly deployed
- Check browser console for specific error messages

## Notes

- The HTML file is ~50KB with all React code embedded (uses Babel standalone)
- No npm dependencies needed on frontend
- Backend uses Node.js fetch API (no additional libraries)
- All data flows through Notion API for persistence
- Japanese content properly encoded in HTML meta tags

## License

MIT
