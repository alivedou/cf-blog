import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import matter from "gray-matter";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 文章存放目录
  const POSTS_DIR = path.join(process.cwd(), "content/posts");

  // 确保文章目录存在，如果为空则创建一个示例文章
  try {
    await fs.mkdir(POSTS_DIR, { recursive: true });
    const files = await fs.readdir(POSTS_DIR);
    if (files.length === 0) {
      await fs.writeFile(
        path.join(POSTS_DIR, "hello-world.md"),
        `---
title: Hello World
date: 2024-05-16
description: This is your first blog post.
image: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop
tags: ["General", "Welcome"]
---
Welcome to my new blog! This project is built with React, Express, and inspired by the Hugo Stack theme.
      `
      );
    }
  } catch (err) {
    console.error("Failed to setup content directory:", err);
  }

  // API 路由：获取所有文章列表
  app.get("/api/posts", async (req, res) => {
    try {
      const files = await fs.readdir(POSTS_DIR);
      const posts = await Promise.all(
        files
          .filter(file => file.endsWith(".md"))
          .map(async (file) => {
            const content = await fs.readFile(path.join(POSTS_DIR, file), "utf-8");
            const { data } = matter(content);
            return {
              slug: file.replace(".md", ""),
              ...data,
            };
          })
      );
      // 按日期降序排序
      posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // API 路由：根据 slug 获取单篇文章详情
  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      res.json({ metadata: data, content });
    } catch (error) {
      res.status(404).json({ error: "Post not found" });
    }
  });

  // API 路由：利用 AI 总结文章内容
  app.post("/api/ai/summarize", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    try {
      const prompt = `请用 3 个简洁的列点总结以下博客文章内容。使用与文章相同的语言。
      
      文章内容:
      ${content.substring(0, 5000)}`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ summary: result.text });
    } catch (error) {
      console.error("总结失败:", error);
      res.status(500).json({ error: "总结失败" });
    }
  });

  // API 路由：AI 辅助搜索，根据查询返回相关文章
  app.post("/api/ai/search", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "查询参数是必须的" });

    try {
      const files = await fs.readdir(POSTS_DIR);
      const postsContext = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(path.join(POSTS_DIR, file), "utf-8");
          const { data } = matter(content);
          return `标题: ${data.title}, 标签: ${(data.tags || []).join(",")}, Slug: ${file.replace(".md", "")}`;
        })
      );

      const prompt = `你是一个博客搜索助手。根据以下博客文章列表和用户的查询请求，识别出最相关的文章 slug。仅返回文章 slug 的逗号分隔列表。
      
      文章列表:
      ${postsContext.join("\n")}
      
      用户查询: ${query}`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const slugs = result.text.split(",").map(s => s.trim());
      res.json({ slugs });
    } catch (error) {
      console.error("AI 搜索失败:", error);
      res.status(500).json({ error: "AI 搜索失败" });
    }
  });

  // Vite 开发服务器中间件
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

startServer();
