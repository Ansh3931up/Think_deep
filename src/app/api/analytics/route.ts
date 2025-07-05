import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
  try {
    // Get the service account JSON from environment variable
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      return NextResponse.json({ error: 'Google service account not configured' }, { status: 500 });
    }

    // Parse the service account JSON
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
    } catch (error) {
      return NextResponse.json({ error: 'Invalid service account JSON format' }, { status: 500 });
    }

    // Get the property ID from environment variable
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return NextResponse.json({ error: 'GA4 Property ID not configured' }, { status: 500 });
    }

    // Create the analytics client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: serviceAccount,
    });

    // Get the date range for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Run the 7-day report
    const [weekResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
      ],
    });

    // Run the all-time report for total impressions
    const [allTimeResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2015-08-14', // GA4 minimum allowed date (strictly greater than 2015-08-13)
          endDate: endDate.toISOString().split('T')[0],
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    return NextResponse.json({
      week: weekResponse.rows,
      allTime: allTimeResponse.rows,
      propertyId: propertyId, // Include the property ID in the response
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 