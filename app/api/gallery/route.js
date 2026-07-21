import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'njzctr4m',
    api_key: process.env.CLOUDINARY_API_KEY || '143573632263644',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'bRjjHhCZmsSnqvoJHhKg5D9SMOA',
});

// Define the path for fallback local metadata store
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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directly to Cloudinary using upload_stream
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'serenity_gallery',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const images = readData();
        const newImage = {
            id: uploadResult.public_id,
            src: uploadResult.secure_url,
            alt: alt,
            delay: 'delay-100'
        };
        
        images.unshift(newImage);
        
        if (writeData(images)) {
            return NextResponse.json({ message: 'Image uploaded successfully to Cloudinary', image: newImage }, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in POST to Cloudinary:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
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

        // Delete from Cloudinary if it's stored on Cloudinary
        if (imageToDelete.id.includes('serenity_gallery') || imageToDelete.src.includes('cloudinary')) {
            try {
                await cloudinary.uploader.destroy(imageToDelete.id);
            } catch (cErr) {
                console.error("Cloudinary delete error:", cErr);
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
