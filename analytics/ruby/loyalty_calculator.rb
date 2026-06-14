# Ruby CRM Loyalty Points & Member Tier Calculator for Smile POS
require 'json'
require 'date'

class LoyaltyCalculator
  def initialize(members_filepath, transactions_filepath)
    @members_filepath = members_filepath
    @transactions_filepath = transactions_filepath
  end

  def recalculate_member_tiers
    puts "[Ruby CRM] Recalculating member tiers and loyalty point margins..."
    return unless File.exist?(@members_filepath) && File.exist?(@transactions_filepath)

    members = JSON.parse(File.read(@members_filepath))
    transactions = JSON.parse(File.read(@transactions_filepath))

    # Calculate total sales volume per member
    member_spending = Hash.new(0.0)
    transactions.each do |tx|
      if tx['member_name'] && !tx['deleted']
        member_spending[tx['member_name']] += tx['total'].to_f
      end
    end

    # Update member tiers based on spending ranges
    members.each do |m|
      name = m['name']
      spending = member_spending[name]
      old_tier = m['tier'] || 'Bronze'

      new_tier = if spending >= 2_000_000
                   'Gold'
                 elsif spending >= 750_000
                   'Silver'
                 else
                   'Bronze'
                 end

      if old_tier != new_tier
        puts "[Ruby CRM] Member #{name} upgraded: #{old_tier} -> #{new_tier} (Total spending: Rp #{spending})"
        m['tier'] = new_tier
      end

      # Award cashback points: 1 point for every Rp 10.000 spent
      calculated_points = (spending / 10_000).to_i
      m['points'] = calculated_points
    end

    # Save updated members database
    File.open(@members_filepath, 'w') do |f|
      f.write(JSON.pretty_generate(members))
    end
    puts "[Ruby CRM] Tier calculations completed successfully."
  end
end

if __FILE__ == $0
  calculator = LoyaltyCalculator.new('./members.json', './transactions.json')
  calculator.recalculate_member_tiers
end
