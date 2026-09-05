-- QuickBasket seed data
-- Run AFTER schema.sql
-- Prices in Turkish Lira (TRY)

INSERT INTO categories (name) VALUES
('Personal Care'),
('Beverages'),
('Fruits & Veggies'),
('Meat, Poultry & Fish'),
('Snacks'),
('Milk & Dairy'),
('Ice Cream'),
('Breakfast'),
('Food'),
('Ready To Eat'),
('Baked Goods'),
('Fit & Form'),
('Home Care'),
('Pet Food'),
('Baby Care');

-- Personal Care
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Elseve Glyconic Gloss Shampoo', 200.99, 60, 'Elseve Glyconic Gloss Shine-Enhancing Care Shampoo 300 ml'),
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Nivea Sun 50+ Factor', 743.99, 100, 'Nivea Sun Kids Protect and Sensitive Sun Spray. Provides reliable protection with its caring and special formula.'),
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Loreal Paris Excellence Creme Hair Dye - 5.15 Legend Turkish Coffee', 423.99, 50, 'Hair dye legend'),
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Gilette Sensor 3+ Comfort', 240.00, 100, 'Gilette Sensor3+ Comfort 4 Blade Shaver with Replacement Blade Head'),
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Orkid Ultra Extra Quad Pack Long Extra', 115.99, 300, '16 pieces. Dont settle for less for up to 8 hours of protection with Orkid Ultra Day Long Extra (Size 3) winged sanitary pads'),
((SELECT id FROM categories WHERE name = 'Personal Care'), 'Colgate Total Advanced Whitening', 100.00, 100, 'Colgate Toothpaste Total Advanced Whitening 150g');

-- Beverages
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Beverages'), 'Coca Cola 1.5L', 150.00, 200, 'Coca Cola 1.5L'),
((SELECT id FROM categories WHERE name = 'Beverages'), 'Pepsi 1.5L', 140.00, 200, 'Pepsi 1.5L'),
((SELECT id FROM categories WHERE name = 'Beverages'), 'Sprite 1.5L', 130.00, 200, 'Sprite 1.5L'),
((SELECT id FROM categories WHERE name = 'Beverages'), 'Fanta 1.5L', 120.00, 0, 'Fanta 1.5L'),
((SELECT id FROM categories WHERE name = 'Beverages'), 'Ayran 1L', 45.00, 150, 'Traditional Turkish yogurt drink 1L'),
((SELECT id FROM categories WHERE name = 'Beverages'), 'Cappy Orange Juice 1L', 95.00, 120, 'Cappy 100% orange juice with no added sugar 1L');

-- Fruits & Veggies
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Banana', 50.00, 100, 'Fresh bananas, sold per kg'),
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Apple', 100.00, 100, 'Fresh apples, sold per kg'),
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Orange', 80.00, 100, 'Fresh oranges, sold per kg'),
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Tomato', 60.00, 100, 'Fresh tomatoes, sold per kg'),
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Potato', 40.00, 100, 'Fresh potatoes, sold per kg'),
((SELECT id FROM categories WHERE name = 'Fruits & Veggies'), 'Cucumber', 55.00, 80, 'Fresh cucumbers, sold per kg');

-- Meat, Poultry & Fish
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Chicken Breast', 500.00, 50, 'Fresh chicken breast, 1kg'),
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Salmon Fillet', 800.00, 30, 'Fresh salmon fillet, 500g'),
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Beef Steak', 700.00, 40, 'Fresh beef steak, 500g'),
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Ground Beef', 600.00, 35, 'Fresh ground beef, 500g'),
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Shrimp', 900.00, 0, 'Fresh shrimp, 500g'),
((SELECT id FROM categories WHERE name = 'Meat, Poultry & Fish'), 'Sucuk', 320.00, 60, 'Traditional Turkish spiced beef sausage 250g');

-- Snacks
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Snacks'), 'Lays Classic Potato Chips', 150.00, 100, 'Lays Classic Potato Chips 200g'),
((SELECT id FROM categories WHERE name = 'Snacks'), 'Doritos Nacho Cheese', 180.00, 100, 'Doritos Nacho Cheese Flavored Tortilla Chips 200g'),
((SELECT id FROM categories WHERE name = 'Snacks'), 'Cheetos Crunchy', 160.00, 100, 'Cheetos Crunchy Cheese Flavored Snacks 200g'),
((SELECT id FROM categories WHERE name = 'Snacks'), 'Pringles Original', 200.00, 100, 'Pringles Original Potato Crisps 200g'),
((SELECT id FROM categories WHERE name = 'Snacks'), 'Ruffles Cheddar & Sour Cream', 190.00, 100, 'Ruffles Cheddar & Sour Cream Flavored Potato Chips 200g'),
((SELECT id FROM categories WHERE name = 'Snacks'), 'Ülker Çikolatalı Gofret', 45.00, 200, 'Ülker chocolate coated wafer bar 36g');

-- Milk & Dairy
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Sütaş Whole Milk 1L', 85.00, 150, 'Sütaş full fat pasteurised milk 1L'),
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Pınar Butter 500g', 250.00, 100, 'Pınar unsalted butter 500g'),
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Pınar Cheddar Slices', 300.00, 100, 'Pınar cheddar cheese slices 200g'),
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Sütaş Yogurt 1kg', 130.00, 120, 'Sütaş plain set yogurt 1kg'),
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Beyaz Peynir 500g', 280.00, 90, 'Traditional Turkish white cheese 500g'),
((SELECT id FROM categories WHERE name = 'Milk & Dairy'), 'Pınar Fresh Cream 200ml', 120.00, 100, 'Pınar fresh cooking cream 200ml');

-- Ice Cream
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Cornetto Classic', 100.00, 100, 'Cornetto classic vanilla cone 120ml'),
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Algida Maxibon', 145.00, 100, 'Algida Maxibon cookie sandwich ice cream 100ml'),
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Haagen-Dazs Vanilla', 300.00, 50, 'Haagen-Dazs vanilla ice cream tub 500ml'),
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Ben & Jerry''s Cookie Dough', 350.00, 40, 'Ben & Jerry''s cookie dough ice cream tub 465ml'),
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Magnum Almond', 150.00, 100, 'Magnum almond ice cream bar 110ml'),
((SELECT id FROM categories WHERE name = 'Ice Cream'), 'Dondurma Sade 1L', 220.00, 60, 'Traditional Turkish plain ice cream tub 1L');

-- Breakfast
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Kellogg''s Corn Flakes', 200.00, 100, 'Kellogg''s Corn Flakes 500g'),
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Quaker Oats', 250.00, 100, 'Quaker rolled oats 500g'),
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Nesquik Cereal', 300.00, 100, 'Nestle Nesquik chocolate cereal 375g'),
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Balparmak Honey 460g', 480.00, 80, 'Balparmak blossom honey jar 460g'),
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Sarelle Hazelnut Spread', 185.00, 120, 'Sarelle cocoa hazelnut spread 350g'),
((SELECT id FROM categories WHERE name = 'Breakfast'), 'Siyah Zeytin 400g', 210.00, 90, 'Turkish black olives in brine 400g');

-- Food
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Food'), 'Knorr Instant Soup', 100.00, 200, 'Knorr instant soup, assorted flavours 60g'),
((SELECT id FROM categories WHERE name = 'Food'), 'Barilla Spaghetti 500g', 95.00, 180, 'Barilla spaghetti no.5 durum wheat pasta 500g'),
((SELECT id FROM categories WHERE name = 'Food'), 'Tat Tomato Paste 700g', 165.00, 140, 'Tat double concentrated tomato paste 700g'),
((SELECT id FROM categories WHERE name = 'Food'), 'Yayla Red Lentils 1kg', 130.00, 150, 'Yayla split red lentils 1kg'),
((SELECT id FROM categories WHERE name = 'Food'), 'Komili Olive Oil 1L', 890.00, 70, 'Komili extra virgin olive oil 1L'),
((SELECT id FROM categories WHERE name = 'Food'), 'Billur Salt 1kg', 30.00, 200, 'Billur iodized table salt 1kg');

-- Ready To Eat
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Chicken Döner Wrap', 220.00, 40, 'Ready to heat chicken doner wrap 250g'),
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Cheese Pide', 190.00, 35, 'Ready to heat Turkish cheese pide 300g'),
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Mercimek Çorbası 500ml', 140.00, 50, 'Ready to heat red lentil soup 500ml'),
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Chicken Caesar Salad', 175.00, 30, 'Fresh chicken caesar salad bowl 300g'),
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Beef Burger Meal', 280.00, 25, 'Ready to heat beef burger with bun 220g'),
((SELECT id FROM categories WHERE name = 'Ready To Eat'), 'Margherita Pizza 24cm', 260.00, 30, 'Ready to bake margherita pizza 24cm');

-- Baked Goods
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Beyaz Ekmek 350g', 25.00, 200, 'Fresh Turkish white bread loaf 350g'),
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Simit', 20.00, 150, 'Fresh sesame simit, single piece'),
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Ülker Petit Beurre', 100.00, 100, 'Ülker Petit Beurre tea biscuits 200g'),
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Eti Burçak Biscuits', 115.00, 100, 'Eti Burçak wholegrain biscuits 300g'),
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Eti Canga Bar', 55.00, 180, 'Eti Canga caramel peanut nougat bar 45g'),
((SELECT id FROM categories WHERE name = 'Baked Goods'), 'Chocolate Croissant', 65.00, 90, 'Freshly baked chocolate filled croissant 80g');

-- Fit & Form
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Protein Bar Chocolate', 95.00, 120, 'High protein chocolate bar, 20g protein 60g'),
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Whey Protein Powder 1kg', 1450.00, 40, 'Whey protein concentrate powder, vanilla 1kg'),
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Rice Cakes 100g', 70.00, 100, 'Wholegrain plain rice cakes 100g'),
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Almond Pack 150g', 240.00, 80, 'Raw unsalted almonds 150g'),
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Sugar Free Granola 400g', 320.00, 60, 'No added sugar oat and nut granola 400g'),
((SELECT id FROM categories WHERE name = 'Fit & Form'), 'Coconut Water 500ml', 110.00, 90, 'Natural coconut water, no added sugar 500ml');

-- Home Care
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Home Care'), 'Domestos Bleach 750ml', 150.00, 100, 'Domestos thick bleach, pine fresh 750ml'),
((SELECT id FROM categories WHERE name = 'Home Care'), 'Fairy Dishwash Liquid 650ml', 200.00, 100, 'Fairy lemon dishwashing liquid 650ml'),
((SELECT id FROM categories WHERE name = 'Home Care'), 'Cif Surface Cleaner 750ml', 175.00, 100, 'Cif multi-surface spray cleaner 750ml'),
((SELECT id FROM categories WHERE name = 'Home Care'), 'Omo Laundry Detergent 3L', 640.00, 70, 'Omo liquid laundry detergent 3L'),
((SELECT id FROM categories WHERE name = 'Home Care'), 'Selpak Toilet Paper 16pk', 380.00, 90, 'Selpak 3-ply toilet paper, 16 rolls'),
((SELECT id FROM categories WHERE name = 'Home Care'), 'Garbage Bags 30pk', 85.00, 120, 'Medium size garbage bags, 30 pieces');

-- Pet Food
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Pedigree Dog Food 1.5kg', 500.00, 100, 'Pedigree dry dog food, chicken flavour 1.5kg'),
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Whiskas Cat Food 1.2kg', 400.00, 100, 'Whiskas dry cat food, tuna flavour 1.2kg'),
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Royal Canin Medium Adult 3kg', 800.00, 50, 'Royal Canin dry food for medium breed adult dogs 3kg'),
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Purina Cat Chow 2kg', 600.00, 50, 'Purina Cat Chow indoor formula 2kg'),
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Hill''s Science Diet Small Bites 2.5kg', 1000.00, 30, 'Hill''s Science Diet adult dog food, small bites 2.5kg'),
((SELECT id FROM categories WHERE name = 'Pet Food'), 'Cat Litter 10L', 320.00, 60, 'Clumping bentonite cat litter 10L');

-- Baby Care
INSERT INTO products (category_id, name, price, quantity, description) VALUES
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Pampers Diapers Size 3', 800.00, 100, 'Pampers baby diapers size 3 (4-9 kg), 60 pieces'),
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Huggies Baby Wipes', 300.00, 100, 'Huggies baby wipes for sensitive skin, 72 pieces'),
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Johnson''s Baby Shampoo', 250.00, 100, 'Johnson''s baby shampoo, tear-free formula 200ml'),
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Sebamed Baby Lotion', 400.00, 100, 'Sebamed baby moisturising lotion, fragrance free 200ml'),
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Mustela Baby Cream', 600.00, 50, 'Mustela baby cream for diaper rash prevention 100ml'),
((SELECT id FROM categories WHERE name = 'Baby Care'), 'Baby Bottle 250ml', 285.00, 45, 'Anti-colic baby feeding bottle with silicone teat 250ml');

-- Couriers
-- password_hash below must be a real bcrypt hash. Generate one with:
--   node -e "import('bcrypt').then(b => b.default.hash('courier123', 10).then(console.log))"
-- then paste the output in place of REPLACE_WITH_YOUR_HASH
INSERT INTO couriers (email, password_hash, phone, vehicle_type, is_available) VALUES
('ali@quickbasket.com', 'REPLACE_WITH_YOUR_HASH', '5551112233', 'motorcycle', TRUE),
('deniz@quickbasket.com', 'REPLACE_WITH_YOUR_HASH', '5554445566', 'bicycle', TRUE),
('ece@quickbasket.com', 'REPLACE_WITH_YOUR_HASH', '5557778899', 'motorcycle', FALSE);


SELECT COUNT(*) FROM products;   -- expect 90
SELECT COUNT(*) FROM couriers;   -- expect 3