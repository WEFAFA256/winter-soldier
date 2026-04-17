import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const SUPABASE_PREFIX = 'https://lusvuwwlcdgowauvdpoh.supabase.co/storage/v1/object/public/website-assets';

function getFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, filesList);
        } else if (filePath.endsWith('.jsx')) {
            filesList.push(filePath);
        }
    }
    return filesList;
}

const files = getFiles(SRC_DIR);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Prepend Supabase URL to local /assets/ image strings
    // We look for string literals matching '/assets/...' that are likely image paths
    const newContent = content.replace(/(['"`])(\/assets\/[^'"`]+)(['"`])/g, (match, p1, p2, p3) => {
        return `${p1}${SUPABASE_PREFIX}${p2}${p3}`;
    });

    if (newContent !== content) {
        content = newContent;
        changed = true;
    }

    // 2. Add quality={100} to <Image tags if missing
    // We look for <Image ...> elements
    const imageTagRegex = /<Image\s([^>]+)>/g;
    content = content.replace(imageTagRegex, (match, attrs) => {
        // If it closes immediately with />
        const isSelfClosing = attrs.trim().endsWith('/');
        let innerAttrs = isSelfClosing ? attrs.trim().slice(0, -1) : attrs;
        
        // If it doesn't already have quality, add it
        if (!innerAttrs.includes('quality=')) {
            innerAttrs = `quality={100} ${innerAttrs}`;
            changed = true;
        }

        // If it doesn't have priority on hero sections, we might want to add unoptimized or priority
        // For simplicity, we just add priority to hero components or let Next use it with 100 quality
        return isSelfClosing ? `<Image ${innerAttrs}/>` : `<Image ${innerAttrs}>`;
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated images in ${file}`);
    }
}

console.log('Update complete.');

