const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');

function updateDates() {
  const files = fs.readdirSync(postsDir);
  const today = new Date().toISOString().split('T')[0];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(postsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 匹配 date: "YYYY-MM-DD"
      const dateRegex = /date:\s*["']?\d{4}-\d{2}-\d{2}["']?/;
      // 匹配 updated: "YYYY-MM-DD"
      const updatedRegex = /updated:\s*["']?\d{4}-\d{2}-\d{2}["']?/;
      
      let newContent = content;

      if (updatedRegex.test(content)) {
        newContent = newContent.replace(updatedRegex, `updated: "${today}"`);
      } else if (dateRegex.test(content)) {
        // 如果没有 updated 字段，则在 date 后面插入一个
        newContent = newContent.replace(dateRegex, (match) => `${match}\nupdated: "${today}"`);
      }
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ 已更新最后修改时间: ${file} -> ${today}`);
      }
    }
  });
}

updateDates();
