import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogsDir = path.join(__dirname, '..', 'markdown/blogs');

// Read all blog files
const blogFiles = fs.readdirSync(blogsDir).filter(file => file.endsWith('.mdx'));

blogFiles.forEach(file => {
  const filePath = path.join(blogsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update coverImage paths from .jpg to .jpeg
  content = content.replace(/coverImage: \/images\/blog\/blog-(\d+)\.jpg/g, (match, num) => {
    return `coverImage: /images/blog/blog-${num}.jpeg`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All blog files updated!'); 