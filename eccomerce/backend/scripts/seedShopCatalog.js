require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const catalog = require('../../frontend/src/data/shopCatalog.json');

async function seedShopCatalog() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db');

  try {
    let inserted = 0;

    for (const [category, details] of Object.entries(catalog)) {
      for (const item of details.images) {
        const result = await Product.updateOne(
          { category, imageUrl: item.path },
          {
            $setOnInsert: {
              name: item.name,
              description: `${details.title}: ${item.name}`,
              price: item.price,
              category,
              stock: null,
              imageUrl: item.path,
              rating: item.rating,
            },
          },
          { upsert: true },
        );
        inserted += result.upsertedCount;
      }
    }

    console.log(`Shop catalog seeding complete. Added ${inserted} products; existing products were preserved.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedShopCatalog().catch((error) => {
  console.error('Could not seed the shop catalog:', error.message);
  process.exitCode = 1;
});
