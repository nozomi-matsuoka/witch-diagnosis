/**
 * Vercel Serverless Function: Save MBTI diagnosis result to Notion
 * POST /api/result
 *
 * Environment Variables Required:
 * - NOTION_API_KEY: Notion API authentication token
 * - NOTION_DATABASE_ID: Target Notion database ID
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

/**
 * Maps incoming result data to Notion database properties
 */
function mapDataToNotion(entry, userAgent) {
  return {
    parent: {
      database_id: NOTION_DATABASE_ID,
    },
    properties: {
      タイプ: {
        title: [
          {
            text: {
              content: entry.type || 'UNKNOWN',
            },
          },
        ],
      },
      タイプ名: {
        rich_text: [
          {
            text: {
              content: entry.typeName || '',
            },
          },
        ],
      },
      エンディング: {
        select: {
          name: entry.ending || '未定',
        },
      },
      職業: {
        select: {
          name: entry.job || 'knight',
        },
      },
      アイテム1: {
        rich_text: [
          {
            text: {
              content: String(entry.item1 || ''),
            },
          },
        ],
      },
      アイテム2: {
        rich_text: [
          {
            text: {
              content: String(entry.item2 || ''),
            },
          },
        ],
      },
      アイテム3: {
        rich_text: [
          {
            text: {
              content: String(entry.item3 || ''),
            },
          },
        ],
      },
      回答データ: {
        rich_text: [
          {
            text: {
              content: JSON.stringify(entry.answers || {}),
            },
          },
        ],
      },
      プレイ日時: {
        date: {
          start: entry.playedAt || new Date().toISOString(),
        },
      },
      UserAgent: {
        rich_text: [
          {
            text: {
              content: userAgent || 'unknown',
            },
          },
        ],
      },
    },
  };
}

/**
 * Sends a request to the Notion API to create a new page
 */
async function createNotionPage(payload) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API Error (${response.status}): ${error}`);
  }

  return await response.json();
}

/**
 * Main handler for POST requests
 */
async function handlePost(req) {
  // Check environment variables
  if (!NOTION_API_KEY) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Missing NOTION_API_KEY environment variable',
      }),
    };
  }

  if (!NOTION_DATABASE_ID) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Missing NOTION_DATABASE_ID environment variable',
      }),
    };
  }

  try {
    // Parse request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Validate required fields
    if (!body.type || !body.typeName) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Missing required fields: type, typeName',
        }),
      };
    }

    // Extract user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Map data to Notion format
    const notionPayload = mapDataToNotion(body, userAgent);

    // Create page in Notion
    const notionResponse = await createNotionPage(notionPayload);

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        notionPageId: notionResponse.id,
        message: 'Result saved successfully',
      }),
    };
  } catch (error) {
    console.error('Error in /api/result:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
}

/**
 * Main handler for OPTIONS requests (preflight)
 */
function handleOptions() {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: '',
  };
}

/**
 * Vercel handler
 */
module.exports = function handler(req, res) {
  // Set CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    handlePost(req).then((result) => {
      res.status(result.statusCode).json(JSON.parse(result.body));
    }).catch((error) => {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    });
    return;
  }

  res.status(405).json({
    error: 'Method not allowed',
  });
}
