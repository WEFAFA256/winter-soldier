import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'public', 'site-content.json');

const readContentData = () => {
    try {
        if (!fs.existsSync(contentFilePath)) {
            return {};
        }
        const data = fs.readFileSync(contentFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading site-content data:", error);
        return {};
    }
};

export async function GET() {
    try {
        const content = readContentData();
        return NextResponse.json(content);
    } catch (error) {
        console.error("Error fetching content:", error);
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Auth check
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const newContent = await req.json();

        // Write content to disk
        fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), 'utf8');
        
        return NextResponse.json({ message: 'Content updated successfully', content: newContent }, { status: 200 });
    } catch (error) {
        console.error("Error in POST content:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
