import MarkdownIt from 'markdown-it'
import highlight from 'highlight.js'
import linkAttributes from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'
import 'highlight.js/styles/base16/onedark.css'

const highlightCode = (value: string) =>
  `<pre class="highlight hljs"><code>${value}</code></pre>`

const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (text: string, language: string): string => {
    try {
      if (language && highlight.getLanguage(language)) {
        const { value } = highlight.highlight(text, { language })

        return highlightCode(value)
      }
    } catch {
      // ignore
    }

    return highlightCode(markdown.utils.escapeHtml(text))
  },
})

markdown.use(linkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})

markdown.use(emoji)

markdown.disable('code')

export default markdown
