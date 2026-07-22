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

const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

// Helper function to read local default images
const readLocalData = () => {
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

export async function GET() {
    try {
        // Fetch images uploaded to Cloudinary in serenity_gallery folder
        const cloudinaryRes = await cloudinary.search
            .expression('folder:serenity_gallery')
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();

        const cloudinaryImages = (cloudinaryRes.resources || []).map((resource) => ({
            id: resource.public_id,
            src: resource.secure_url,
            alt: resource.context?.custom?.alt || 'Gallery Image',
            delay: 'delay-100'
        }));

        // Merge Cloudinary images with local default gallery images
        const localImages = readLocalData();
        
        // Filter out local images that might already be deleted or duplicated
        const combined = [...cloudinaryImages, ...localImages];

        return NextResponse.json(combined);
    } catch (error) {
        console.error("Error fetching from Cloudinary, falling back to local JSON:", error);
        return NextResponse.json(readLocalData());
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        // Auth check
        const authHeader = req.headers.get('authorization')?.trim();
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

        // Upload directly to Cloudinary with metadata/context
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'serenity_gallery',
                    resource_type: 'image',
                    context: `alt=${alt}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const newImage = {
            id: uploadResult.public_id,
            src: uploadResult.secure_url,
            alt: alt,
            delay: 'delay-100'
        };

        // Try writing to disk locally (will succeed in dev, safely ignored if serverless)
        try {
            const local = readLocalData();
            local.unshift(newImage);
            fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
        } catch (e) {
            // Serverless read-only filesystem notice, Cloudinary holds the file permanently!
        }
        
        return NextResponse.json({ message: 'Image uploaded successfully to Cloudinary', image: newImage }, { status: 201 });
    } catch (error) {
        console.error("Error in POST to Cloudinary:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        const authHeader = req.headers.get('authorization')?.trim();
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Delete from Cloudinary if public_id exists
        try {
            await cloudinary.uploader.destroy(id);
        } catch (cErr) {
            console.error("Cloudinary delete error:", cErr);
        }

        // Try updating local file if in dev
        try {
            let local = readLocalData();
            local = local.filter(img => img.id !== id);
            fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
        } catch (e) {}
        
        return NextResponse.json({ message: 'Image removed successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
