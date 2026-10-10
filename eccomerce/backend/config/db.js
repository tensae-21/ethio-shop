// backend/config/db.js
const mongoose = require('mongoose');

const removeObsoleteContactIndex = async () => {
  const database = mongoose.connection.db;
  const usersCollectionExists = await database
    .listCollections({ name: 'users' }, { nameOnly: true })
    .hasNext();

  if (!usersCollectionExists) return;

  const users = database.collection('users');
  const indexes = await users.indexes();
  const obsoleteIndex = indexes.find((index) =>
    index.name === 'contact_1' &&
    index.unique === true &&
    Object.keys(index.key).length === 1 &&
    index.key.contact === 1
  );

  if (obsoleteIndex) {
    await users.dropIndex(obsoleteIndex.name);
    console.log('Removed obsolete unique users.contact index; existing user records were preserved.');
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await removeObsoleteContactIndex();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;