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

// --- Task 3: Filtering System ---
function getFilteredQuotes() {
  const category = document.getElementById('categoryFilter').value;
  if (category === 'all') return quotes;
  return quotes.filter(q => q.category === category);
}

function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastCategoryFilter', category);
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
  } else if (categoryFilter.querySelector(`[value="${prev}"]`)) {
    categoryFilter.value = prev;
  }
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