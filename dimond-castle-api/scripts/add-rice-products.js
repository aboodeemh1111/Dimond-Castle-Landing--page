const products = [
  {
    slug: 'premium-white-diamond-basmati-rice',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Basmati Rice',
    tags: ['premium', 'aromatic', 'long-grain', 'white-diamond'],
    sizes: ['1kg', '5kg', '10kg', '20kg', '40kg'],
    price: { amount: 180, currency: 'SAR' },
    stockQuantity: 250,
    viewCount: 0,
    order: 1,
    en: {
      name: 'Premium White Diamond Basmati Rice',
      description: 'The finest quality basmati rice with exceptionally long grains, superior aroma, and perfect texture. Sourced from premium farms and processed using traditional methods to preserve its natural taste and nutritional value.',
      origin: 'India',
      seo: {
        title: 'Premium White Diamond Basmati Rice - Finest Quality Long Grain Rice',
        description: 'Experience the premium quality of White Diamond Basmati Rice. Exceptionally long grains with superior aroma and perfect texture, sourced from India.'
      }
    },
    ar: {
      name: 'أرز بسمتي الماس الأبيض الفاخر',
      description: 'أجود أنواع أرز البسمتي بحبات طويلة استثنائية ورائحة متفوقة وقوام مثالي. مصدر من مزارع فاخرة ومعالج بطرق تقليدية للحفاظ على طعمه الطبيعي وقيمته الغذائية.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي الماس الأبيض الفاخر - أجود أنواع الأرز طويل الحبة',
        description: 'استمتع بجودة الماس الأبيض في أرز البسمتي. حبات طويلة استثنائية برائحة متفوقة وقوام مثالي، مصدر من الهند.'
      }
    }
  },
  {
    slug: 'royal-sella-basmati-rice',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Sella Rice',
    tags: ['royal', 'parboiled', 'premium', 'aromatic'],
    sizes: ['5kg', '10kg', '20kg', '40kg'],
    price: { amount: 160, currency: 'SAR' },
    stockQuantity: 200,
    viewCount: 0,
    order: 2,
    en: {
      name: 'Royal Sella Basmati Rice',
      description: 'Premium parboiled basmati rice with rich aroma and non-sticky texture. Perfect for biryani and pilaf dishes. Retains nutrients and cooks evenly for consistent results.',
      origin: 'Pakistan',
      seo: {
        title: 'Royal Sella Basmati Rice - Premium Parboiled Rice',
        description: 'Premium parboiled basmati rice with rich aroma and non-sticky texture. Perfect for biryani and pilaf dishes from Pakistan.'
      }
    },
    ar: {
      name: 'أرز بسمتي الملكي سيلا',
      description: 'أرز بسمتي معالج بالبخار فاخر برائحة غنية وقوام غير لزج. مثالي لأطباق البرياني والپيلاف. يحتفظ بالعناصر الغذائية ويطبخ بشكل متساوٍ لنتائج متسقة.',
      origin: 'باكستان',
      seo: {
        title: 'أرز بسمتي الملكي سيلا - أرز معالج بالبخار فاخر',
        description: 'أرز بسمتي معالج بالبخار فاخر برائحة غنية وقوام غير لزج. مثالي لأطباق البرياني والپيلاف من باكستان.'
      }
    }
  },
  {
    slug: 'super-kernel-basmati-rice',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Basmati Rice',
    tags: ['super-kernel', 'extra-long', 'premium', 'aromatic'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    price: { amount: 140, currency: 'SAR' },
    stockQuantity: 300,
    viewCount: 0,
    order: 3,
    en: {
      name: 'Super Kernel Basmati Rice',
      description: 'Extra-long grain basmati rice with superior elongation and aroma. Each grain becomes significantly longer when cooked, creating an impressive presentation for your dishes.',
      origin: 'Pakistan',
      seo: {
        title: 'Super Kernel Basmati Rice - Extra Long Grain Rice',
        description: 'Extra-long grain basmati rice with superior elongation and aroma. Each grain becomes significantly longer when cooked.'
      }
    },
    ar: {
      name: 'أرز بسمتي سوبر كرنل',
      description: 'أرز بسمتي بحبات طويلة إضافية مع تمدد ورائحة متفوقة. كل حبة تصبح أطول بشكل ملحوظ عند الطبخ، مما يخلق عرضًا مثيرًا للإعجاب لأطباقك.',
      origin: 'باكستان',
      seo: {
        title: 'أرز بسمتي سوبر كرنل - أرز بحبات طويلة إضافية',
        description: 'أرز بسمتي بحبات طويلة إضافية مع تمدد ورائحة متفوقة. كل حبة تصبح أطول بشكل ملحوظ عند الطبخ.'
      }
    }
  },
  {
    slug: 'brown-basmati-rice-organic',
    status: 'published',
    featured: true,
    inStock: true,
    category: 'Organic Rice',
    tags: ['organic', 'brown', 'healthy', 'nutritious', 'whole-grain'],
    sizes: ['2kg', '5kg', '10kg', '25kg'],
    price: { amount: 200, currency: 'SAR' },
    stockQuantity: 150,
    viewCount: 0,
    order: 4,
    en: {
      name: 'Brown Basmati Rice Organic',
      description: '100% organic brown basmati rice with bran layer intact. Rich in fiber, vitamins, and minerals. Perfect for health-conscious consumers seeking nutritious whole grain options.',
      origin: 'India',
      seo: {
        title: 'Brown Basmati Rice Organic - Healthy Whole Grain Rice',
        description: '100% organic brown basmati rice with bran layer intact. Rich in fiber, vitamins, and minerals for health-conscious consumers.'
      }
    },
    ar: {
      name: 'أرز بسمتي بني عضوي',
      description: 'أرز بسمتي بني عضوي 100% مع طبقة النخالة سليمة. غني بالألياف والفيتامينات والمعادن. مثالي للمستهلكين المهتمين بالصحة الذين يبحثون عن خيارات الحبوب الكاملة المغذية.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي بني عضوي - أرز صحي حبوب كاملة',
        description: 'أرز بسمتي بني عضوي 100% مع طبقة النخالة سليمة. غني بالألياف والفيتامينات والمعادن للمستهلكين المهتمين بالصحة.'
      }
    }
  },
  {
    slug: '1121-steam-basmati-rice',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Steam Rice',
    tags: ['1121', 'steam', 'premium', 'long-grain'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    price: { amount: 150, currency: 'SAR' },
    stockQuantity: 180,
    viewCount: 0,
    order: 5,
    en: {
      name: '1121 Steam Basmati Rice',
      description: 'Premium 1121 variety steam basmati rice with perfect grain separation and fluffy texture. Ideal for everyday cooking and professional chefs who demand consistency.',
      origin: 'India',
      seo: {
        title: '1121 Steam Basmati Rice - Premium Quality Rice',
        description: 'Premium 1121 variety steam basmati rice with perfect grain separation and fluffy texture. Ideal for everyday cooking.'
      }
    },
    ar: {
      name: 'أرز بسمتي 1121 بخار',
      description: 'أرز بسمتي بخار من صنف 1121 الفاخر مع فصل مثالي للحبات وقوام ناعم. مثالي للطبخ اليومي والطهاة المحترفين الذين يطالبون بالاتساق.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي 1121 بخار - أرز جودة فاخرة',
        description: 'أرز بسمتي بخار من صنف 1121 الفاخر مع فصل مثالي للحبات وقوام ناعم. مثالي للطبخ اليومي.'
      }
    }
  },
  {
    slug: 'traditional-basmati-rice',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Traditional Rice',
    tags: ['traditional', 'authentic', 'everyday', 'value'],
    sizes: ['5kg', '10kg', '25kg', '50kg', '100kg'],
    price: { amount: 80, currency: 'SAR' },
    stockQuantity: 500,
    viewCount: 0,
    order: 6,
    en: {
      name: 'Traditional Basmati Rice',
      description: 'Authentic traditional basmati rice offering excellent value for everyday cooking. Maintains the classic basmati aroma and flavor that families love.',
      origin: 'India',
      seo: {
        title: 'Traditional Basmati Rice - Authentic Everyday Rice',
        description: 'Authentic traditional basmati rice offering excellent value for everyday cooking. Maintains the classic basmati aroma and flavor.'
      }
    },
    ar: {
      name: 'أرز بسمتي تقليدي',
      description: 'أرز بسمتي تقليدي أصيل يقدم قيمة ممتازة للطبخ اليومي. يحافظ على رائحة وطعم البسمتي الكلاسيكي الذي تحبه العائلات.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي تقليدي - أرز يومي أصيل',
        description: 'أرز بسمتي تقليدي أصيل يقدم قيمة ممتازة للطبخ اليومي. يحافظ على رائحة وطعم البسمتي الكلاسيكي.'
      }
    }
  },
  {
    slug: 'golden-sella-basmati-rice',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Golden Sella Rice',
    tags: ['golden', 'sella', 'premium', 'nutritious'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    price: { amount: 120, currency: 'SAR' },
    stockQuantity: 220,
    viewCount: 0,
    order: 7,
    en: {
      name: 'Golden Sella Basmati Rice',
      description: 'Beautiful golden-hued parboiled basmati rice with enhanced nutritional value. The steaming process locks in nutrients while giving the rice its distinctive golden color.',
      origin: 'Pakistan',
      seo: {
        title: 'Golden Sella Basmati Rice - Nutritious Golden Rice',
        description: 'Beautiful golden-hued parboiled basmati rice with enhanced nutritional value. The steaming process locks in nutrients.'
      }
    },
    ar: {
      name: 'أرز بسمتي الذهبي سيلا',
      description: 'أرز بسمتي معالج بالبخار بلون ذهبي جميل مع قيمة غذائية محسنة. عملية التبخير تقفل العناصر الغذائية مع إعطاء الأرز لونه الذهبي المميز.',
      origin: 'باكستان',
      seo: {
        title: 'أرز بسمتي الذهبي سيلا - أرز ذهبي مغذي',
        description: 'أرز بسمتي معالج بالبخار بلون ذهبي جميل مع قيمة غذائية محسنة. عملية التبخير تقفل العناصر الغذائية.'
      }
    }
  },
  {
    slug: 'extra-long-grain-basmati-rice',
    status: 'published',
    featured: false,
    inStock: true,
    category: 'Extra Long Grain Rice',
    tags: ['extra-long', 'premium', 'authentic', 'quality'],
    sizes: ['5kg', '10kg', '25kg', '50kg'],
    price: { amount: 100, currency: 'SAR' },
    stockQuantity: 280,
    viewCount: 0,
    order: 8,
    en: {
      name: 'Extra Long Grain Basmati Rice',
      description: 'Exceptionally long grain basmati rice with authentic flavor and aroma. Perfect for traditional dishes and modern cuisine requiring superior grain elongation.',
      origin: 'India',
      seo: {
        title: 'Extra Long Grain Basmati Rice - Superior Quality Rice',
        description: 'Exceptionally long grain basmati rice with authentic flavor and aroma. Perfect for traditional and modern cuisine.'
      }
    },
    ar: {
      name: 'أرز بسمتي طويل الحبة إضافي',
      description: 'أرز بسمتي بحبات طويلة استثنائية بنكهة ورائحة أصيلة. مثالي للأطباق التقليدية والمطبخ الحديث الذي يتطلب تمدد حبات متفوق.',
      origin: 'الهند',
      seo: {
        title: 'أرز بسمتي طويل الحبة إضافي - أرز جودة متفوقة',
        description: 'أرز بسمتي بحبات طويلة استثنائية بنكهة ورائحة أصيلة. مثالي للأطباق التقليدية والمطبخ الحديث.'
      }
    }
  }
];

async function addRiceProducts() {
  const API_BASE = 'http://localhost:4000';
  let successCount = 0;
  let errorCount = 0;

  console.log('🚀 Starting to add 8 rice products to Diamond Castle website...\n');

  for (const [index, product] of products.entries()) {
    try {
      console.log(`📦 Adding product ${index + 1}/8: ${product.en.name}`);

      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully added: ${result.en.name} (${result.slug})`);
        successCount++;
      } else {
        const error = await response.json();
        console.log(`❌ Failed to add ${product.en.name}: ${error.error || 'Unknown error'}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error adding ${product.en.name}: ${error.message}`);
      errorCount++;
    }
    console.log(''); // Empty line for spacing
  }

  console.log('📊 Summary:');
  console.log(`✅ Successfully added: ${successCount} products`);
  console.log(`❌ Failed to add: ${errorCount} products`);
  console.log(`📍 Total products processed: ${products.length}`);

  if (successCount > 0) {
    console.log('\n🎉 Products have been added to your database!');
    console.log('🔍 Check them in:');
    console.log('   - Admin panel: http://localhost:3001/admin/products');
    console.log('   - Main website: http://localhost:3000/#products');
    console.log('   - Product pages: http://localhost:3000/products/{product-slug}');
  }
}

addRiceProducts().catch(console.error);
