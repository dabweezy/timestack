# Hosts File Management

## Problem
The system hosts file (`/etc/hosts`) was getting corrupted when using Claude in the terminal, causing localhost to stop working properly.

## Solution
This directory contains scripts to backup and restore your hosts file to prevent future issues.

## Files
- `backup-hosts.sh` - Creates a backup of the current hosts file
- `restore-hosts.sh` - Restores the hosts file from a backup
- `README-hosts.md` - This documentation file

## Usage

### Create a Backup
```bash
./scripts/backup-hosts.sh
```

### Restore from Backup
```bash
# List available backups and restore by number
./scripts/restore-hosts.sh

# Restore specific backup by number
./scripts/restore-hosts.sh 1

# Restore specific backup by filename
./scripts/restore-hosts.sh hosts.backup.20250909_214003
```

## Prevention Tips

1. **Always backup before making changes**: Run `./scripts/backup-hosts.sh` before any terminal operations that might modify system files.

2. **Check hosts file regularly**: If localhost stops working, check your hosts file:
   ```bash
   cat /etc/hosts
   ```

3. **Quick restore**: If you notice issues, quickly restore from the most recent backup:
   ```bash
   ./scripts/restore-hosts.sh 1
   ```

4. **Monitor file permissions**: The hosts file should have these permissions:
   ```bash
   ls -la /etc/hosts
   # Should show: -rw-r--r--@ 1 root wheel
   ```

## Default Hosts File Content
The hosts file should contain:
```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
```

## Troubleshooting

### If localhost stops working:
1. Check the hosts file: `cat /etc/hosts`
2. If it looks corrupted, restore from backup: `./scripts/restore-hosts.sh 1`
3. If no backups exist, restore to default state:
   ```bash
   sudo tee /etc/hosts > /dev/null << 'EOF'
   ##
   # Host Database
   #
   # localhost is used to configure the loopback interface
   # when the system is booting.  Do not change this entry.
   ##
   127.0.0.1       localhost
   255.255.255.255 broadcasthost
   ::1             localhost
   EOF
   ```

### If you get permission errors:
```bash
sudo chmod 644 /etc/hosts
sudo chown root:wheel /etc/hosts
```

## Backup Location
Backups are stored in: `~/hosts-backups/`

Each backup is timestamped: `hosts.backup.YYYYMMDD_HHMMSS`
