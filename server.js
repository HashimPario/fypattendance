const express = require('express');
const app = express();
const path = require('path');
// Replace with your actual allowed IP(s)
const allowedIPs = ['119.73.104.122'];

app.use(express.json());

// IP Restriction Middleware
function ipFilter(req, res, next) {
    console.log("req", req)
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor 
        ? forwardedFor.split(',')[0].trim() 
        : req.connection.remoteAddress || req.socket.remoteAddress;

    console.log(`Detected IP: ${ip}`);

    if (allowedIPs.includes(ip)) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Unauthorized IP' });
    }
}

// ✅ Catch-all for SPA — also IP restricted
app.get('/', ipFilter, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
