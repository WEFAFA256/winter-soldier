import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'njzctr4m',
  api_key: process.env.CLOUDINARY_API_KEY || '143573632263644',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'bRjjHhCZmsSnqvoJHhKg5D9SMOA',
});

const BLOG_PUBLIC_ID = 'serenity_data/blog-posts';
const localBlogPath = path.join(process.cwd(), 'public', 'blog.json');

const readLocalBlog = (): any[] => {
  try {
    if (!fs.existsSync(localBlogPath)) return [];
    return JSON.parse(fs.readFileSync(localBlogPath, 'utf8'));
  } catch {
    return [];
  }
};

const writeLocalBlog = (posts: any[]) => {
  try {
    fs.writeFileSync(localBlogPath, JSON.stringify(posts, null, 2), 'utf8');
  } catch {}
};

const fetchCloudinaryBlog = async (): Promise<any[]> => {
  try {
    const result = await cloudinary.api.resource(BLOG_PUBLIC_ID, { resource_type: 'raw' });
    const res = await fetch(result.secure_url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const saveCloudinaryBlog = async (posts: any[]) => {
  const buffer = Buffer.from(JSON.stringify(posts, null, 2), 'utf8');
  await new Promise<void>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: BLOG_PUBLIC_ID, resource_type: 'raw', overwrite: true },
      (err) => { if (err) reject(err); else resolve(); }
    );
    stream.end(buffer);
  });
};

// GET — fetch all blog posts
export async function GET() {
  try {
    const posts = await fetchCloudinaryBlog();
    if (posts.length > 0) {
      writeLocalBlog(posts);
      return NextResponse.json(posts);
    }
  } catch {}
  return NextResponse.json(readLocalBlog());
}

// POST — add a new blog post
export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')?.trim();
    if (auth !== 'Bearer Serenityspa256.') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await req.json();
    if (!post.title || !post.id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let posts = await fetchCloudinaryBlog();
    if (!posts.length) posts = readLocalBlog();

    posts.unshift(post);
    writeLocalBlog(posts);

    try { await saveCloudinaryBlog(posts); } catch {}

    return NextResponse.json({ message: 'Blog post published', post }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a blog post by id
export async function DELETE(req: Request) {
  try {
    const auth = req.headers.get('authorization')?.trim();
    if (auth !== 'Bearer Serenityspa256.') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    let posts = await fetchCloudinaryBlog();
    if (!posts.length) posts = readLocalBlog();

    posts = posts.filter((p: any) => p.id !== id);
    writeLocalBlog(posts);

    try { await saveCloudinaryBlog(posts); } catch {}

    return NextResponse.json({ message: 'Post deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
