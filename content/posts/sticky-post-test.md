---
title: 测试置顶文章
date: 2026-05-17
draft: false
sticky: 1
tags: ["置顶测试"]
description: 这是一篇关于置顶功能的测试文章，它将会在主页的最上方展示。
image: "public/images/kun.jpg"
---

## 欢迎使用置顶功能！

这篇测试文章应用了 `sticky: 1` 属性，因此它会被自动提取到首页的 **推荐阅读** 区域。

你可以通过修改文章的 `sticky` 数值来调整排序权重，数值越小越靠前。如果要取消置顶，直接删去前言（Front-matter）中的 `sticky` 行或者将它置空即可。
