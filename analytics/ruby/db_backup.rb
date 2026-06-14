# Ruby Database backup utility worker for Smile POS
require 'fileutils'
require 'date'
require 'json'

class DatabaseBackup
  def initialize(db_filepath, backup_dir)
    @db_filepath = db_filepath
    @backup_dir = backup_dir
  end

  def perform_backup
    puts "[Ruby Backup] Initializing database export process..."
    unless File.exist?(@db_filepath)
      puts "[Ruby Backup] ERROR: Source database file #{@db_filepath} not found."
      return false
    end

    # Create backup directory if it doesn't exist
    FileUtils.mkdir_p(@backup_dir)

    timestamp = DateTime.now.strftime('%Y%m%d_%H%M%S')
    backup_filename = "smile_pos_backup_#{timestamp}.json"
    backup_path = File.join(@backup_dir, backup_filename)

    begin
      # Read database file content
      db_content = File.read(@db_filepath)
      parsed_data = JSON.parse(db_content)

      # Write pretty formatted JSON to the backup path
      File.open(backup_path, 'w') do |f|
        f.write(JSON.pretty_generate(parsed_data))
      end

      puts "[Ruby Backup] SUCCESS: Database backup successfully created at: #{backup_path}"
      cleanup_old_backups(7) # Keep backups for 7 days
      true
    rescue => e
      puts "[Ruby Backup] CRITICAL ERROR: Backup failed -> #{e.message}"
      false
    end
  end

  private

  def cleanup_old_backups(days_to_keep)
    puts "[Ruby Backup] Scanning old logs for cleanup (Retention policy: #{days_to_keep} days)..."
    cutoff_date = Date.today - days_to_keep

    Dir.glob(File.join(@backup_dir, 'smile_pos_backup_*.json')).each do |file|
      filename = File.basename(file)
      # Extract date portion from filename (smile_pos_backup_YYYYMMDD_HHMMSS.json)
      date_str = filename.split('_')[3]
      file_date = Date.parse(date_str) rescue nil

      if file_date && file_date < cutoff_date
        puts "[Ruby Backup] Removing expired backup file: #{filename}"
        File.delete(file)
      end
    end
  end
end

if __FILE__ == $0
  backup_worker = DatabaseBackup.new('./smile_pos_db.json', './backups')
  backup_worker.perform_backup
end
