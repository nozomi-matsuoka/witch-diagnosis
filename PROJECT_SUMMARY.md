# Vercel Deployment Project Summary

**Project:** 不思議な森と魔女の館の物語 (The Tale of the Mysterious Forest and the Witch's Mansion)
**Type:** Vercel-deployable MBTI Diagnosis React App
**Language:** Japanese
**Created:** 2026-03-28

## Directory Structure

```
vercel-deploy/
├── api/
│   └── result.js                    # Serverless Notion API integration
├── public/
│   ├── index.html                   # Main app (28KB)
│   └── images/ → ../../public/images # Symlink to image assets
├── package.json                     # Project metadata (no dependencies)
├── vercel.json                      # Vercel configuration
├── README.md                        # Full documentation
├── DEPLOYMENT_QUICK_START.md        # Quick deployment guide
└── PROJECT_SUMMARY.md              # This file
```

## Files Created

### 1. `public/index.html` (28 KB, 599 lines)

**Purpose:** Single-file React application with all code embedded

**Contents:**
- HTML5 document with proper meta tags
  - Charset: UTF-8
  - Language: Japanese (lang="ja")
  - Viewport: responsive
  - OGP tags: title, description, image, type, locale
  
- CDN Imports:
  - React 18: unpkg.com/react@18
  - ReactDOM 18: unpkg.com/react-dom@18
  - Babel Standalone: unpkg.com/@babel/standalone
  
- Inline Styles:
  - Dark theme: background #0f0c1a
  - System fonts
  - CORS headers management

- React Components (5 screens):
  ```
  TitleScreen
    ↓
  Q1Screen (7 items, select 3)
    ↓
  Q2Screen (7 items, select 3)
    ↓
  Q3Screen (8 items, select 3)
    ↓
  ResultScreen (display MBTI type + job selection)
    ↓
  EndingScreen (final story with selected job)
  ```

- Data Structures:
  - JOBS: 6 job types (knight, detective, alchemist, scholar, bard, stargazer)
  - ITEMS1: 7 forest items with T/F/N/S scoring
  - ITEMS2: 7 mansion mysteries with E/I/T/F scoring
  - ITEMS3: 8 skills with S/N/T/F/J/P scoring
  - ENDINGS_DATA: All 16 MBTI types with type name, ending, and job mapping

- Functions:
  - `calcType()`: Aggregates scores to calculate 4-letter MBTI type
  - `getItem1GroupText()`: Narration based on item1 selection
  - `getItem2GroupText()`: Narration based on item2 selection
  - `getItem3GroupText()`: Narration based on item3 selection
  - Component handlers: Q1, Q2, Q3 submissions

- Window Storage:
  - `window.storage` stub with localStorage fallback
  - Methods: setItem, getItem, removeItem

### 2. `api/result.js` (8 KB, 246 lines)

**Purpose:** Vercel serverless function for Notion API integration

**Functionality:**
- Receives POST requests with diagnosis results
- Validates required fields (type, typeName)
- Maps data to Notion database properties
- Authenticates with Notion API
- Creates new page in database
- Returns CORS headers
- Handles OPTIONS preflight

**Environment Variables:**
- `NOTION_API_KEY`: Notion API Bearer token
- `NOTION_DATABASE_ID`: Target database UUID

**Request Format:**
```json
{
  "type": "INTJ",
  "typeName": "戦略家",
  "ending": "街へ戻る",
  "job": "alchemist",
  "item1": ["map", "crystal"],
  "item2": ["door", "light"],
  "item3": ["wisdom"],
  "answers": {...},
  "playedAt": "2026-03-28T..."
}
```

**Response (201):**
```json
{
  "success": true,
  "notionPageId": "...",
  "message": "Result saved successfully"
}
```

**Property Mapping:**
| Request Field | Notion Property | Type |
|---|---|---|
| type | タイプ | Title |
| typeName | タイプ名 | Rich Text |
| ending | エンディング | Select |
| job | 職業 | Select |
| item1 | アイテム1 | Rich Text |
| item2 | アイテム2 | Rich Text |
| item3 | アイテム3 | Rich Text |
| answers | 回答データ | Rich Text (JSON) |
| playedAt | プレイ日時 | Date |
| user-agent header | UserAgent | Rich Text |

**Error Handling:**
- 400: Missing required fields
- 401: Notion API authentication failed
- 500: Internal server error with message
- All responses include CORS headers

### 3. `vercel.json` (4 KB)

**Purpose:** Vercel platform configuration

**Configuration:**
```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

**Features:**
- Routes API calls to serverless functions
- Sets CORS headers for cross-origin requests
- Allows POST and OPTIONS methods
- Permits Content-Type header

### 4. `package.json` (4 KB)

**Purpose:** Project metadata and scripts

**Fields:**
- name: "witch-diagnosis"
- version: "1.0.0"
- description: Japanese title
- main: "api/result.js"
- scripts:
  - dev: `vercel dev` (local testing)
  - build: `echo 'Static site only'`
- keywords: mbti, diagnosis, personality, japanese
- No dependencies

### 5. `public/images/` (Symlink)

**Purpose:** Link to image assets directory

**Target:** `../../public/images/`

**Contents:** 14 PNG image files
- chapter1_town.png (3.3 MB)
- chapter2_forest.png (3.0 MB)
- chapter3_mansion.png (3.5 MB)
- chapter4_confrontation.png (3.0 MB)
- title_main_horizontal.png
- job_knight.png, job_detective.png, job_alchemist.png
- job_scholar.png, job_bard.png, job_stargazer.png
- + icon and result illustration files

### 6. `README.md` (8 KB)

**Purpose:** Complete project documentation

**Sections:**
- Project structure with tree view
- Setup and deployment prerequisites
- Environment variables setup
- Notion database schema
- Deployment step-by-step guide
- Local development instructions
- API endpoint documentation
- Browser support information
- Troubleshooting guide

### 7. `DEPLOYMENT_QUICK_START.md` (4 KB)

**Purpose:** Quick reference for deployment

**Sections:**
- GitHub repository setup
- Vercel connection
- Environment variable configuration
- Deployment commands
- API testing with curl
- Finding Notion database ID
- Troubleshooting common issues

## Technical Specifications

### Frontend

**Architecture:**
- Single HTML file with embedded React app
- No build step required
- Babel transpilation in browser

**Dependencies:**
- React 18 (CDN)
- ReactDOM 18 (CDN)
- Babel Standalone (CDN)
- No npm modules

**Browser Support:**
- Modern browsers with ES6+ support
- localStorage for data persistence (with fallback)
- Responsive design with CSS Grid

**Performance:**
- HTML file: 28 KB
- All images: Symlinked (not duplicated)
- No compilation step on deployment
- Zero cold start overhead (static HTML)

### Backend

**Architecture:**
- Serverless Node.js function on Vercel
- Single endpoint: POST /api/result
- Stateless (all data stored in Notion)

**Dependencies:**
- Built-in Node.js `fetch` API
- No npm modules (no package-lock needed)

**API Integration:**
- Notion API v1
- Bearer token authentication
- JSON request/response

### Deployment

**Platform:** Vercel
**Build Time:** <1 minute
**Deployment Method:** GitHub integration
**Static Files:** Served from CDN
**Functions:** Run on-demand edge network

**Environment Setup:**
```
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
```

## MBTI Type System

**Types Supported:** All 16 MBTI combinations

**Dimensions:**
1. Extraversion (E) vs Introversion (I)
2. Intuition (N) vs Sensing (S)
3. Thinking (T) vs Feeling (F)
4. Judging (J) vs Perceiving (P)

**Type Mapping Examples:**
- INTJ → 戦略家 (Strategist) → Scholar job
- ENFP → キャンペーン人 (Campaigner) → Bard job
- ISTJ → 管理人 (Supervisor) → Knight job

**Calculation Method:**
- Item selections contribute scoring points
- Aggregate scores across all 3 phases
- Compare E vs I, N vs S, T vs F, J vs P
- 4-character type output (e.g., "INTJ")

**Job Mapping:**
Each MBTI type maps to a suggested job and story ending:
- Knight: Warrior archetype
- Detective: Investigator archetype
- Alchemist: Innovator archetype
- Scholar: Thinker archetype
- Bard: Performer archetype
- Stargazer: Dreamer archetype

## Game Flow

**Phase 1: Item Selection**
- Choose 3 items from 7 options
- Each item has T/F/N/S scoring
- Flavor text: "理性と意志を道連れに..." (based on selection)

**Phase 2: Mansion Mysteries**
- Choose 3 mysteries from 7 options
- Each item has E/I/T/F scoring
- Flavor text: "行動を起こせ..." (based on selection)

**Phase 3: Skills/Powers**
- Choose 3 skills from 8 options
- Each skill has S/N/T/F/J/P scoring
- Flavor text: "実行力で困難を..." (based on selection)

**Result Calculation:**
- Aggregate all scores
- Determine 4-letter MBTI type
- Look up type in ENDINGS_DATA
- Get typeName, ending, and job mapping

**Job Selection:**
- User selects from 6 job options
- Shows job icon and name
- Job is saved to Notion database

**Ending Screen:**
- Display final story
- Show ending type (留まる or 街へ戻る)
- Job-specific narrative
- Button to start over

## Data Persistence

**Frontend:**
- Session data in React state
- Optional localStorage via `window.storage` stub
- No external state persistence needed

**Backend:**
- All results sent to Notion database
- Creates new page for each diagnosis
- Includes: type, job, items selected, answers, timestamp, user agent

**Notion Database:**
- 9 properties per page
- Title: MBTI type (for uniqueness)
- Supports filtering, sorting, and analysis
- Historical data for analytics

## Deployment Checklist

- [x] HTML file with embedded React app
- [x] Notion API serverless function
- [x] Vercel configuration
- [x] Package.json for project metadata
- [x] Image symlink for asset serving
- [x] Complete README documentation
- [x] Quick start deployment guide
- [x] CORS headers configuration
- [x] Environment variable setup instructions
- [x] All 16 MBTI type mappings
- [x] All 5 screens implemented
- [x] Error handling in API
- [x] localStorage fallback
- [x] Japanese locale support
- [x] OGP tags for social sharing

## Next Steps

1. Create GitHub repository
2. Push vercel-deploy directory to GitHub
3. Import into Vercel dashboard
4. Set environment variables in Vercel Settings
5. Trigger deployment
6. Test API endpoint
7. Share URL for user testing
8. Monitor Notion database for incoming results

## Support & Troubleshooting

**Common Issues:**
- API 401: Check NOTION_API_KEY format
- API 500: Verify NOTION_DATABASE_ID exists
- Images not loading: Check symlink with `ls -l public/images`
- CORS errors: Ensure vercel.json is deployed correctly

**Documentation:**
- See README.md for full setup guide
- See DEPLOYMENT_QUICK_START.md for quick reference
- Notion API: https://developers.notion.com/
- Vercel docs: https://vercel.com/docs

---

**Status:** Ready for deployment
**Last Updated:** 2026-03-28
**Total Project Size:** ~28 KB HTML + symlinked images (14 files)
