<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.error('Highlight error:', e)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

// 自定义渲染器，处理代码块
const renderer = new marked.Renderer()

renderer.code = function(code, language) {
  const lang = language || 'plaintext'
  let highlightedCode
  try {
    if (hljs.getLanguage(lang)) {
      highlightedCode = hljs.highlight(code, { language: lang }).value
    } else {
      highlightedCode = hljs.highlightAuto(code).value
    }
  } catch (e) {
    highlightedCode = code
  }

  return `<div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="language">${lang}</span>
      <button class="copy-btn" onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">复制</button>
    </div>
    <pre><code class="hljs ${lang}">${highlightedCode}</code></pre>
  </div>`
}

const customMarked = marked.use({ renderer })

const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    return marked.parse(props.content)
  } catch (e) {
    console.error('Markdown parse error:', e)
    return props.content
  }
})
</script>

<style>
@import 'highlight.js/styles/github-dark.css';

.markdown-content {
  line-height: 1.6;
  color: #1a1a1a;
}

.markdown-content pre {
  margin: 0;
}

.markdown-content .hljs {
  background: #1e1e1e;
  padding: 12px;
}
</style>
