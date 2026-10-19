from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
needle = '<script src="enhancements.js?v=4.0"></script>'
addition = needle + '\n  <script src="accessibility.js?v=4.0"></script>'
if 'accessibility.js?v=4.0' not in text:
    text = text.replace(needle, addition)
path.write_text(text, encoding='utf-8')
