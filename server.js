const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Keep the bot alive
setInterval(() => {
    console.log('Pinging to keep the bot alive');
}, 5 * 60 * 1000); // Ping every 5 minutes  