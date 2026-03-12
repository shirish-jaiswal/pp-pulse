import { LogRequestParams } from '@/lib/server/kibana/search';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cookie = searchParams.get('cookie') || '';
        const KIBANA_DOMAIN = process.env.KIBANA_LIVE_URL;

        const rawBody: LogRequestParams = await request.json();

        const kibanaPayload = convertToPayload(rawBody);

        // 2. Headers from your screenshot
        const headers = {
            "Cookie": cookie,
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0",
            "kbn-xsrf": "true",
            "elastic-api-version": "1"
        };

        console.log(JSON.stringify(kibanaPayload))
        // 3. Forward the converted payload to Kibana
        const response = await axios.post(
            `${KIBANA_DOMAIN}`,
            kibanaPayload,
            { headers }
        );

        return NextResponse.json({ message: "Success", data: response.data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data || "Internal Server Error" }, 
            { status: error.response?.status || 500 }
        );
    }
}
function queryFormatting(query: string): string {
  return query
    .trim()
    .split(/\s+/)
    .map(token => {
      switch (token.toLowerCase()) {
        case "and":
          return "AND";
        case "or":
          return "OR";
        case "not":
          return "NOT";
        default:
          return token;
      }
    })
    .join(" ");
}
const convertToPayload = (params: LogRequestParams) => {
  const mustClauses: any[] = [
    {
      query_string: {
        query: queryFormatting(params.query)
      }
    }
  ];

  // if (params.matchPhrase && params.matchPhrase.length > 0) {
  //   params.matchPhrase.forEach(item => {
  //     mustClauses.push({
  //       match_phrase: {
          
  //       }
  //     });
  //   });
  // }
  // 3. Construct the final object
  return {
    params: {
      index: params.index,
      body: {
        size: 10000,
        query: {
          bool: {
            must: mustClauses,
            filter: [
              {
                range: {
                  "@timestamp": {
                    gte: params.startDate,
                    lte: params.endDate
                  }
                }
              }
            ]
          }
        },
        sort: [
          {
            "@timestamp": {
              order: params.sort
            }
          }
        ],
        _source: params.fields
      }
    }
  };
};