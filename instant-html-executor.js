// This script, when loaded, instantly writes the provided HTML into a new about:blank tab.

window.addEventListener('DOMContentLoaded', () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTML Executor</title>
  <style>
    body {
      background-color: #2b0000;
      color: #f0d0d0;
      font-family: sans-serif;
      margin: 1em;
    }
    h1 {
      color: #ff5555;
      margin-bottom: 0.5em;
    }
    .controls {
      background-color: #330000;
      border: 1px solid #550000;
      padding: 1em;
      border-radius: 4px;
    }
    label {
      display: block;
      margin-top: 0.75em;
      font-weight: bold;
    }
    input[type="file"],
    input[type="text"],
    textarea {
      background-color: #440000;
      color: #f0d0d0;
      border: 1px solid #660000;
      border-radius: 3px;
      padding: 0.5em;
      font-family: monospace;
      width: 100%;
      box-sizing: border-box;
    }
    textarea {
      height: 20vh;
      resize: vertical;
    }
    button {
      background-color: #770000;
      color: #f0d0d0;
      border: 1px solid #990000;
      border-radius: 3px;
      padding: 0.5em 1em;
      margin-top: 0.5em;
      cursor: pointer;
      font-weight: bold;
    }
    button:disabled {
      background-color: #550000;
      border-color: #770000;
      cursor: not-allowed;
      opacity: 0.6;
    }
    button:hover:not(:disabled) {
      background-color: #990000;
      border-color: #bb0000;
    }
  </style>
</head>
<body>
  <h1>HTML Executor</h1>
  <div class="controls">
    <label>
      Upload .html or .txt file:
      <input type="file" id="fileInput" accept=".html,.txt">
    </label>
    <button id="runFileBtn" disabled>Run Uploaded File</button>
    <label>
      Paste your HTML code here:
      <textarea id="codeInput" placeholder="&lt;h1&gt;Hello world&lt;/h1&gt;"></textarea>
    </label>
    <button id="runCodeBtn">Run Code</button>
    <label>
      Load HTML from URL:
      <input type="text" id="urlInput" placeholder="https://example.com/page.html">
    </label>
    <button id="fetchUrlBtn">Fetch & Run</button>
  </div>
  <script>
    let uploadedContent = null;
    function openInNewTab(htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
    const fileInput = document.getElementById('fileInput');
    const runFileBtn = document.getElementById('runFileBtn');
    fileInput.addEventListener('change', evt => {
      const file = evt.target.files[0];
      uploadedContent = null;
      runFileBtn.disabled = true;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        uploadedContent = e.target.result;
        runFileBtn.disabled = false;
      };
      reader.readAsText(file);
    });
    runFileBtn.addEventListener('click', () => {
      if (uploadedContent !== null) {
        openInNewTab(uploadedContent);
      }
    });
    document.getElementById('runCodeBtn').addEventListener('click', () => {
      const code = document.getElementById('codeInput').value;
      if (!code.trim()) return alert('Paste some HTML code first!');
      openInNewTab(code);
    });
    document.getElementById('fetchUrlBtn').addEventListener('click', () => {
      const url = document.getElementById('urlInput').value.trim();
      if (!url) return alert('Enter a URL first');
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(\`Status \${res.status}\`);
          return res.text();
        })
        .then(html => {
          openInNewTab(html);
        })
        .catch(err => {
          alert('Fetch error: ' + err.message);
        });
    });
  <\/script>
</body>
</html>
`;

  // Open about:blank and write the HTML into it
  const win = window.open('about:blank', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } else {
    alert('Popup blocked! Please allow popups for this site.');
  }
});