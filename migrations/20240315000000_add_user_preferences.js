const mongoose = require('mongoose');

module.exports = {
  async up() {
    // Add preferences field to User model
    await mongoose.connection.collection('users').updateMany(
      {},
      {
        $set: {
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          }
        }
      }
    );

    // Add index for faster queries
    await mongoose.connection.collection('users').createIndex({ 'preferences.theme': 1 });
  },

  async down() {
    // Remove preferences field from User model
    await mongoose.connection.collection('users').updateMany(
      {},
      {
        $unset: {
          preferences: ''
        }
      }
    );

    // Remove the index
    await mongoose.connection.collection('users').dropIndex('preferences.theme_1');
  }
}; 