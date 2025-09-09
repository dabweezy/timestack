#!/bin/bash

# Restore hosts file script
# This script restores the hosts file from a backup

BACKUP_DIR="$HOME/hosts-backups"

# Function to show available backups
show_backups() {
    echo "Available backups:"
    ls -la "$BACKUP_DIR" | grep "hosts.backup" | nl
}

# Function to restore from backup
restore_from_backup() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        echo "❌ Backup file not found: $backup_file"
        exit 1
    fi
    
    echo "Restoring hosts file from: $backup_file"
    sudo cp "$backup_file" /etc/hosts
    
    if [ $? -eq 0 ]; then
        echo "✅ Hosts file restored successfully"
        echo "Current hosts file:"
        cat /etc/hosts
    else
        echo "❌ Failed to restore hosts file"
        exit 1
    fi
}

# Main script
if [ $# -eq 0 ]; then
    echo "Usage: $0 [backup_number|backup_file]"
    echo ""
    show_backups
    echo ""
    echo "Example: $0 1 (to restore the first backup)"
    echo "Example: $0 hosts.backup.20250909_213904 (to restore specific backup)"
    exit 1
fi

# Check if argument is a number (backup index)
if [[ "$1" =~ ^[0-9]+$ ]]; then
    backup_file=$(ls -t "$BACKUP_DIR"/hosts.backup.* | sed -n "${1}p")
    if [ -z "$backup_file" ]; then
        echo "❌ No backup found at index $1"
        show_backups
        exit 1
    fi
    restore_from_backup "$backup_file"
else
    # Treat as filename
    if [[ "$1" == *"/"* ]]; then
        # Full path provided
        restore_from_backup "$1"
    else
        # Just filename, look in backup directory
        restore_from_backup "$BACKUP_DIR/$1"
    fi
fi
