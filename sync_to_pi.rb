#!/usr/bin/env ruby
# frozen_string_literal: true
#
# sync_to_pi.rb
#
# Syncs ALL scraped UK planning applications to PlanningIndex.
# (The scraper itself already filters what is worth keeping — nothing is
# filtered here.) Rows are upserted idempotently on council_reference, so
# re-running the sync is safe.
#
# Usage:
#   PI_SYNC_KEY="your-secret-key" \
#     PI_SITE_URL="https://your-planningindex-url" \
#     ruby sync_to_pi.rb --db data/apps.db --batch 500
#
# Options:
#   --db PATH           Path to the scraper's SQLite apps.db (default data/apps.db)
#   --batch N           Batch size (default 500, max 1000 per request)
#   --dry-run [bool]    Dry run (default false)
#   --site URL          PlanningIndex site URL (or PI_SITE_URL env var)
#   --endpoint PATH     Ingest endpoint path (default /api/ingest/planning-apps)

require 'sqlite3'
require 'net/http'
require 'json'
require 'uri'
require 'optparse'
require 'logger'

options = {
  db: File.join(__dir__, 'data', 'apps.db'),
  batch: 500,
  dry_run: false,
  site: ENV['PI_SITE_URL'] || 'http://localhost:3000',
  endpoint_path: '/api/ingest/planning-apps',
  timeout: 60,
}

OptionParser.new do |o|
  o.banner = 'Usage: sync_to_pi.rb [options]'
  o.on('--db PATH', 'Path to the scraper SQLite apps.db') { |v| options[:db] = v }
  o.on('--batch N', Integer, 'Batch size (default 500, max 1000)') { |v| options[:batch] = v }
  o.on('--dry-run [boolean]', 'Dry run (no data sent)') { |v| options[:dry_run] = v != 'false' && v != false }
  o.on('--site URL', 'PlanningIndex site URL') { |v| options[:site] = v }
  o.on('--endpoint PATH', 'Ingest endpoint path') { |v| options[:endpoint_path] = v }
end.parse!

options[:batch] = 1000 if options[:batch] > 1000

logger = Logger.new($stdout)
logger.level = Logger::INFO

pi_key = ENV['PI_SYNC_KEY']
if pi_key.nil? || pi_key.empty?
  logger.fatal 'Missing PI_SYNC_KEY environment variable. Set it to the same value configured on PlanningIndex.'
  exit 1
end

bearer_auth = "Bearer #{pi_key}"

# ------------------------------------------------------------
# READ FROM DATABASE
# ------------------------------------------------------------

unless File.file?(options[:db])
  logger.fatal "Database not found: #{options[:db]}"
  exit 1
end

db = SQLite3::Database.new(options[:db], results_as_hash: true)
rows = db.execute('SELECT * FROM apps_to_sync;') rescue db.execute('SELECT * FROM apps;')
logger.info "Fetched #{rows.size} rows from #{options[:db]}"

# ------------------------------------------------------------
# TRANSFORM TO PAYLOAD
# ------------------------------------------------------------

payloads = rows.map do |r|
  {
    authority_name: r['authority_name'],
    council_reference: r['council_reference'],
    info_url: r['info_url'],
    date_received: r['date_received'],
    date_validated: r['date_validated'],
    status: r['status'],
    decision: r['decision'],
    documents_url: r['documents_url'],
    address: r['address'],
    description: r['description'],
  }
end

logger.info "Prepared #{payloads.size} applications (unfiltered — the scraper filters at source)"

if options[:dry_run]
  logger.info "Dry run enabled — would send #{payloads.size} items in batches of #{options[:batch]} to #{options[:site]}#{options[:endpoint_path]}"
  payloads.first(20).each do |p|
    puts "  #{p[:council_reference]}: #{p[:description].to_s[0..80]}"
  end
  exit 0
end

# ------------------------------------------------------------
# SEND TO PLANNINGINDEX
# ------------------------------------------------------------

uri = URI.join(options[:site], options[:endpoint_path])

payloads.each_slice(options[:batch]).with_index(1) do |batch, idx|
  body = { apps: batch }.to_json
  tries = 0
  begin
    tries += 1
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'
    http.read_timeout = options[:timeout]
    req = Net::HTTP::Post.new(uri.request_uri, {
      'Content-Type' => 'application/json',
      'Authorization' => bearer_auth,
    })
    req.body = body

    logger.info "Sending batch #{idx} (#{batch.size} items) to #{uri} (attempt #{tries})"
    resp = http.request(req)

    if resp.code.to_i >= 200 && resp.code.to_i < 300
      j = JSON.parse(resp.body) rescue {}
      errors = j['errors'] || []
      logger.info "Batch #{idx} success: processed=#{j['processed'] || 'unknown'} errors=#{errors.size}"
      errors.first(5).each { |e| logger.warn "  #{e['council_reference']}: #{e['error']}" }
    elsif resp.code.to_i == 401
      logger.fatal 'Unauthorized — PI_SYNC_KEY does not match the value configured on PlanningIndex.'
      exit 1
    else
      logger.warn "Batch #{idx} HTTP #{resp.code}: #{resp.body.to_s[0..200]}"
      raise "HTTP #{resp.code}"
    end
  rescue => e
    if tries < 5
      sleep_time = 2**tries
      logger.warn "Batch #{idx} failed (#{e.class} - #{e}). Retrying in #{sleep_time}s..."
      sleep sleep_time
      retry
    else
      logger.error "Batch #{idx} permanently failed after #{tries} tries: #{e.class} - #{e}"
    end
  end
end

logger.info "Sync complete. Sent #{payloads.size} planning applications to PlanningIndex."
