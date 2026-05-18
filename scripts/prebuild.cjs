const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content/posts');
const outputFile = path.join(process.cwd(), 'src/posts-data.json');

function generatePosts() {
  console.log('正在预构建文章索引...');
  
  if (!fs.existsSync(postsDirectory)) {
    console.error('错误: 未找到 content/posts 目录');
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = fs.statSync(fullPath);

      // 草稿过滤逻辑：如果设置了 draft: true，则不包含在生成的索引中
      if (data.draft === true || data.draft === 'true') {
        return null;
      }

      return {
        slug,
        metadata: {
          slug,
          title: data.title || '无标题',
          date: data.date 
            ? (data.date instanceof Date ? data.date.toISOString() : data.date) 
            : stats.mtime.toISOString(),
          tags: data.tags || [],
          categories: data.categories || [],
          description: data.description || content.substring(0, 150).replace(/[#*`]/g, '') + '...',
          image: data.image || null,
          sticky: typeof data.sticky === 'number' ? data.sticky : (data.sticky ? 1 : null),
          updated: data.updated 
            ? (data.updated instanceof Date ? data.updated.toISOString() : data.updated) 
            : (data.date ? (data.date instanceof Date ? data.date.toISOString() : data.date) : stats.mtime.toISOString())
        },
        content
      };
    })
    .filter(post => post !== null)
    .sort((a, b) => {
      // Handle sticky sorting first
      const aSticky = a.metadata.sticky;
      const bSticky = b.metadata.sticky;
      
      if (aSticky !== null && bSticky !== null) {
        if (aSticky !== bSticky) return aSticky - bSticky;
        return new Date(b.metadata.date) - new Date(a.metadata.date);
      }
      if (aSticky !== null) return -1;
      if (bSticky !== null) return 1;
      
      // If neither is sticky, sort by date
      return new Date(b.metadata.date) - new Date(a.metadata.date);
    });

  fs.writeFileSync(outputFile, JSON.stringify(allPostsData, null, 2));
  console.log(`成功构建 ${allPostsData.length} 篇文章到 ${outputFile}`);
}

generatePosts();
