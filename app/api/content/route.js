import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://lusvuwwlcdgowauvdpoh.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c3Z1d3dsY2Rnb3dhdXZkcG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzEyMDksImV4cCI6MjA4OTc0NzIwOX0.a3gTaqX7-zh7pKuQ3tQhu9g4uRV5U6UW4unjh9NsaTM';
const BUCKET = 'website-assets';
const SUPABASE_FILE_URL = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/site-content.json`;

const contentFilePath = path.join(process.cwd(), 'public', 'site-content.json');

const readLocalContent = () => {
    try {
        if (!fs.existsSync(contentFilePath)) {
            return {};
        }
        const data = fs.readFileSync(contentFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading local site-content data:", error);
        return {};
    }
};

export async function GET() {
    try {
        // Try reading from Supabase Storage first
        const res = await fetch(SUPABASE_FILE_URL, {
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'cache-control': 'no-cache'
            }
        });
        
        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }
        
        console.warn(`Supabase fetch failed with status ${res.status}, falling back to local JSON`);
        return NextResponse.json(readLocalContent());
    } catch (error) {
        console.error("Error fetching content from Supabase, falling back to local JSON:", error);
        return NextResponse.json(readLocalContent());
    }
}

export async function POST(req) {
    try {
        // Auth check
        const authHeader = req.headers.get('authorization')?.trim();
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const newContent = await req.json();
        const contentBuffer = Buffer.from(JSON.stringify(newContent, null, 2));

        // 1. Upload/Upsert directly to Supabase Storage
        const supabaseRes = await fetch(SUPABASE_FILE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'x-upsert': 'true',
            },
            body: contentBuffer,
        });

        if (!supabaseRes.ok) {
            const errMsg = await supabaseRes.text();
            throw new Error(`Supabase Storage upload failed: ${errMsg}`);
        }

        // 2. Try writing to local disk (will succeed in local dev, safely ignored on Vercel)
        try {
            fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), 'utf8');
        } catch (e) {
            // Read-only filesystem is expected on Vercel/serverless
        }
        
        return NextResponse.json({ message: 'Content updated successfully in Cloud Storage', content: newContent }, { status: 200 });
    } catch (error) {
        console.error("Error in POST content:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
