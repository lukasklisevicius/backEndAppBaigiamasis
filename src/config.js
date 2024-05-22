module.exports = {
    APP_PORT: parseInt(process.env.PORT) || 8080,

    STRIPE_PUBLISHABLE_KEY: 'pk_test_51PIHtxEplgX5jlCdw8WbNGfIrLsrsvuVRiwiO6wDeOz2z33XVM1593Y9CCMDfrvPBzKsxcYxRhn6Pu3faDkWliby00XOWmzJRO',
    STRIPE_SECRET_KEY: 'sk_test_51PIHtxEplgX5jlCdvN5mwHDE71Pj1Vj8sBGIwhJRADWm4usewdvjmBw0irTUQh8lK5hdBpemtK2GySpkLyhiqfjZ00n7zIEKMU',
    STRIPE_WEBHOOK_ENDPOINT_SECRET: "whsec_b110ae82bd84f3e62250606788b8a0c77eed5d4483119ac72cc811a578a0730f",

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'gifterssms'
};