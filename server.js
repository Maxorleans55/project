const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'giftcards.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Helper function to read data from JSON file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { giftCards: [], nextId: 1 };
    }
}

// Helper function to write data to JSON file
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// API Routes

// GET all gift cards
app.get('/api/giftcards', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.giftCards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gift cards' });
    }
});

// GET gift card by ID
app.get('/api/giftcards/:id', async (req, res) => {
    try {
        const data = await readData();
        const giftCard = data.giftCards.find(card => card.id === parseInt(req.params.id));
        
        if (!giftCard) {
            return res.status(404).json({ error: 'Gift card not found' });
        }
        
        res.json(giftCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gift card' });
    }
});

// POST create new gift card
app.post('/api/giftcards', async (req, res) => {
    try {
        const data = await readData();
        const { title, value, cardNumber, holder, expires, cvv, code } = req.body;
        
        const newGiftCard = {
            id: data.nextId,
            title,
            value,
            cardNumber,
            holder,
            expires,
            cvv,
            code,
            createdAt: new Date().toISOString()
        };
        
        data.giftCards.push(newGiftCard);
        data.nextId++;
        
        const success = await writeData(data);
        if (success) {
            res.status(201).json(newGiftCard);
        } else {
            res.status(500).json({ error: 'Failed to save gift card' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create gift card' });
    }
});

// PUT update gift card
app.put('/api/giftcards/:id', async (req, res) => {
    try {
        const data = await readData();
        const cardIndex = data.giftCards.findIndex(card => card.id === parseInt(req.params.id));
        
        if (cardIndex === -1) {
            return res.status(404).json({ error: 'Gift card not found' });
        }
        
        const { title, value, cardNumber, holder, expires, cvv, code } = req.body;
        
        data.giftCards[cardIndex] = {
            ...data.giftCards[cardIndex],
            title,
            value,
            cardNumber,
            holder,
            expires,
            cvv,
            code,
            updatedAt: new Date().toISOString()
        };
        
        const success = await writeData(data);
        if (success) {
            res.json(data.giftCards[cardIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update gift card' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update gift card' });
    }
});

// DELETE gift card
app.delete('/api/giftcards/:id', async (req, res) => {
    try {
        const data = await readData();
        const cardIndex = data.giftCards.findIndex(card => card.id === parseInt(req.params.id));
        
        if (cardIndex === -1) {
            return res.status(404).json({ error: 'Gift card not found' });
        }
        
        const deletedCard = data.giftCards.splice(cardIndex, 1)[0];
        
        const success = await writeData(data);
        if (success) {
            res.json({ message: 'Gift card deleted successfully', deletedCard });
        } else {
            res.status(500).json({ error: 'Failed to delete gift card' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete gift card' });
    }
});

// Search gift cards
app.get('/api/giftcards/search/:term', async (req, res) => {
    try {
        const data = await readData();
        const searchTerm = req.params.term.toLowerCase();
        
        const filteredCards = data.giftCards.filter(card =>
            card.title.toLowerCase().includes(searchTerm) ||
            card.code.toLowerCase().includes(searchTerm)
        );
        
        res.json(filteredCards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search gift cards' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'gift.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Gift Card Database API is ready!');
});