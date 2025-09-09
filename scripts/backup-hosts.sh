a little l o#!/bin/bash

# Backup hosts file script
# This script creates a backup of the hosts file before any modifications

HOSTS_FILE="/etc/hosts"
BACKUP_DIR="$HOME/hosts-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/hosts.backup.$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup of hosts file..."
sudo cp "$HOSTS_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    echo "📁 Backup location: $BACKUP_DIR"
    
    # List recent backups
    echo ""
    echo "Recent backups:"
    ls -la "$BACKUP_DIR" | tail -5
else
    echo "❌ Failed to create backup"
    exit 1
fi
