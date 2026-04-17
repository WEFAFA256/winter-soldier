import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the paths
const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
        const formData = await req.formData();
        
        // Auth check
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const file = formData.get('file');
        const alt = formData.get('alt') || 'Gallery Image';
        
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Save the file
        fs.writeFileSync(filePath, buffer);
        
        const images = readData();
        const newImage = {
            id: Date.now().toString(),
            src: `/uploads/${fileName}`,
            alt: alt,
            delay: 'delay-100'
        };
        
        images.unshift(newImage);
        
        if (writeData(images)) {
            return NextResponse.json({ message: 'Image uploaded successfully', image: newImage }, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
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
        const imageToDelete = images.find(img => img.id === id);
        
        if (!imageToDelete) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Delete from filesystem if it's a local file
        if (imageToDelete.src.startsWith('/uploads/')) {
            const filePath = path.join(process.cwd(), 'public', imageToDelete.src);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        images = images.filter(img => img.id !== id);
        
        if (writeData(images)) {
            return NextResponse.json({ message: 'Image removed successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in DELETE:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
