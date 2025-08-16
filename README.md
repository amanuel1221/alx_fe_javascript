# alx_fe_javascript
# 🚀 Dynamic Web Tasks

### This repo contains exercises and practice projects to strengthen my understanding of dynamic web development concepts such as DOM manipulation, Web Storage, and JSON.

## 📚 Topics Covered

### DOM Manipulation

#### - Selecting elements (getElementById, querySelector, etc.)

#### - Creating and appending elements dynamically

#### - Event handling (addEventListener)

#### - Updating and deleting elements

#### - Web Storage


#### - Difference between server-side vs client-side storage

#### - localStorage

#### - Persists data across browser sessions

#### - : setItem, getItem, removeItem

#### - sessionStorage

#### - Data lasts only while the tab/window is open

#### - Methods: setItem, getItem, removeItem

#### - JSON (JavaScript Object Notation)

#### - Structuring and transferring data

#### - JSON.stringify() → convert object to JSON string

#### - JSON.parse() → convert JSON string back to object

#### - Example:

#### - const user = { name: "Amanuel", age: 23 };
#### - localStorage.setItem("user", JSON.stringify(user));
#### - const parsedUser = JSON.parse(localStorage.getItem("user"));


#### - Practical Tasks

#### - To-do list with add/delete buttons

#### - Form data saving to localStorage

#### - Temporary shopping cart with sessionStorage

#### - Listening for storage changes across tabs

#### - Saving Dates and restoring them as Date objects

### 📝 Key Learnings

#### - Use sessionStorage for temporary, tab-specific data.

#### - Use localStorage for persistent, browser-wide data.

#### - Always wrap JSON.parse() in a try...catch to avoid crashes.

#### - Avoid storing sensitive data (like access tokens) in localStorage.

#### - Use the storage event to sync changes across multiple tabs.

#### - ⚡ Next Steps

#### - Build a mini task manager app with localStorage.

#### - Add form validation and store user input.

#### - Explore IndexedDB for more advanced client-side storage.

##  This repo is part of my learning journey in Web Development.
