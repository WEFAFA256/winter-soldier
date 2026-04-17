import fs from 'fs';
import path from 'path';
import https from 'https';
import { lookup } from 'node:dns';

// --- Config ---
const SUPABASE_URL = 'https://lusvuwwlcdgowauvdpoh.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c3Z1d3dsY2Rnb3dhdXZkcG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzEyMDksImV4cCI6MjA4OTc0NzIwOX0.a3gTaqX7-zh7pKuQ3tQhu9g4uRV5U6UW4unjh9NsaTM';
const BUCKET = 'website-assets';
const LOCAL_ASSETS_DIR = './public/assets';

// --- Get MIME type ---
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// --- Collect all files recursively ---
function getAllFiles(dir, baseDir = dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, baseDir, fileList);
    } else {
      // Relative path from the assets folder, e.g. "hotel-bg.jpg" or "hotel_rooms/deluxe_queen.jpg"
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      fileList.push({ fullPath, relativePath });
    }
  }
  return fileList;
}

// --- Upload a single file via fetch ---
async function uploadFile(fullPath, supabasePath) {
  const fileBuffer = fs.readFileSync(fullPath);
  const mimeType = getMimeType(fullPath);
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/assets/${supabasePath}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'true', // overwrite if already exists
    },
    body: fileBuffer,
  });

  if (response.ok) {
    return { success: true };
  } else {
    const err = await response.text();
    return { success: false, error: err };
  }
}

// --- Main ---
async function main() {
  console.log('🚀 Starting Supabase image upload...\n');

  const files = getAllFiles(LOCAL_ASSETS_DIR);
  console.log(`📁 Found ${files.length} files to upload.\n`);

  let successCount = 0;
  let failCount = 0;

  for (const { fullPath, relativePath } of files) {
    process.stdout.write(`⬆️  Uploading: assets/${relativePath} ... `);
    const result = await uploadFile(fullPath, relativePath);
    if (result.success) {
      console.log('✅');
      successCount++;
    } else {
      console.log(`❌ FAILED: ${result.error}`);
      failCount++;
    }
  }

  console.log(`\n✅ Done! ${successCount} uploaded, ${failCount} failed.`);
  console.log(`\n🌐 Your images are now live at:`);
  console.log(`   ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/assets/<filename>`);
}

main().catch(console.error);

