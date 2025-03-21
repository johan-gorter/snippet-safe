class SnippetSafe {
  constructor() {
    this.safeId = null;
    this.snippets = [];
    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.safeIdInput = document.getElementById('safe-id');
    this.loadSafeButton = document.getElementById('load-safe');
    this.safeContent = document.getElementById('safe-content');
    this.pasteSnippetButton = document.getElementById('paste-snippet');
    this.snippetsContainer = document.getElementById('snippets-container');
  }

  attachEventListeners() {
    this.loadSafeButton.addEventListener('click', () => this.loadSafe());
    this.pasteSnippetButton.addEventListener('click', () => this.pasteSnippet());
  }

  async loadSafe() {
    const safeId = this.safeIdInput.value.trim();
    if (!safeId) {
      alert('Please enter a Safe ID');
      return;
    }

    try {
      const response = await fetch(`/api/safe/${safeId}`);
      if (!response.ok) {
        throw new Error('Failed to load safe');
      }
      const data = await response.json();
      this.safeId = safeId;
      this.snippets = data.snippets;
      this.safeContent.classList.remove('hidden');
      this.renderSnippets();
    } catch (error) {
      alert('Error loading safe: ' + error.message);
    }
  }

  async pasteSnippet() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert('No text found in clipboard');
        return;
      }

      const response = await fetch(`/api/safe/${this.safeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to save snippet');
      }

      const data = await response.json();
      this.snippets.unshift({
        id: data.id,
        content: text,
        timestamp: new Date().toISOString(),
      });
      this.renderSnippets();
    } catch (error) {
      alert('Error saving snippet: ' + error.message);
    }
  }

  async deleteSnippet(snippetId) {
    try {
      const response = await fetch(`/api/safe/${this.safeId}/${snippetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete snippet');
      }

      this.snippets = this.snippets.filter(s => s.id !== snippetId);
      this.renderSnippets();
    } catch (error) {
      alert('Error deleting snippet: ' + error.message);
    }
  }

  async copySnippet(content) {
    try {
      await navigator.clipboard.writeText(content);
      alert('Snippet copied to clipboard!');
    } catch (error) {
      alert('Error copying snippet: ' + error.message);
    }
  }

  renderSnippets() {
    this.snippetsContainer.innerHTML = this.snippets.map(snippet => `
            <div class="snippet-item">
                <div class="snippet-content">${snippet.content}</div>
                <div class="snippet-actions">
                    <button class="copy-button" onclick="app.copySnippet('${snippet.content.replace(/'/g, "\\'")}')">
                        Copy
                    </button>
                    <button class="delete-button" onclick="app.deleteSnippet('${snippet.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
  }
}

const app = new SnippetSafe(); 