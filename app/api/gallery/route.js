import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

// Helper function to read data
const readData = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return [];
        }
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading gallery data:", error);
        return [];
    }
};

// Helper function to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error writing gallery data:", error);
        return false;
    }
};

export async function GET() {
    const images = readData();
    return NextResponse.json(images);
}

export async function POST(req) {
    try {
        const body = await req.json();
        
        // Very basic authentication check for the admin
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { src, alt, delay } = body;
        
        if (!src || !alt) {
            return NextResponse.json({ error: 'Source and alt text are required' }, { status: 400 });
        }

        const images = readData();
        const newImage = {
            id: Date.now().toString(),
            src,
            alt,
            delay: delay || 'delay-100'
        };
        
        images.unshift(newImage); // Add to the top
        
        if (writeData(images)) {
            return NextResponse.json({ message: 'Image added successfully', image: newImage }, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        let images = readData();
        const initialLength = images.length;
        images = images.filter(img => img.id !== id);
        
        if (images.length === initialLength) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }
        
        if (writeData(images)) {
            return NextResponse.json({ message: 'Image removed successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in DELETE:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
