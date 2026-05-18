import { NextRequest, NextResponse } from 'next/server';

const KIBANA_URL = 'https://kibana.livetechlabs.net/direct/filebeat-live-*/_search';
const API_KEY = 'bmJrQkFaNEJnQVlBbTBuRlpVOXg6SElrc1BwRDhRSWVSeXdTSHY3czJHUQ==';

export async function POST(request: NextRequest) {
  try {
    const clientBody = await request.json();

    // Direct proxy to Elasticsearch cluster securely appending your API key
    const response = await fetch(KIBANA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${API_KEY}`,
      },
      body: JSON.stringify(clientBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Elasticsearch upstream responded with status ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server proxy failure', details: error.message },
      { status: 500 }
    );
  }
}