const allowedOrigins = [
    
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3002',
    'http://localhost:3001',
    'https://dressing-shop.vercel.app',
    'https://dressing-shop-admin.vercel.app'

     
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, HTTP authentication)
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

module.exports = corsOptions;