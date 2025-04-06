# Database Backup and Restore

This document explains how to use the database backup and restore functionality in the MCQ Test Management System.

## Overview

The backup system provides tools to:
- Create database backups
- Restore from backups
- List available backups

## Prerequisites

- MongoDB tools installed (`mongodump` and `mongorestore`)
- Proper MongoDB connection string in `.env` file
- Sufficient disk space for backups

## Commands

### Create a Backup

To create a new database backup:

```bash
npm run db:backup
```

This will:
1. Create a backup in the `backups` directory
2. Name the backup with a timestamp (e.g., `backup_2024-03-15T12-00-00-000Z`)
3. Include all collections and their data

### Restore from Backup

To restore from a specific backup:

```bash
npm run db:restore <backup-name>
```

Example:
```bash
npm run db:restore backup_2024-03-15T12-00-00-000Z
```

### List Backups

To view all available backups:

```bash
npm run db:list
```

This will show:
- Backup names
- File sizes
- Creation timestamps

## Backup Location

Backups are stored in the `backups` directory at the root of the project. Each backup is a directory containing:
- BSON files for each collection
- Metadata files

## Best Practices

1. **Regular Backups**
   - Create backups before major changes
   - Schedule regular backups
   - Keep multiple backup versions

2. **Backup Management**
   - Monitor backup sizes
   - Clean up old backups
   - Verify backup integrity

3. **Restore Process**
   - Always verify the backup exists
   - Check available disk space
   - Consider stopping the application during restore

## Example Workflow

1. **Creating a Backup**
   ```bash
   # Create a backup
   npm run db:backup
   
   # Verify the backup was created
   npm run db:list
   ```

2. **Restoring from Backup**
   ```bash
   # List available backups
   npm run db:list
   
   # Restore from a specific backup
   npm run db:restore backup_2024-03-15T12-00-00-000Z
   ```

## Troubleshooting

### Common Issues

1. **Backup Failed**
   - Check MongoDB connection
   - Verify disk space
   - Ensure proper permissions

2. **Restore Failed**
   - Verify backup exists
   - Check MongoDB connection
   - Ensure sufficient disk space

3. **Missing MongoDB Tools**
   - Install MongoDB tools
   - Add to system PATH
   - Verify installation

### Getting Help

If you encounter issues:
1. Check error messages
2. Verify MongoDB connection
3. Consult the team
4. Create an issue in the repository

## Security Considerations

1. **Backup Security**
   - Store backups in secure location
   - Encrypt sensitive data
   - Control access to backups

2. **Restore Security**
   - Verify backup source
   - Check for data integrity
   - Monitor restore process

## Automation

Consider automating backups using cron jobs or scheduled tasks:

```bash
# Example cron job (daily backup at 2 AM)
0 2 * * * cd /path/to/project && npm run db:backup
```

## Maintenance

Regular maintenance tasks:
1. Monitor backup sizes
2. Clean up old backups
3. Verify backup integrity
4. Update backup procedures 