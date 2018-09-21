const host = process.env.DB_HOST || 'localhost';

export default {
  server: {
    port: 9000,
    bodyLimit: "100kb"
  },
  database: {
    url: `mongodb://${host}/blog-api`,
    properties: {
      useMongoClient: true
    }
  },

  key: {
    tokenExpireInMinutes: 1440
  }
}