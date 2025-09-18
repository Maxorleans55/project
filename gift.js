// API base URL
const API_BASE = 'http://localhost:3000/api';

// Global variables
let allGiftCards = [];
let container;

// API functions
async function fetchGiftCards() {
    try {
        const response = await fetch(`${API_BASE}/giftcards`);
        if (!response.ok) throw new Error('Failed to fetch gift cards');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gift cards:', error);
        return [];
    }
}

async function createGiftCard(giftCardData) {
    try {
        const response = await fetch(`${API_BASE}/giftcards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(giftCardData)
        });
        if (!response.ok) throw new Error('Failed to create gift card');
        return await response.json();
    } catch (error) {
        console.error('Error creating gift card:', error);
        return null;
    }
}

async function updateGiftCard(id, giftCardData) {
    try {
        const response = await fetch(`${API_BASE}/giftcards/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(giftCardData)
        });
        if (!response.ok) throw new Error('Failed to update gift card');
        return await response.json();
    } catch (error) {
        console.error('Error updating gift card:', error);
        return null;
    }
}

async function deleteGiftCard(id) {
    try {
        const response = await fetch(`${API_BASE}/giftcards/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete gift card');
        return await response.json();
    } catch (error) {
        console.error('Error deleting gift card:', error);
        return null;
    }
}

async function searchGiftCards(searchTerm) {
    try {
        const response = await fetch(`${API_BASE}/giftcards/search/${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Failed to search gift cards');
        return await response.json();
    } catch (error) {
        console.error('Error searching gift cards:', error);
        return [];
    }
}

// Function to add a new gift card (for create.html form)
async function addGift() {
    const name = document.getElementById('giftName').value;
    const description = document.getElementById('giftDescription').value;
    const price = document.getElementById('giftPrice').value;

    if (name && description && price) {
        const giftCardData = {
            title: name,
            value: parseInt(price),
            cardNumber: Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
            holder: "John Doe",
            expires: "12/25",
            cvv: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
            code: "GIFT-CARD-CODE-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        };

        const result = await createGiftCard(giftCardData);
        if (result) {
            alert(`Gift Added Successfully!\nName: ${name}\nDescription: ${description}\nPrice: $${price}\nCard ID: ${result.id}`);
            document.getElementById('giftName').value = '';
            document.getElementById('giftDescription').value = '';
            document.getElementById('giftPrice').value = '';
        } else {
            alert('Failed to add gift card. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to generate sample gift cards if database is empty
async function generateSampleCards() {
    const existingCards = await fetchGiftCards();
    if (existingCards.length > 0) {
        return; // Don't generate if cards already exist
    }

    const cardTitles = [
        "Netflix", "Apple-Music", "Spotify", "Apple-TV", "Snapchat+", "Hulu",
        "Disney-Plus", "YouTube-Premium", "Amazon-Prime", "Steam"
    ];
    
    const cardChips = [
        "netflix.png", "apple-music.jpg", "spotify.png", "appletv.jpg", "snapchat.png", "hulu.png",
        "disney-plus.jpg", "youtube-premium.png", "amazon.png", "steam.jpg"
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

        await createGiftCard(giftCardData);
    }
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
                <div class="value" style="font-size: 42px; font-weight: bold; margin: 15px 0; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">$${card.value}</div>
                <button class="buy" style="background-color: white; display:inline-block;color:blue; padding:4px; border-radius: 5px; border: none; cursor: pointer;" onclick="buyCard(${card.id})">Buy</button>
                <button class="delete-btn" style="background-color: #f44336; display:inline-block;color:white; padding:4px; border-radius: 5px; border: none; cursor: pointer; margin-left: 5px;" onclick="deleteCard(${card.id})">Delete</button>
                <div class="code" style="font-size: 18px; letter-spacing: 4px; background: rgba(255, 255, 255, 0.2); padding: 10px; border-radius: 8px; margin: 15px 0;">${card.code}</div>
                <div class="terms" style="font-size: 10px; opacity: 0.8; margin-top: 15px;">This gift card is subject to terms and conditions. Use constitutes acceptance.</div>
            </div>
        </div>
    `;
    
    return cardElement;
}

// Function to display gift cards
async function displayGiftCards() {
    const cards = await fetchGiftCards();
    allGiftCards = cards;
    
    if (!container) return;
    
    container.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

// Buy card function
async function buyCard(cardId) {
    alert('Thank you for your purchase! Your gift card code is displayed on the back of the card.');
}

// Delete card function
async function deleteCard(cardId) {
    if (confirm('Are you sure you want to delete this gift card?')) {
        const result = await deleteGiftCard(cardId);
        if (result) {
            alert('Gift card deleted successfully!');
            await displayGiftCards(); // Refresh the display
        } else {
            alert('Failed to delete gift card. Please try again.');
        }
    }
}

// Search functionality
async function handleSearch(searchTerm) {
    if (searchTerm.trim() === '') {
        await displayGiftCards();
        return;
    }
    
    const results = await searchGiftCards(searchTerm);
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
document.addEventListener('DOMContentLoaded', async function() {
    container = document.getElementById('gift-cards-container');
    
    if (!container) return; // Exit if not on the main page
    
    // Generate sample cards if database is empty
    await generateSampleCards();
    
    // Display gift cards
    await displayGiftCards();
    
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
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
    resetButton.addEventListener('click', async function() {
        if (searchInput) searchInput.value = '';
        await displayGiftCards();
    });
    
    // Insert buttons before the container
    if (container && container.parentNode) {
        container.parentNode.insertBefore(groupButton, container);
        container.parentNode.insertBefore(resetButton, container);
    }
});
