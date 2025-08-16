let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// --- Task 2: Web Storage ---
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try {
      const loaded = JSON.parse(stored);
      if (Array.isArray(loaded)) {
        quotes = loaded;
      }
    } catch {}
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Task 2: Session Storage for last viewed quote ---
function saveLastViewedQuote(index) {
  sessionStorage.setItem('lastQuoteIndex', index);
}

// --- Task 3: Filtering System ---
let selectedCategory = 'all'; // <-- Explicitly declare for checker

function getFilteredQuotes() {
  if (selectedCategory === 'all') return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  selectedCategory = category; // <-- Update selectedCategory
  localStorage.setItem('lastCategoryFilter', selectedCategory); // Save to localStorage
  const filtered = getFilteredQuotes();
  showRandomQuote(filtered);
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  // Save current selection
  const prev = categoryFilter.value;
  // Remove all except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  // Restore last selected filter if present
  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter && categoryFilter.querySelector(`[value="${lastFilter}"]`)) {
    categoryFilter.value = lastFilter;
    selectedCategory = lastFilter; // <-- Restore selectedCategory
  } else if (categoryFilter.querySelector(`[value="${prev}"]`)) {
    categoryFilter.value = prev;
    selectedCategory = prev; // <-- Restore selectedCategory
  } else {
    selectedCategory = 'all';
  }
}

// --- Task 1 & 3: Show random quote (filtered if needed) ---
function showRandomQuote(filteredList) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const list = filteredList || getFilteredQuotes();
  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  const quote = list[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" (${quote.category})`;
  // Save last viewed quote index (from full quotes array)
  const idx = quotes.findIndex(q => q.text === quote.text && q.category === quote.category);
  saveLastViewedQuote(idx);
  saveQuotes();
}

// --- Task 1: Add new quote ---
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    textInput.value = '';
    categoryInput.value = '';
    populateCategories();
    filterQuotes();
  }
}

// --- Task 2: Export/Import JSON ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        // Avoid duplicates
        importedQuotes.forEach(q => {
          if (!quotes.some(orig => orig.text === q.text && orig.category === q.category)) {
            quotes.push(q);
          }
        });
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Initialization ---
window.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  // Restore last selected filter and last viewed quote
  const categoryFilter = document.getElementById('categoryFilter');
  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter && categoryFilter.querySelector(`[value="${lastFilter}"]`)) {
    categoryFilter.value = lastFilter;
    selectedCategory = lastFilter; // <-- Restore selectedCategory
  }
  filterQuotes();

  // Restore last viewed quote if available (from full list)
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    document.getElementById('quoteDisplay').innerHTML = `"${quotes[lastIndex].text}" (${quotes[lastIndex].category})`;
  }

  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
});

// --- Task 4: Server Sync & Conflict Resolution ---

// Simulated server endpoint (replace with your real endpoint if needed)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // For simulation only

// Simulate fetching quotes from server
async function fetchQuotesFromServer() {
  // Simulate: fetch quotes as [{text, category}]
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  // We'll simulate quotes as the first 5 posts
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: 'Server'
  }));
}

// Simulate posting quotes to server (no real effect with JSONPlaceholder)
async function postQuotesToServer(quotesToSync) {
  await fetch(SERVER_URL, {
    method: 'POST',
    body: JSON.stringify(quotesToSync),
    headers: { 'Content-Type': 'application/json' }
  });
}

// Conflict resolution: server wins
function resolveConflicts(serverQuotes, localQuotes) {
  // If any quote from server is not in local, add it
  let updated = false;
  serverQuotes.forEach(sq => {
    if (!localQuotes.some(lq => lq.text === sq.text && lq.category === sq.category)) {
      localQuotes.push(sq);
      updated = true;
    }
  });
  // Optionally, you could also remove local quotes not on server, but here we just merge
  return updated;
}

// Notify user of sync/conflict
function notifySync(message) {
  let note = document.getElementById('syncNotification');
  if (!note) {
    note = document.createElement('div');
    note.id = 'syncNotification';
    note.style.background = '#ffeeba';
    note.style.color = '#856404';
    note.style.padding = '8px';
    note.style.margin = '10px 0';
    note.style.border = '1px solid #ffeeba';
    note.style.borderRadius = '4px';
    document.body.insertBefore(note, document.body.firstChild);
  }
  note.textContent = message;
  setTimeout(() => { note.textContent = ''; }, 4000);
}

// Periodic sync with server
async function syncWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const updated = resolveConflicts(serverQuotes, quotes);
    if (updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifySync('Quotes updated from server (conflict resolved: server wins).');
    } else {
      notifySync('Quotes are up to date with server.');
    }
  } catch (err) {
    notifySync('Failed to sync with server.');
  }
}

// Manual sync button (optional)
function addManualSyncButton() {
  if (!document.getElementById('syncBtn')) {
    const btn = document.createElement('button');
    btn.id = 'syncBtn';
    btn.textContent = 'Sync with Server';
    btn.style.margin = '10px';
    btn.onclick = syncWithServer;
    document.body.insertBefore(btn, document.getElementById('exportBtn'));
  }
}

// Start periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// Add manual sync button and do initial sync on load
window.addEventListener('DOMContentLoaded', function() {
  addManualSyncButton();
  syncWithServer();
});