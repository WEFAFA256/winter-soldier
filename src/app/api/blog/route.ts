import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdmin } from '@/lib/admin-auth';
import { workerApi } from '@/lib/r2-media';

const localBlogPath = path.join(process.cwd(), 'public', 'blog.json');

const readLocalBlog = (): any[] => {
  try {
    if (!fs.existsSync(localBlogPath)) return [];
    const parsed = JSON.parse(fs.readFileSync(localBlogPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalBlog = (posts: any[]) => {
  try {
    fs.writeFileSync(localBlogPath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing local blog mirror:', error);
  }
};

async function syncBlogsToR2(posts: any[]): Promise<boolean> {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; content?: any }>(
      '/api/content',
      {},
      { admin: false }
    );
    if (response.ok && data?.content) {
      const updatedContent = { ...data.content, blogs: posts };
      const saveRes = await workerApi('/api/content', {
        method: 'POST',
        body: JSON.stringify({ content: updatedContent }),
      });
      return saveRes.response.ok;
    }
  } catch (error) {
    console.error('Error syncing blogs to R2 content:', error);
  }
  return false;
}

// GET — fetch all blog posts
export async function GET() {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; content?: any }>(
      '/api/content',
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.content?.blogs) && data.content.blogs.length > 0) {
      writeLocalBlog(data.content.blogs);
      return NextResponse.json(data.content.blogs, { headers: { 'cache-control': 'no-store' } });
    }
  } catch (error) {
    console.error('Error reading blogs from R2:', error);
  }

  return NextResponse.json(readLocalBlog(), { headers: { 'cache-control': 'no-store' } });
}

// POST — add a new blog post
export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await req.json().catch(() => null);
    if (!post?.title || !post?.id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const posts = readLocalBlog();
    posts.unshift(post);

    writeLocalBlog(posts);
    await syncBlogsToR2(posts);

    return NextResponse.json({ message: 'Blog post published', post }, { status: 201 });
  } catch (err: any) {
    console.error('Error publishing blog post:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE — remove a blog post by id
export async function DELETE(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const posts = readLocalBlog().filter((p: any) => String(p.id) !== String(id));

    writeLocalBlog(posts);
    await syncBlogsToR2(posts);

    return NextResponse.json({ message: 'Post deleted' });
  } catch (err: any) {
    console.error('Error deleting blog post:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
