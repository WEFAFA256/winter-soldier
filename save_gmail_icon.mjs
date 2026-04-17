// Downloads the Gmail icon and uploads it to Supabase
import fs from 'fs';

const SUPABASE_URL = 'https://lusvuwwlcdgowauvdpoh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c3Z1d3dsY2Rnb3dhdXZkcG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzEyMDksImV4cCI6MjA4OTc0NzIwOX0.a3gTaqX7-zh7pKuQ3tQhu9g4uRV5U6UW4unjh9NsaTM';
const BUCKET = 'website-assets';

// Use the Wikipedia commons full-resolution Gmail icon PNG
const GMAIL_ICON_URL = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg';

async function downloadAndUpload() {
  console.log('Downloading Gmail icon...');

  // Fetch the SVG from Wikipedia
  const res = await fetch(GMAIL_ICON_URL);
  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
  }

  const svgBuffer = await res.arrayBuffer();
  const svgBytes = new Uint8Array(svgBuffer);

  // Save locally as email-icon.svg
  fs.writeFileSync('./public/assets/email-icon.svg', svgBytes);
  console.log('✅ Saved locally as public/assets/email-icon.svg');

  // Upload to Supabase
  console.log('Uploading to Supabase...');
  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/assets/email-icon.svg`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'image/svg+xml',
        'x-upsert': 'true',
      },
      body: svgBytes,
    }
  );

  if (uploadRes.ok) {
    console.log('✅ Uploaded to Supabase!');
    console.log(`🌐 URL: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/assets/email-icon.svg`);
  } else {
    const err = await uploadRes.text();
    console.error('❌ Upload failed:', err);
  }
}

downloadAndUpload().catch(console.error);

