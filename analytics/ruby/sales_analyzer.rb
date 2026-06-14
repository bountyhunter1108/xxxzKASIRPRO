# Ruby Script to perform background sales and stock analysis for Smile POS
require 'json'
require 'date'

class SalesAnalyzer
  attr_reader :db_path

  def initialize(db_path)
    @db_path = db_path
  end

  def read_db
    return {} unless File.exist?(@db_path)
    begin
      JSON.parse(File.read(@db_path))
    rescue
      {}
    end
  end

  def run_analysis
    db = read_db
    transactions = db['transactions'] || []
    products = db['products'] || []

    puts "=================================================="
    puts "      SMILE POS SALES & INVENTORY REPORT"
    puts "=================================================="
    puts "Tanggal Analisis : #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
    puts "--------------------------------------------------"

    # 1. Total Turnover & Profit
    total_revenue = 0
    total_profit = 0
    today_str = Date.today.to_s # 'YYYY-MM-DD'
    today_transactions = 0

    transactions.each do |tx|
      next if tx['deleted'] == true
      
      tx_date = Date.parse(tx['date'] || tx['timestamp']).to_s rescue nil
      if tx_date == today_str
        total_revenue += (tx['total'] || 0)
        total_profit += (tx['profit'] || 0)
        today_transactions += 1
      end
    end

    puts "A. Analisis Keuangan Hari Ini:"
    puts "   - Total Transaksi : #{today_transactions} kali"
    puts "   - Omset Kotor     : Rp #{format_rupiah(total_revenue)}"
    puts "   - Estimasi Laba   : Rp #{format_rupiah(total_profit)}"
    puts "--------------------------------------------------"

    # 2. Low Stock Alerts
    low_stock_items = products.select do |p|
      p['active'] != false && (p['stock'] || 0) <= (p['minStock'] || 5)
    end

    puts "B. Peringatan Stok Kritis (<= minimum):"
    if low_stock_items.empty?
      puts "   - [OK] Semua stok produk dalam kondisi aman."
    else
      low_stock_items.each do |p|
        puts "   - [KRITIS] #{p['name']}: Sisa #{p['stock']} unit (Min: #{p['minStock'] || 5})"
      end
    end
    puts "--------------------------------------------------"

    # 3. Best Seller Products
    product_sales = Hash.new(0)
    transactions.each do |tx|
      next if tx['deleted'] == true
      (tx['items'] || []).each do |item|
        product_sales[item['name']] += (item['quantity'] || item['qty'] || 0)
      end
    end

    sorted_sales = product_sales.sort_by { |_name, qty| -qty }.first(5)

    puts "C. 5 Produk Terlaris (All-Time Best Sellers):"
    if sorted_sales.empty?
      puts "   - Belum ada penjualan tercatat."
    else
      sorted_sales.each_with_index do |(name, qty), idx|
        puts "   #{idx + 1}. #{name} - Terjual #{qty} unit"
      end
    end
    puts "=================================================="
  end

  private

  def format_rupiah(amount)
    amount.to_i.to_s.gsub(/(\d)(?=(\d\d\d)+(?!\d))/, '\\1.')
  end
end

# Executing the analyzer targeting the local browser DB export
db_file = "e:/project harian/db_backup.json"
# Write a dummy mock database if it doesn't exist for test run
unless File.exist?(db_file)
  dummy_db = {
    "products" => [
      { "id" => "p1", "sku" => "P001", "name" => "Es Kopi Latte", "stock" => 2, "minStock" => 5, "active" => true },
      { "id" => "p2", "sku" => "P002", "name" => "Nasi Goreng Gila", "stock" => 15, "minStock" => 5, "active" => true }
    ],
    "transactions" => [
      { "id" => "tx1", "date" => Time.now.to_s, "total" => 150000, "profit" => 65000, "items" => [
        { "name" => "Es Kopi Latte", "quantity" => 2 },
        { "name" => "Nasi Goreng Gila", "quantity" => 1 }
      ]}
    ]
  }
  File.write(db_file, JSON.pretty_generate(dummy_db))
end

analyzer = SalesAnalyzer.new(db_file)
analyzer.run_analysis
