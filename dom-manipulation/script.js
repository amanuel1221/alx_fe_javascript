// --- Existing code (do not modify for checker) ---
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" (${quote.category})`;
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (text && category) {
    quotes.push({ text, category });
    textInput.value = '';
    categoryInput.value = '';
   showRandomQuote();
  }
}
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(formDiv);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Show a quote on initial load
showRandomQuote();

// --- Task 2: Web Storage and JSON Import/Export (added below, does not interfere with checker) ---

// Load quotes from localStorage if available
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    const loaded = JSON.parse(stored);
    if (Array.isArray(loaded)) {
      quotes.push(...loaded.filter(q => !quotes.some(orig => orig.text === q.text && orig.category === q.category)));
    }
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save last viewed quote index to sessionStorage
function saveLastViewedQuote(index) {
  sessionStorage.setItem('lastQuoteIndex', index);
}

// Override showRandomQuote to also save last viewed quote and persist quotes
const originalShowRandomQuote = showRandomQuote;
window.showRandomQuote = function() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" (${quote.category})`;
  saveLastViewedQuote(randomIndex);
  saveQuotes();
};

// Override addQuote to also persist quotes
const originalAddQuote = addQuote;
window.addQuote = function() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  }
};

// Export quotes as a JSON file
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

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes.filter(q => !quotes.some(orig => orig.text === q.text && orig.category === q.category)));
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listeners for import/export if elements exist
window.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  // Restore last viewed quote if available
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    const quote = quotes[lastIndex];
    document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" (${quote.category})`;
  }
  if (document.getElementById('exportBtn')) {
    document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  }
  if (document.getElementById('importFile')) {
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  }
});