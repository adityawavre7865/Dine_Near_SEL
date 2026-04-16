require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Hotel = require('../models/Hotel');
const MenuItem = require('../models/MenuItem');
const UserPreference = require('../models/UserPreference');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dinenear';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await MenuItem.deleteMany({});
    await UserPreference.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@dinenear.com',
        password: 'Admin@123',
        role: 'admin',
      },
      {
        name: 'Rahul Sharma',
        email: 'owner1@dinenear.com',
        password: 'Owner@123',
        role: 'owner',
      },
      {
        name: 'Priya Mehta',
        email: 'owner2@dinenear.com',
        password: 'Owner@123',
        role: 'owner',
      },
      {
        name: 'Aditya Kumar',
        email: 'user@dinenear.com',
        password: 'User@123',
        role: 'user',
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@dinenear.com',
        password: 'User@123',
        role: 'user',
      },
    ]);
    console.log(`👤 Created ${users.length} users`);

    const [, owner1, owner2] = users;

    // Create hotels
    const hotels = await Hotel.create([
      {
        name: 'The Spice Garden',
        description: 'Authentic North Indian cuisine with a modern twist. Experience the rich flavors of traditional recipes passed down through generations.',
        location: 'Koramangala, Bangalore',
        address: '12, 5th Block, Koramangala, Bangalore - 560034',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
        cuisine: ['North Indian', 'Punjabi', 'Mughlai'],
        rating: 4.5,
        totalRatings: 238,
        owner: owner1._id,
        status: 'approved',
        isOpen: true,
        openingTime: '09:00',
        closingTime: '23:00',
        phone: '+91 9876543210',
      },
      {
        name: 'Green Leaf Cafe',
        description: 'A cozy vegetarian cafe serving healthy, fresh, and delicious meals. Perfect for health-conscious foodies.',
        location: 'Indiranagar, Bangalore',
        address: '45, 100 Feet Road, Indiranagar, Bangalore - 560038',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
        cuisine: ['Continental', 'South Indian', 'Salads'],
        rating: 4.3,
        totalRatings: 185,
        owner: owner1._id,
        status: 'approved',
        isOpen: true,
        openingTime: '08:00',
        closingTime: '22:00',
        phone: '+91 9876543211',
      },
      {
        name: 'Coastal Kitchen',
        description: 'Bringing the freshest seafood and coastal flavors from Kerala and Goa right to your plate.',
        location: 'HSR Layout, Bangalore',
        address: '88, Sector 2, HSR Layout, Bangalore - 560102',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop',
        cuisine: ['Seafood', 'Coastal', 'Kerala'],
        rating: 4.7,
        totalRatings: 312,
        owner: owner2._id,
        status: 'approved',
        isOpen: true,
        openingTime: '11:00',
        closingTime: '23:30',
        phone: '+91 9876543212',
      },
      {
        name: 'Urban Bites',
        description: 'Modern fusion restaurant blending global flavors with local ingredients.',
        location: 'Whitefield, Bangalore',
        address: '22, ITPL Road, Whitefield, Bangalore - 560066',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop',
        cuisine: ['Fusion', 'Italian', 'Asian'],
        rating: 4.1,
        totalRatings: 97,
        owner: owner2._id,
        status: 'pending',
        isOpen: true,
        openingTime: '12:00',
        closingTime: '23:00',
        phone: '+91 9876543213',
      },
    ]);
    console.log(`🏨 Created ${hotels.length} hotels`);

    const [hotel1, hotel2, hotel3] = hotels;

    // Create menu items
    const menuItems = await MenuItem.create([
      // The Spice Garden
      {
        hotel: hotel1._id,
        name: 'Butter Chicken',
        description: 'Tender chicken in a rich, creamy tomato-based gravy with aromatic spices.',
        price: 320,
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: false,
        rating: 4.8,
        totalRatings: 145,
        tags: ['popular', 'bestseller'],
      },
      {
        hotel: hotel1._id,
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in buttery tomato gravy, simmered overnight.',
        price: 220,
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.6,
        totalRatings: 98,
        tags: ['classic'],
      },
      {
        hotel: hotel1._id,
        name: 'Garlic Naan',
        description: 'Soft tandoor-baked bread topped with garlic and butter.',
        price: 60,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.5,
        totalRatings: 201,
        tags: [],
      },
      {
        hotel: hotel1._id,
        name: 'Masala Chai',
        description: 'Aromatic spiced tea brewed with ginger, cardamom, and fresh milk.',
        price: 40,
        category: 'beverages',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.3,
        totalRatings: 88,
        tags: [],
      },
      {
        hotel: hotel1._id,
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese cubes grilled to perfection in a tandoor.',
        price: 280,
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.7,
        totalRatings: 176,
        tags: ['popular'],
      },

      // Green Leaf Cafe
      {
        hotel: hotel2._id,
        name: 'Avocado Toast',
        description: 'Sourdough toast topped with smashed avocado, cherry tomatoes, and microgreens.',
        price: 180,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.4,
        totalRatings: 67,
        tags: ['healthy'],
      },
      {
        hotel: hotel2._id,
        name: 'Buddha Bowl',
        description: 'Wholesome bowl with quinoa, roasted veggies, chickpeas, and tahini dressing.',
        price: 260,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.6,
        totalRatings: 89,
        tags: ['healthy', 'vegan'],
      },
      {
        hotel: hotel2._id,
        name: 'Cold Brew Coffee',
        description: 'Smooth, low-acidity cold brew steeped for 16 hours for maximum flavor.',
        price: 120,
        category: 'beverages',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.5,
        totalRatings: 132,
        tags: [],
      },

      // Coastal Kitchen
      {
        hotel: hotel3._id,
        name: 'Kerala Fish Curry',
        description: 'Traditional Kerala-style fish curry with raw mangoes and coconut milk.',
        price: 380,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: false,
        rating: 4.9,
        totalRatings: 203,
        tags: ['bestseller', 'spicy'],
      },
      {
        hotel: hotel3._id,
        name: 'Prawn Ghee Roast',
        description: 'Juicy prawns tossed in aromatic ghee-roasted Mangalorean masala.',
        price: 450,
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: false,
        rating: 4.8,
        totalRatings: 178,
        tags: ['popular', 'spicy'],
      },
      {
        hotel: hotel3._id,
        name: 'Coconut Rice',
        description: 'Fragrant basmati rice cooked with fresh coconut, curry leaves, and mustard seeds.',
        price: 150,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.3,
        totalRatings: 94,
        tags: [],
      },
      {
        hotel: hotel3._id,
        name: 'Gulab Jamun',
        description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup. Served warm.',
        price: 120,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1548341408-93c6a147e556?w=400&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        rating: 4.7,
        totalRatings: 156,
        tags: ['sweet'],
      },
    ]);
    console.log(`🍽️  Created ${menuItems.length} menu items`);

    // Create user preferences
    await UserPreference.create([
      {
        user: users[3]._id,
        favoriteHotels: [hotel1._id, hotel3._id],
        favoriteItems: [menuItems[0]._id, menuItems[8]._id],
        dietaryPreferences: ['non-veg'],
        preferredCuisines: ['North Indian', 'Seafood'],
      },
      {
        user: users[4]._id,
        favoriteHotels: [hotel2._id],
        favoriteItems: [menuItems[5]._id, menuItems[6]._id],
        dietaryPreferences: ['veg', 'vegan'],
        preferredCuisines: ['Continental', 'Salads'],
      },
    ]);
    console.log('⭐ Created user preferences');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('  Demo Credentials');
    console.log('═══════════════════════════════════');
    console.log('  Admin  : admin@dinenear.com  / Admin@123');
    console.log('  Owner1 : owner1@dinenear.com / Owner@123');
    console.log('  Owner2 : owner2@dinenear.com / Owner@123');
    console.log('  User   : user@dinenear.com   / User@123');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
