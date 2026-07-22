import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'njzctr4m',
    api_key: process.env.CLOUDINARY_API_KEY || '143573632263644',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'bRjjHhCZmsSnqvoJHhKg5D9SMOA',
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        // Auth check
        const authHeader = req.headers.get('authorization')?.trim();
        if (authHeader !== 'Bearer Serenityspa256.') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const file = formData.get('file');
        
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directly to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'serenity_site_assets',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ secure_url: uploadResult.secure_url }, { status: 201 });
    } catch (error) {
        console.error("Error in POST upload to Cloudinary:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
