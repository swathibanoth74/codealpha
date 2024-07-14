// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files (like HTML, CSS, images)

// Endpoint to handle adding products to the cart (dummy endpoint for demonstration)
app.post('/api/cart/add', (req, res) => {
    // Handle adding product to cart logic here (not implemented in this example)
    res.json({ message: 'Product added to cart!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
