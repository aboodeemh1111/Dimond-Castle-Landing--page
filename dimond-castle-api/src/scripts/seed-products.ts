import mongoose from 'mongoose'
import Product from '../models/Product'
import { connectDB } from '../config/db'

const products = [
  {
    slug: 'white-diamond-basmati',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Basmati Rice',
    tags: ['premium', 'aromatic', 'long-grain'],
    sizes: ['5kg', '10kg', '25kg'],
    order: 0,
    en: {
      name: 'White Diamond Basmati',
      description: 'Long-grain aromatic rice with soft texture and premium quality.',
      origin: 'India',
      seo: {
        title: 'White Diamond Basmati Rice - Premium Long Grain',
        description: 'Experience the finest quality basmati rice from India. Long-grain aromatic rice with soft texture and premium quality.',
      },
    },
    ar: {
      name: 'الالماس الابيض بسمتي',
      description: 'أرز طويل الحبة عطري بنعومة وجودة فائقة.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي الماس الأبيض - حبة طويلة فاخرة',
        description: 'استمتع بأجود أنواع أرز البسمتي من الهند. أرز طويل الحبة عطري بنعومة وجودة فائقة.',
      },
    },
  },
  {
    slug: 'white-diamond-sella',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Sella Rice',
    tags: ['parboiled', 'premium', 'long-grain'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    order: 1,
    en: {
      name: 'White Diamond Sella',
      description: 'Parboiled rice with perfect grains and rich aroma.',
      origin: 'Pakistan',
      seo: {
        title: 'White Diamond Sella Rice - Premium Parboiled',
        description: 'Premium parboiled rice from Pakistan with perfect grains and rich aroma.',
      },
    },
    ar: {
      name: 'الالماس الابيض سيلا',
      description: 'أرز مُعالج بالبخار بحبات متماسكة ورائحة مميزة.',
      origin: 'باكستان',
      seo: {
        title: 'أرز سيلا الماس الأبيض - معالج بالبخار فاخر',
        description: 'أرز معالج بالبخار فاخر من باكستان بحبات متماسكة ورائحة مميزة.',
      },
    },
  },
  {
    slug: 'white-diamond-jasmine',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Jasmine Rice',
    tags: ['fragrant', 'soft', 'everyday'],
    sizes: ['5kg', '10kg', '25kg'],
    order: 2,
    en: {
      name: 'White Diamond Jasmine',
      description: 'Soft and fragrant rice, ideal for everyday meals.',
      origin: 'Thailand',
      seo: {
        title: 'White Diamond Jasmine Rice - Soft & Fragrant',
        description: 'Soft and fragrant jasmine rice from Thailand, ideal for everyday meals.',
      },
    },
    ar: {
      name: 'الالماس الابيض ياسمين',
      description: 'أرز ناعم وعطِر، مثالي للوجبات اليومية.',
      origin: 'تايلاند',
      seo: {
        title: 'أرز ياسمين الماس الأبيض - ناعم وعطر',
        description: 'أرز ياسمين ناعم وعطر من تايلاند، مثالي للوجبات اليومية.',
      },
    },
  },
  {
    slug: 'white-diamond-premium',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Premium Rice',
    tags: ['premium', 'gourmet', 'special-occasions'],
    sizes: ['5kg', '10kg', '25kg'],
    order: 3,
    en: {
      name: 'White Diamond Premium',
      description: 'The finest selection for special occasions and gourmet cuisine.',
      origin: 'India',
      seo: {
        title: 'White Diamond Premium Rice - Finest Selection',
        description: 'The finest selection of premium rice for special occasions and gourmet cuisine.',
      },
    },
    ar: {
      name: 'الالماس الابيض بريميوم',
      description: 'اختيار فاخر للمناسبات الخاصة والمأكولات الراقية.',
      origin: 'الهند',
      seo: {
        title: 'أرز بريميوم الماس الأبيض - اختيار فاخر',
        description: 'اختيار فاخر من الأرز الممتاز للمناسبات الخاصة والمأكولات الراقية.',
      },
    },
  },
  {
    slug: 'white-diamond-long-grain',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Long Grain Rice',
    tags: ['long-grain', 'separated', 'quality'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    order: 4,
    en: {
      name: 'White Diamond Long Grain',
      description: 'Perfectly separated grains with excellent cooking quality.',
      origin: 'Thailand',
      seo: {
        title: 'White Diamond Long Grain Rice - Perfect Quality',
        description: 'Perfectly separated long grain rice with excellent cooking quality from Thailand.',
      },
    },
    ar: {
      name: 'الالماس الابيض طويل الحبة',
      description: 'حبات منفصلة تمامًا بجودة طهي ممتازة.',
      origin: 'تايلاند',
      seo: {
        title: 'أرز طويل الحبة الماس الأبيض - جودة مثالية',
        description: 'أرز طويل الحبة منفصل تمامًا بجودة طهي ممتازة من تايلاند.',
      },
    },
  },
  {
    slug: 'white-diamond-super-kernel',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Super Kernel Rice',
    tags: ['extra-long', 'premium', 'aromatic'],
    sizes: ['5kg', '10kg', '25kg'],
    order: 5,
    en: {
      name: 'White Diamond Super Kernel',
      description: 'Extra-long grains with superior taste and aroma.',
      origin: 'Pakistan',
      seo: {
        title: 'White Diamond Super Kernel Rice - Extra Long',
        description: 'Extra-long grain rice with superior taste and aroma from Pakistan.',
      },
    },
    ar: {
      name: 'الالماس الابيض سوبر كرنل',
      description: 'حبات طويلة جدًا بطعم ورائحة مميزة.',
      origin: 'باكستان',
      seo: {
        title: 'أرز سوبر كرنل الماس الأبيض - حبة طويلة جداً',
        description: 'أرز بحبات طويلة جداً بطعم ورائحة مميزة من باكستان.',
      },
    },
  },
]

async function seedProducts() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    console.log('Clearing existing products...')
    await Product.deleteMany({})

    console.log('Seeding products...')
    for (const productData of products) {
      const product = await Product.create(productData)
      console.log(`✓ Created: ${product.en.name}`)
    }

    console.log('\n✅ Successfully seeded', products.length, 'products!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()

