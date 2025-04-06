# Database Migrations

This document explains how to use the database migration system in the MCQ Test Management System.

## Overview

The migration system helps manage database schema changes over time. It provides a way to:
- Create new migrations
- Apply migrations to update the database
- Roll back migrations if needed

## Migration Commands

### Create a New Migration

To create a new migration file:

```bash
npm run migrate:create <migration-name>
```

This will create a new file in the `migrations` directory with a timestamp prefix and the provided name. For example:

```bash
npm run migrate:create add_user_preferences
```

Creates: `migrations/20240315000000_add_user_preferences.js`

### Apply Migrations

To apply all pending migrations:

```bash
npm run migrate:up
```

### Roll Back Migrations

To roll back all migrations:

```bash
npm run migrate:down
```

## Migration File Structure

Each migration file should export an object with two methods:

```javascript
module.exports = {
  async up() {
    // Code to apply the migration
  },

  async down() {
    // Code to roll back the migration
  }
};
```

## Best Practices

1. **One Change Per Migration**
   - Each migration should make one logical change
   - This makes it easier to roll back specific changes

2. **Idempotent Operations**
   - Migrations should be idempotent (can be run multiple times safely)
   - Use `updateMany` with appropriate conditions

3. **Include Down Migration**
   - Always implement the `down` method
   - This allows rolling back changes if needed

4. **Test Migrations**
   - Test both `up` and `down` migrations
   - Verify data integrity after migrations

## Example Migration

Here's an example migration that adds user preferences:

```javascript
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
```

## Common Operations

### Adding a Field

```javascript
async up() {
  await mongoose.connection.collection('collection').updateMany(
    {},
    { $set: { newField: defaultValue } }
  );
}

async down() {
  await mongoose.connection.collection('collection').updateMany(
    {},
    { $unset: { newField: '' } }
  );
}
```

### Creating an Index

```javascript
async up() {
  await mongoose.connection.collection('collection').createIndex({ field: 1 });
}

async down() {
  await mongoose.connection.collection('collection').dropIndex('field_1');
}
```

### Modifying Data

```javascript
async up() {
  await mongoose.connection.collection('collection').updateMany(
    { condition: value },
    { $set: { field: newValue } }
  );
}

async down() {
  await mongoose.connection.collection('collection').updateMany(
    { condition: value },
    { $set: { field: oldValue } }
  );
}
```

## Troubleshooting

### Common Issues

1. **Migration Failed**
   - Check the error message
   - Verify MongoDB connection
   - Ensure proper permissions

2. **Rollback Failed**
   - Check if the `down` method is properly implemented
   - Verify data consistency

3. **Duplicate Migrations**
   - Ensure migration files have unique timestamps
   - Check for duplicate migration names

### Getting Help

If you encounter issues:
1. Check the error logs
2. Review the migration file
3. Consult the team
4. Create an issue in the repository 