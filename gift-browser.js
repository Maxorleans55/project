// LocalStorage Database Functions
class GiftCardDB {
    constructor() {
        this.storageKey = 'giftCardsDB';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                giftCards: [],
                nextId: 1
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey));
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return { giftCards: [], nextId: 1 };
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getAllGiftCards() {
        const data = this.getData();
        return data.giftCards;
    }

    getGiftCard(id) {
        const data = this.getData();
        return data.giftCards.find(card => card.id === id);
    }

    createGiftCard(giftCardData) {
        const data = this.getData();
        const newCard = {
            id: data.nextId,
            ...giftCardData,
            createdAt: new Date().toISOString()
        };
        
        data.giftCards.push(newCard);
        data.nextId++;
        
        if (this.saveData(data)) {
            return newCard;
        }
        return null;
    }

    updateGiftCard(id, giftCardData) {
        const data = this.getData();
        const cardIndex = data.giftCards.findIndex(card => card.id === id);
        
        if (cardIndex === -1) return null;
        
        data.giftCards[cardIndex] = {
            ...data.giftCards[cardIndex],
            ...giftCardData,
            updatedAt: new Date().toISOString()
        };
        
        if (this.saveData(data)) {
            return data.giftCards[cardIndex];
        }
        return null;
    }

    deleteGiftCard(id) {
        const data = this.getData();
        const cardIndex = data.giftCards.findIndex(card => card.id === id);
        
        if (cardIndex === -1) return null;
        
        const deletedCard = data.giftCards.splice(cardIndex, 1)[0];
        
        if (this.saveData(data)) {
            return deletedCard;
        }
        return null;
    }

    searchGiftCards(searchTerm) {
        const data = this.getData();
        const term = searchTerm.toLowerCase();
        
        return data.giftCards.filter(card =>
            card.title.toLowerCase().includes(term) ||
            card.code.toLowerCase().includes(term) ||
            (card.holder && card.holder.toLowerCase().includes(term))
        );
    }

    clearAll() {
        const initialData = {
            giftCards: [],
            nextId: 1
        };
        return this.saveData(initialData);
    }


    importData(data) {
        try {
            // Validate data structure
            if (!data.giftCards || !Array.isArray(data.giftCards)) {
                throw new Error('Invalid data format');
            }
            return this.saveData(data);
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Global variables
let db;
let allGiftCards = [];
let container;

// Utility functions
function showStatus(message, isError = false) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
    statusEl.style.display = 'block';
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 3000);
}

function showCreateForm() {
    document.getElementById('create-modal').style.display = 'block';
}

function hideCreateForm() {
    document.getElementById('create-modal').style.display = 'none';
    // Clear form
    document.getElementById('giftName').value = '';
    document.getElementById('giftDescription').value = '';
    document.getElementById('giftPrice').value = '';
}

function addGift() {
    const name = document.getElementById('giftName').value.trim();
    const description = document.getElementById('giftDescription').value.trim();
    const price = document.getElementById('giftPrice').value.trim();

    if (!name || !description || !price) {
        showStatus('Please fill in all fields.', true);
        return;
    }

    const giftCardData = {
        title: name,
        value: parseInt(price),
        cardNumber: Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
        holder: "John Doe",
        expires: "12/25",
        cvv: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
        code: "GIFT-CARD-CODE-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    };

    const result = db.createGiftCard(giftCardData);
    if (result) {
        showStatus(`Gift card "${name}" created successfully!`);
        hideCreateForm();
        displayGiftCards();
    } else {
        showStatus('Failed to create gift card. Please try again.', true);
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to delete all gift cards? This action cannot be undone.')) {
        if (db.clearAll()) {
            showStatus('All gift cards deleted successfully!');
            displayGiftCards();
        } else {
            showStatus('Failed to clear data.', true);
        }
    }
}


function showImportForm() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (db.importData(data)) {
                        showStatus('Data imported successfully!');
                        displayGiftCards();
                    } else {
                        showStatus('Failed to import data. Please check the file format.', true);
                    }
                } catch (error) {
                    showStatus('Invalid JSON file.', true);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Generate sample data if database is empty
function generateSampleCards() {
    const existingCards = db.getAllGiftCards();
    if (existingCards.length > 0) {
        return; // Don't generate if cards already exist
    }

    const cardTitles = [
        "Netflix", "Apple-Music", "Spotify", "Apple-TV", "Snapchat+", "Hulu",
        "Disney-Plus", "YouTube-Premium", "Amazon-Prime", "Steam"
    ];

    // Generate 20 sample gift cards
    for (let i = 1; i <= 20; i++) {
        const randomIndex = Math.floor(Math.random() * cardTitles.length);
        const title = cardTitles[randomIndex];
        const value = (Math.floor(Math.random() * 20) + 5) * 5; // Values between $25 and $100
        const cardNumber = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
        const holder = "John Doe";
        const expires = "12/25";
        const cvv = Math.floor(Math.random() * 999).toString().padStart(3, '0');
        const code = "GIFT-CARD-CODE-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        const giftCardData = {
            title,
            value,
            cardNumber,
            holder,
            expires,
            cvv,
            code
        };

        db.createGiftCard(giftCardData);
    }
    
    showStatus('Sample gift cards generated!');
}

// Function to create card element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'gift-card';
    cardElement.setAttribute('data-title', card.title.toLowerCase());
    cardElement.setAttribute('data-id', card.id);
    
    // Get the appropriate chip image
    const chipImages = {
        "Netflix": "netflix.png",
        "Apple-Music": "apple-music.jpg",
        "Spotify": "spotify.png",
        "Apple-TV": "appletv.jpg",
        "Snapchat+": "snapchat.png",
        "Hulu": "hulu.png",
        "Disney-Plus": "disney-plus.jpg",
        "YouTube-Premium": "youtube-premium.png",
        "Amazon-Prime": "amazon.png",
        "Steam": "steam.jpg"
    };
    
    const chipImage = chipImages[card.title] || "netflix.png";
    
    cardElement.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <div class="logo">PREMIUM</div>
                <div class="chip"><img src="${chipImage}" style="background: linear-gradient(90deg, #b88746, #f6e6b4); width: 50px; height: 40px; border-radius: 8px; margin:0;"></div>
                <div style="font-size: 22px; letter-spacing: 3px; margin: 2px ; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">${card.title}</div>
                <div class="card-number">${card.cardNumber}</div>
                <div class="card-holder">
                    <div class="card-label">CARD HOLDER</div>
                    <div class="card-value">${card.holder}</div>
                </div>
                <div class="expiry">
                    <div>
                        <div class="card-label">EXPIRES</div>
                        <div class="card-value">${card.expires}</div>
                    </div>
                    <div>
                        <div class="card-label">CVV</div>
                        <div class="card-value">${card.cvv}</div>
                    </div>
                </div>
            </div>
            <div class="card-back">
                <div class="strip" style="height: 40px; background: rgba(0, 0, 0, 0.4); margin: 20px 0;"></div>
                <div class="signature" style="height: 35px; background: repeating-linear-gradient(45deg, #fff, #fff 5px, #eee 5px, #eee 10px); width: 80%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; color: #333; font-style: italic; justify-content: flex-end; padding-right: 10px; font-size: 14px;">Authorized Signature</div>
                <div class="cvv" style="font-size: 14px; margin-top: 10px;">CVV: ${card.cvv}</div>
                <div class="value" style="font-size: 42px; font-weight: bold; margin: 9px 0; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">$${card.value}</div>
                <button class="buy" style="background-color: white; display:inline-block;color:blue; padding:4px; border-radius: 5px; border: none; cursor: pointer;" onclick="buyCard(${card.id})">Buy</button>
                <button class="delete-btn" style="background-color: #65d46eff; display:inline-block;color:white; padding:4px; border-radius: 5px; border: none; cursor: pointer; margin-left: 5px;" onclick="deleteCard(${card.id})">Delete</button>
                <div class="code" style="font-size: 18px; letter-spacing: 4px; background: rgba(255, 255, 255, 0.2); padding: 10px; border-radius: 8px; margin: 10px 0;">${card.code}</div>
                <div class="terms" style="font-size: 10px; opacity: 0.8; margin-top: 15px;">This gift card is subject to terms and conditions. Use constitutes acceptance.</div>
            </div>
        </div>
    `;
    
    return cardElement;
}

// Function to display gift cards
function displayGiftCards() {
    const cards = db.getAllGiftCards();
    allGiftCards = cards;
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cards.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1;">No gift cards found. Click "Create" to add some!</p>';
        return;
    }
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

// Buy card function
function buyCard(cardId) {
    showStatus('Thank you for your purchase! Your gift card code is displayed on the back of the card. Please delete the gift after purchasing the gift card');
}

// Delete card function
function deleteCard(cardId) {
    if (confirm('Are you sure you want to delete this gift card?')) {
        const result = db.deleteGiftCard(cardId);
        if (result) {
            showStatus('Gift card deleted successfully!');
            displayGiftCards();
        } else {
            showStatus('Failed to delete gift card. Please try again.', true);
        }
    }
}

// Search functionality
function handleSearch(searchTerm) {
    if (searchTerm.trim() === '') {
        displayGiftCards();
        return;
    }
    
    const results = db.searchGiftCards(searchTerm);
    allGiftCards = results;
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1;">No gift cards found matching your search.</p>';
        return;
    }
    
    results.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

// Group cards by title
function groupCardsByTitle() {
    const groups = {};
    
    // Group cards by title
    allGiftCards.forEach(card => {
        if (!groups[card.title]) {
            groups[card.title] = [];
        }
        groups[card.title].push(card);
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Create grouped sections
    Object.keys(groups).sort().forEach(title => {
        // Create group header
        const groupHeader = document.createElement('div');
        groupHeader.style.cssText = `
            width: 100%;
            grid-column: 1 / -1;
            text-align: left;
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0 10px 0;
            padding: 10px;
            background: rgba(76, 175, 80, 0.1);
            border-left: 4px solid #4CAF50;
            border-radius: 4px;
        `;
        groupHeader.textContent = `${title} (${groups[title].length} cards)`;
        container.appendChild(groupHeader);
        
        // Add cards in this group
        groups[title].forEach(card => {
            const cardElement = createCardElement(card);
            container.appendChild(cardElement);
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    db = new GiftCardDB();
    
    container = document.getElementById('gift-cards-container');
    
    if (!container) return; // Exit if not on the main page
    
    // Generate sample cards if database is empty
    generateSampleCards();
    
    // Display gift cards
    displayGiftCards();
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = "Search gift cards by title...";
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            handleSearch(searchTerm);
        });
    }
    
    // Add group toggle button
    const groupButton = document.createElement('button');
    groupButton.textContent = 'Group by Title';
    groupButton.style.cssText = `
        margin: 10px;
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    `;
    groupButton.addEventListener('click', groupCardsByTitle);
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.style.cssText = `
        margin: 10px;
        padding: 10px 20px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    `;
    resetButton.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        displayGiftCards();
    });
    
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Sample Cards';
    generateButton.style.cssText = `
        margin: 10px;
        padding: 10px 20px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    `;
    generateButton.addEventListener('click', function() {
        generateSampleCards();
        displayGiftCards();
    });
    
    // Insert buttons before the container
    if (container && container.parentNode) {
        container.parentNode.insertBefore(groupButton, container);
        container.parentNode.insertBefore(resetButton, container);
        container.parentNode.insertBefore(generateButton, container);
    }
    
    // Show initial status
    showStatus('Gift Card Database loaded successfully!');
});