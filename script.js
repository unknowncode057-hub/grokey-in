// Sample data
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 12.99,
        condition: "Good",
        description: "Classic American novel",
        owner: "demo",
        dateAdded: new Date()
    },
    {
        id: 2,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Academic",
        price: 89.99,
        condition: "Like New",
        description: "Computer science textbook",
        owner: "other",
        dateAdded: new Date(Date.now() - 86400000)
    },
    {
        id: 3,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        category: "Children",
        price: 8.99,
        condition: "Good",
        description: "First book in the series",
        owner: "other",
        dateAdded: new Date(Date.now() - 172800000)
    }
];

// AI Book Database for recognition
const aiBookDatabase = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", price: 14.99 },
    { title: "1984", author: "George Orwell", category: "Fiction", price: 13.99 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", price: 12.99 },
    { title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", price: 11.99 },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fiction", price: 24.99 },
    { title: "Calculus: Early Transcendentals", author: "James Stewart", category: "Academic", price: 299.99 },
    { title: "The Very Hungry Caterpillar", author: "Eric Carle", category: "Children", price: 8.99 },
    { title: "Gone Girl", author: "Gillian Flynn", category: "Mystery", price: 15.99 }
];

let currentUser = null;
let currentSection = 'home';
let isScanning = false;

// AI Scanning Functions
function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    document.getElementById('aiScanner').classList.add('hidden');
    document.getElementById('cameraView').classList.remove('hidden');
    
    // Simulate camera scanning process
    let scanStep = 0;
    const scanSteps = [
        { icon: '📷', text: 'Initializing camera...' },
        { icon: '🔍', text: 'Detecting book cover...' },
        { icon: '🤖', text: 'AI analyzing image...' },
        { icon: '✅', text: 'Book recognized!' }
    ];
    
    const scanInterval = setInterval(() => {
        if (scanStep < scanSteps.length) {
            document.getElementById('scanningIcon').textContent = scanSteps[scanStep].icon;
            document.getElementById('scanningText').textContent = scanSteps[scanStep].text;
            scanStep++;
        } else {
            clearInterval(scanInterval);
            completeScanning();
        }
    }, 800);
}

function completeScanning() {
    // Randomly select a book from AI database
    const recognizedBook = aiBookDatabase[Math.floor(Math.random() * aiBookDatabase.length)];
    
    // Fill form with recognized data
    document.getElementById('bookTitle').value = recognizedBook.title;
    document.getElementById('bookAuthor').value = recognizedBook.author;
    document.getElementById('bookCategory').value = recognizedBook.category;
    document.getElementById('bookPrice').value = recognizedBook.price;
    
    // Hide camera and show form
    stopScanning();
    showNotification(`📚 Book recognized: "${recognizedBook.title}"!`);
}

function stopScanning() {
    isScanning = false;
    document.getElementById('cameraView').classList.add('hidden');
    document.getElementById('aiScanner').classList.remove('hidden');
}

// Show different sections
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
    // Remove active class from all nav buttons
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bottom-nav-active');
        if (!btn.id.includes('sell')) {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('text-gray-500');
        }
    });
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    // Update nav button
    const navBtn = document.getElementById(`nav-${section}`);
    if (navBtn && !navBtn.id.includes('sell')) {
        navBtn.classList.add('bottom-nav-active');
    }
    
    // Update header
    const subtitles = {
        'home': 'Welcome back!',
        'mybooks': 'Your listed books',
        'sell': 'List a new book',
        'newbooks': 'Latest additions',
        'account': 'Manage your profile'
    };
    document.getElementById('headerSubtitle').textContent = subtitles[section];
    
    currentSection = section;
    
    // Load section-specific content
    if (section === 'home') {
        renderFeaturedBooks();
        updateStats();
    } else if (section === 'mybooks') {
        renderMyBooks();
    } else if (section === 'newbooks') {
        renderNewBooks();
    } else if (section === 'account') {
        updateAccountStats();
    }
}

// Render featured books
function renderFeaturedBooks() {
    const container = document.getElementById('featuredBooks');
    const featured = books.slice(0, 3);
    
    container.innerHTML = featured.map(book => `
        <div class="bg-white p-4 rounded-2xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${book.title}</h4>
                <span class="text-lg font-bold text-green-600">$${book.price}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">by ${book.author}</p>
            <div class="flex justify-between items-center">
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${book.category}</span>
                <button onclick="buyBook(${book.id})" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                    Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Render user's books
function renderMyBooks() {
    const container = document.getElementById('myBooksList');
    const myBooks = books.filter(book => book.owner === 'demo');
    
    if (myBooks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-4">📚</div>
                <p class="text-gray-600 mb-4">You haven't listed any books yet</p>
                <button onclick="showSection('sell')" class="bg-blue-600 text-white px-6 py-3 rounded-xl">
                    List Your First Book
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myBooks.map(book => `
        <div class="bg-white p-4 rounded-2xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${book.title}</h4>
                <span class="text-lg font-bold text-green-600">$${book.price}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">by ${book.author}</p>
            <div class="flex justify-between items-center">
                <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">${book.condition}</span>
                <button onclick="removeBook(${book.id})" class="text-red-600 text-sm hover:text-red-800">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Render new books
function renderNewBooks() {
    const container = document.getElementById('newBooksList');
    const sortedBooks = [...books].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    container.innerHTML = sortedBooks.map(book => `
        <div class="bg-white p-4 rounded-2xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${book.title}</h4>
                <span class="text-lg font-bold text-green-600">$${book.price}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">by ${book.author}</p>
            <p class="text-xs text-gray-500 mb-3">${book.description}</p>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${book.category}</span>
                    <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">${book.condition}</span>
                </div>
                <button onclick="buyBook(${book.id})" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                    Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Handle sell book form
document.getElementById('sellBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newBook = {
        id: Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        condition: document.getElementById('bookCondition').value,
        description: document.getElementById('bookDescription').value || 'No description provided',
        owner: 'demo',
        dateAdded: new Date()
    };
    
    books.push(newBook);
    this.reset();
    
    showNotification('Book listed successfully! 📚');
    updateStats();
});

// Buy book function
function buyBook(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        showNotification(`Successfully purchased "${book.title}"! 🎉`);
    }
}

// Remove book function
function removeBook(id) {
    books = books.filter(book => book.id !== id);
    renderMyBooks();
    updateStats();
    showNotification('Book removed successfully');
}

// Filter books
function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    
    const container = document.getElementById('newBooksList');
    container.innerHTML = filteredBooks.map(book => `
        <div class="bg-white p-4 rounded-2xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${book.title}</h4>
                <span class="text-lg font-bold text-green-600">$${book.price}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">by ${book.author}</p>
            <p class="text-xs text-gray-500 mb-3">${book.description}</p>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${book.category}</span>
                    <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">${book.condition}</span>
                </div>
                <button onclick="buyBook(${book.id})" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                    Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('myBooksCount').textContent = books.filter(b => b.owner === 'demo').length;
}

// Update account stats
function updateAccountStats() {
    const myBooks = books.filter(b => b.owner === 'demo');
    document.getElementById('accountBooksListed').textContent = myBooks.length;
    document.getElementById('accountBooksSold').textContent = Math.floor(myBooks.length * 0.3); // Simulate some sales
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`;
    
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Show main app immediately (no login required)
    document.getElementById('mainApp').classList.remove('hidden');
    showSection('home');
    updateStats();
});

// Search on enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        filterBooks();
    }
});