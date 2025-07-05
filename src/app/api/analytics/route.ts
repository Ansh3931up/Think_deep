import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';
import path from 'path';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(
    readFileSync(path.join(process.cwd(), 'symmetric-hash-452501-e7-a6c5547c72e1.json'), 'utf8')
  ),
});

const PROPERTY_ID = '11442970912';

export async function GET() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch analytics' }, { status: 500 });
  }
} 