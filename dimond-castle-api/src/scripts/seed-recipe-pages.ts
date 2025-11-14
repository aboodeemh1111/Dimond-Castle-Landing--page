import mongoose from "mongoose";
import Page from "../models/Page";
import { connectDB } from "../config/db";

type RecipeSeed = {
  slug: string;
  titleEN: string;
  titleAR: string;
  heroIntroEN: string;
  heroIntroAR: string;
  heroBodyEN: string;
  heroBodyAR: string;
  highlightsEN: string[];
  highlightsAR: string[];
  servingsEN: string;
  servingsAR: string;
  cookTimeEN: string;
  cookTimeAR: string;
  occasionEN: string;
  occasionAR: string;
  ingredientsEN: string[];
  ingredientsAR: string[];
  stepsEN: string[];
  stepsAR: string[];
  tipEN: string;
  tipAR: string;
  seoENTitle: string;
  seoENDescription: string;
  seoARTitle: string;
  seoARDescription: string;
};

const recipes: RecipeSeed[] = [
  {
    slug: "/recipes/saffron-majboos",
    titleEN: "Saffron Majboos with Diamond Castle Basmati",
    titleAR: "كبسة الزعفران بأرز دايموند كاسل",
    heroIntroEN:
      "An elevated take on the Gulf classic where every Diamond Castle basmati grain stays long, white, and perfumed.",
    heroIntroAR:
      "نسخة راقية من الكبسة الخليجية حيث تبقى كل حبة من أرز دايموند كاسل طويلة ولامعة وعابقة.",
    heroBodyEN:
      "Serve it tableside for celebrations or executive tastings—layers of saffron stock, roasted chicken, and toasted nuts make it unforgettable.",
    heroBodyAR:
      "قدّمه على المائدة في المناسبات أو جلسات التذوق التنفيذية؛ طبقات مرق الزعفران والدجاج المحمّر والمكسرات المحمصة تترك انطباعاً لا يُنسى.",
    highlightsEN: [
      "Steam-finished basmati for impeccable separation.",
      "Infused with saffron threads and Gulf spices.",
      "Recipe tested inside the Diamond Castle kitchen studio.",
    ],
    highlightsAR: [
      "تبخير نهائي للأرز البسمتي للحصول على حبات متمايزة تماماً.",
      "منقوع بخيوط الزعفران والتوابل الخليجية.",
      "وصفة مجربة داخل استوديو مطبخ دايموند كاسل.",
    ],
    servingsEN: "Serves 6 generous portions.",
    servingsAR: "يكفي 6 حصص سخية.",
    cookTimeEN: "Total time: 90 minutes including resting.",
    cookTimeAR: "الوقت الإجمالي: 90 دقيقة مع فترة الراحة.",
    occasionEN: "Ideal for Eid lunches or VIP hospitality trays.",
    occasionAR: "مثالي لغداءات العيد أو ضيافة كبار الشخصيات.",
    ingredientsEN: [
      "2 cups Diamond Castle White Basmati rice, rinsed",
      "3 tbsp ghee or clarified butter",
      "1 large onion, thinly sliced",
      "2 cloves garlic, minced",
      "1 tbsp baharat plus 1 cinnamon stick",
      "3 cups saffron chicken stock",
      "400 g roasted chicken pieces",
      "Toasted almonds, raisins, and fried onions to finish",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل الأبيض بسمتي، مغسول",
      "3 ملاعق كبيرة من السمن أو الزبدة المصفاة",
      "1 بصلة كبيرة مقطعة شرائح رفيعة",
      "2 فص ثوم مفروم",
      "1 ملعقة كبيرة بهارات كبسة مع عود قرفة",
      "3 أكواب من مرق الدجاج بالزعفران",
      "400 غرام من قطع الدجاج المحمّر",
      "للتقديم: لوز محمص وزبيب وبصل مقلي",
    ],
    stepsEN: [
      "Soak the rice for 20 minutes, then rinse until the water runs clear.",
      "Sauté the onions in ghee until deep gold, then add garlic and baharat.",
      "Fold in the roasted chicken and saffron stock and simmer gently for 10 minutes.",
      "Add the drained rice, cook on medium until the liquid reduces, cover, and steam for 20 minutes.",
      "Fluff with a fork, garnish with toasted nuts and fried onions, and serve immediately.",
    ],
    stepsAR: [
      "انقع الأرز 20 دقيقة ثم اشطفه حتى يصبح الماء صافياً.",
      "حمّر البصل في السمن حتى يكتسب لوناً ذهبياً عميقاً ثم أضف الثوم والبهارات.",
      "أضف قطع الدجاج ومرق الزعفران واتركه يغلي بخفة لمدة 10 دقائق.",
      "أضف الأرز المصفى واطهه على نار متوسطة حتى يقل السائل ثم غط القدر واتركه يتبخر 20 دقيقة.",
      "افل الأرز بالشوكة وزينه بالمكسرات والبصل المقلي وقدمه فوراً.",
    ],
    tipEN:
      "Bloom the saffron in hot stock—not boiling water—to preserve its perfume and color.",
    tipAR:
      "انقع الزعفران في المرق الساخن وليس الماء المغلي لتحافظ على العطر واللون.",
    seoENTitle: "Saffron Majboos Recipe | Diamond Castle Rice",
    seoENDescription:
      "Step-by-step saffron majboos using Diamond Castle basmati for luxury banquets.",
    seoARTitle: "وصفة كبسة الزعفران بأرز دايموند كاسل",
    seoARDescription:
      "خطوات تفصيلية لتحضير كبسة فاخرة بخيوط الزعفران وأرز دايموند كاسل البسمتي.",
  },
  {
    slug: "/recipes/citrus-herb-pilaf",
    titleEN: "Charred Citrus & Herb Pilaf",
    titleAR: "بيلاف الأعشاب والحمضيات المحمصة",
    heroIntroEN:
      "Bright citrus zest and garden herbs cling to every Diamond Castle grain for a refreshing side or light main.",
    heroIntroAR:
      "قشر الحمضيات الطازج وأعشاب الحديقة تلتصق بكل حبة من أرز دايموند كاسل لطبق جانبي منعش أو طبق رئيسي خفيف.",
    heroBodyEN:
      "We toast the rice in olive oil, fold in charred lemon, and finish with dill and mint so the platter stays vibrant on any buffet.",
    heroBodyAR:
      "نحمص الأرز بزيت الزيتون، نضيف شرائح الليمون المحمصة، وننهي بالشبت والنعناع ليبقى الطبق متألقاً على أي بوفيه.",
    highlightsEN: [
      "Diamond Castle Sella grains hold their shape even when dressed.",
      "Serve warm or at room temperature without clumping.",
      "Pairs beautifully with grilled fish or mezze boards.",
    ],
    highlightsAR: [
      "تحافظ حبات أرز دايموند كاسل سيلا على شكلها حتى مع التتبيل.",
      "يُقدّم ساخناً أو بحرارة الغرفة دون أي تكتل.",
      "يتناغم مع الأسماك المشوية أو أطباق المزّة.",
    ],
    servingsEN: "Serves 8 as an elevated side.",
    servingsAR: "يكفي 8 أشخاص كطبق جانبي راقٍ.",
    cookTimeEN: "Total time: 45 minutes including resting.",
    cookTimeAR: "الوقت الإجمالي: 45 دقيقة مع فترة الراحة.",
    occasionEN: "Ideal for catering spreads, Ramadan nights, or tasting menus.",
    occasionAR: "مثالي لعروض الضيافة وليالي رمضان وقوائم التذوق.",
    ingredientsEN: [
      "2 cups Diamond Castle Sella rice, rinsed",
      "2 tbsp olive oil plus 1 tbsp butter",
      "Zest of 2 lemons plus thin slices for charring",
      "1 bunch flat-leaf parsley, chopped",
      "1/2 bunch dill, finely chopped",
      "1/2 bunch mint leaves, torn",
      "1 tbsp toasted cumin and coriander seeds",
      "Sea salt and cracked pepper to taste",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل سيلا، مغسول",
      "2 ملعقة كبيرة زيت زيتون + 1 ملعقة كبيرة زبدة",
      "برش 2 ليمونة مع شرائح رفيعة للتحميص",
      "حزمة بقدونس مفروم",
      "نصف حزمة شبت مفروم ناعماً",
      "نصف حزمة نعناع مفروم خشناً",
      "1 ملعقة كبيرة من بذور الكمون والكزبرة المحمصة",
      "ملح بحري وفلفل مدقوق حسب الرغبة",
    ],
    stepsEN: [
      "Toast the rinsed rice in olive oil and butter until lightly nutty.",
      "Add 3 cups vegetable stock, salt, and the charred lemon slices; cook until nearly tender.",
      "Cover and steam for 10 minutes, then spread onto a tray to cool slightly.",
      "Fold in the herbs, spices, and citrus zest while fluffing with your hands.",
      "Transfer to a platter and finish with extra mint and a drizzle of olive oil.",
    ],
    stepsAR: [
      "حمّص الأرز المغسول بزيت الزيتون والزبدة حتى تبرز رائحة الجوز.",
      "أضف 3 أكواب من مرق الخضار والملح وشرائح الليمون المحمصة واطهه حتى يوشك على النضج.",
      "غط القدر واتركه يتبخر 10 دقائق ثم افرد الأرز على صينية ليبرد قليلاً.",
      "اقلب الأعشاب والتوابل وبرش الحمضيات مع تهوية الأرز بيديك.",
      "انقل الأرز إلى طبق التقديم وأنهِه بمزيد من النعناع ورشة زيت زيتون.",
    ],
    tipEN:
      "Char lemons cut-side down until deeply caramelized; the gentle bitterness balances the herbs.",
    tipAR:
      "حمّر الليمون على الجهة المقطوعة حتى يتكرمل بعمق فمرورته اللطيفة توازن الأعشاب.",
    seoENTitle: "Charred Citrus Herb Pilaf | Diamond Castle Sella",
    seoENDescription:
      "Vibrant herb pilaf showcasing Diamond Castle Sella rice for buffets and mezze.",
    seoARTitle: "بيلاف الأعشاب والحمضيات بأرز دايموند كاسل سيلا",
    seoARDescription:
      "طبق جانبي مشرق بالأعشاب والحمضيات مع أرز دايموند كاسل سيلا للمناسبات الفاخرة.",
  },
  {
    slug: "/recipes/gulf-shrimp-machboos",
    titleEN: "Gulf Shrimp Machboos with Jasmine Rice",
    titleAR: "مجبوس الروبيان الخليجي بأرز جاسمين",
    heroIntroEN:
      "Sweet Gulf shrimp and caramelized tomatoes coat Diamond Castle Jasmine grains for a luxurious seafood machboos.",
    heroIntroAR:
      "روبيان الخليج الحلو والبندورة المكرملة تغلف حبات أرز دايموند كاسل جاسمين لوصفة مجبوس بحرية فاخرة.",
    heroBodyEN:
      "The rice steams in shrimp shell stock, absorbing chile, dried limes, and saffron so every bite tastes like the coast.",
    heroBodyAR:
      "يتبخر الأرز في مرق قشور الروبيان فيمتص الفلفل والليمون المجفف والزعفران لتذوق طعم البحر في كل لقمة.",
    highlightsEN: [
      "Diamond Castle Jasmine stays plush yet defined after steaming.",
      "Homemade shrimp stock builds depth and natural sweetness.",
      "Finished with blistered cherry tomatoes and chili oil.",
    ],
    highlightsAR: [
      "يبقى أرز دايموند كاسل جاسمين طرياً ومتفرقاً بعد التبخير.",
      "مرق الروبيان المنزلي يضيف عمقاً وحلاوة طبيعية.",
      "يُختتم بطماطم كرزية متفحمة وزيت فلفل حار.",
    ],
    servingsEN: "Serves 4 as a main course.",
    servingsAR: "يكفي 4 أشخاص كطبق رئيسي.",
    cookTimeEN: "Total time: 60 minutes including stock preparation.",
    cookTimeAR: "الوقت الإجمالي: 60 دقيقة مع تحضير المرق.",
    occasionEN: "Perfect for Friday family lunches or seafood tasting flights.",
    occasionAR: "مثالي لغداءات الجمعة العائلية أو قوائم التذوق البحرية.",
    ingredientsEN: [
      "2 cups Diamond Castle Jasmine rice, rinsed",
      "500 g Gulf shrimp, cleaned (reserve shells)",
      "1 onion and 1 tomato, diced",
      "2 tbsp tomato paste",
      "2 dried limes, cracked",
      "1 tsp baharat plus pinch saffron",
      "3 cups shrimp stock made from the shells",
      "Fresh cilantro, fried chilies, and blistered cherry tomatoes to finish",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل جاسمين، مغسول",
      "500 غرام من روبيان الخليج المنظف (احتفظ بالقشور)",
      "1 بصلة و1 طماطم مقطعتان مكعبات",
      "2 ملعقة كبيرة معجون طماطم",
      "2 ليمون مجفف مكسر",
      "1 ملعقة صغيرة بهارات مع رشة زعفران",
      "3 أكواب من مرق الروبيان المصنوع من القشور",
      "كزبرة طازجة وفلفل مقلي وطماطم كرزية محمصة للتقديم",
    ],
    stepsEN: [
      "Simmer the shrimp shells with saffron and 4 cups water for 20 minutes to make stock.",
      "Sauté the onion and tomato in oil until jammy, then add tomato paste and baharat.",
      "Pour in the shrimp stock and dried limes; simmer for 5 minutes.",
      "Stir in the rice, cook until nearly tender, then nestle the seasoned shrimp on top.",
      "Cover, steam for 10 minutes, and finish with herbs, fried chilies, and blistered tomatoes.",
    ],
    stepsAR: [
      "اغل قشور الروبيان مع الزعفران و4 أكواب ماء لمدة 20 دقيقة لتحضير المرق.",
      "قلّب البصل والطماطم في الزيت حتى يصبح الخليط متكرملاً ثم أضف معجون الطماطم والبهارات.",
      "اسكب مرق الروبيان والليمون المجفف واتركه يغلي 5 دقائق.",
      "أضف الأرز واطهه حتى يكاد ينضج ثم رتب الروبيان المتبل فوقه.",
      "غط القدر واتركه يتبخر 10 دقائق ثم أنه الطبق بالأعشاب والفلفل المقلي والطماطم المحمصة.",
    ],
    tipEN:
      "Season the shrimp separately with smoked paprika so they stay snappy when steamed.",
    tipAR: "تبّل الروبيان منفصلاً بالفلفل المدخن ليبقى متماسكاً عند التبخير.",
    seoENTitle: "Gulf Shrimp Machboos Recipe | Diamond Castle Jasmine",
    seoENDescription:
      "Coastal machboos layered with Diamond Castle Jasmine rice, shrimp stock, and saffron.",
    seoARTitle: "مجبوس روبيان بأرز دايموند كاسل جاسمين",
    seoARDescription:
      "وصفة مجبوس بحرية بطبقات من الأرز الجاسمين ومرق الروبيان والزعفران.",
  },
  {
    slug: "/recipes/coconut-lime-rice-salad",
    titleEN: "Coconut Lime Celebration Rice Salad",
    titleAR: "سلطة الأرز بجوز الهند والليمون",
    heroIntroEN:
      "Chilled basmati dressed with coconut milk, lime, and tropical fruit shows how versatile Diamond Castle rice can be.",
    heroIntroAR:
      "أرز بسمتي مبرد مغطى بحليب جوز الهند والليمون والفواكه الاستوائية يبرز مرونة أرز دايموند كاسل.",
    heroBodyEN:
      "It feels luxurious yet light—ideal for wellness menus, summer events, or make-ahead corporate lunches.",
    heroBodyAR:
      "يبدو فاخراً وخفيفاً في آنٍ واحد، مثالي لقوائم العافية أو فعاليات الصيف أو وجبات الشركات الجاهزة.",
    highlightsEN: [
      "Diamond Castle basmati absorbs coconut milk without turning sticky.",
      "Serve chilled for summer activations or wellness programs.",
      "Studded with mango, herbs, and toasted coconut for color.",
    ],
    highlightsAR: [
      "يمتص أرز دايموند كاسل البسمتي حليب جوز الهند من دون أن يصبح لزجاً.",
      "يُقدّم بارداً لفعاليات الصيف أو برامج العافية.",
      "مزدان بقطع المانجو والأعشاب وجوز الهند المحمص للألوان.",
    ],
    servingsEN: "Serves 10 as a salad or side.",
    servingsAR: "يكفي 10 أشخاص كسلطة أو طبق جانبي.",
    cookTimeEN: "Total time: 35 minutes plus chilling.",
    cookTimeAR: "الوقت الإجمالي: 35 دقيقة مع وقت التبريد.",
    occasionEN:
      "Great for corporate wellness lunches, outdoor buffets, or live cooking stations.",
    occasionAR:
      "مثالي لغداءات العافية للشركات أو البوفيهات الخارجية أو محطات الطهي الحية.",
    ingredientsEN: [
      "2 cups Diamond Castle basmati rice, rinsed",
      "1 can full-fat coconut milk plus water to reach 3 cups",
      "Zest and juice of 2 limes",
      "1 cup diced mango or pineapple",
      "1/2 cup toasted coconut flakes",
      "1/2 cup edamame or green peas",
      "1 small cucumber, diced",
      "Fresh cilantro, Thai basil, and chili flakes",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل بسمتي، مغسول",
      "علبة حليب جوز هند كاملة الدسم مع ماء حتى نصل إلى 3 أكواب",
      "برش وعصير 2 ليمون",
      "1 كوب مانجو أو أناناس مقطع مكعبات",
      "نصف كوب رقائق جوز هند محمصة",
      "نصف كوب إدامامي أو بازلاء خضراء",
      "1 خيار صغير مقطع",
      "كزبرة طازجة وريحان تايلاندي ورقائق فلفل حار",
    ],
    stepsEN: [
      "Cook the rice with coconut milk, water, lime zest, and a pinch of salt until tender.",
      "Spread onto a tray, drizzle with half the lime juice, and cool completely.",
      "Fold in mango, cucumber, edamame, herbs, and remaining lime juice.",
      "Season with chili flakes and adjust salt to taste.",
      "Top with toasted coconut just before serving and keep chilled.",
    ],
    stepsAR: [
      "اطه الأرز مع حليب جوز الهند والماء وبرش الليمون ورشة ملح حتى ينضج.",
      "افرد الأرز على صينية ورش نصف عصير الليمون واتركه يبرد تماماً.",
      "اخلط المانجو والخيار والإدامامي والأعشاب مع ما تبقى من عصير الليمون.",
      "تبّل برقائق الفلفل وعدّل الملح حسب الذوق.",
      "أضف جوز الهند المحمص قبل التقديم واحتفظ بالسلطة مبردة.",
    ],
    tipEN:
      "Rinse the rice lightly so a touch of starch remains to emulsify the coconut dressing.",
    tipAR:
      "اشطف الأرز بسرعة ليبقى قليل من النشاء فيساعد على مزج صلصة جوز الهند.",
    seoENTitle: "Coconut Lime Rice Salad | Diamond Castle",
    seoENDescription:
      "Cooling coconut-lime rice salad with Diamond Castle basmati, mango, and herbs.",
    seoARTitle: "سلطة أرز جوز الهند والليمون بديموند كاسل",
    seoARDescription:
      "سلطة مبردة بحليب جوز الهند والليمون والمانجو مع أرز دايموند كاسل البسمتي.",
  },
  {
    slug: "/recipes/smoky-lamb-ouzi",
    titleEN: "Smoky Lamb Ouzi Rice Tray",
    titleAR: "صينية أوزي لحم مدخن",
    heroIntroEN:
      "Slow-roasted lamb shanks melt into Diamond Castle long-grain rice perfumed with cardamom smoke.",
    heroIntroAR:
      "سيقان لحم الضأن المشوي ببطء تذوب في أرز دايموند كاسل طويل الحبة المعطر بدخان الهيل.",
    heroBodyEN:
      "We bake the rice under foil, then finish uncovered for a bronzed top—ready for VIP banquets.",
    heroBodyAR:
      "نخبز الأرز مغطى ثم نكشفه لنحصل على سطح برونزي جاهز لولائم كبار الشخصيات.",
    highlightsEN: [
      "Diamond Castle long grain stays separate under low-and-slow cooking.",
      "Smoked cardamom butter perfumes the entire tray.",
      "Topped with roasted nuts and baby carrots for drama.",
    ],
    highlightsAR: [
      "تحافظ حبات دايموند كاسل الطويلة على تماسكها مع الطهي البطيء.",
      "زبدة الهيل المدخنة تعطّر الصينية بأكملها.",
      "تُزَيَّن بالمكسرات والجزر الصغير لمشهد مبهر.",
    ],
    servingsEN: "Serves 10 on a banquet tray.",
    servingsAR: "يكفي 10 أشخاص على صينية ولائم.",
    cookTimeEN: "Total time: 3 hours including roasting.",
    cookTimeAR: "الوقت الإجمالي: 3 ساعات مع التحميص.",
    occasionEN: "Designed for hotel buffets, weddings, or diplomatic dinners.",
    occasionAR: "مصمم لبوفيهات الفنادق أو الأعراس أو الولائم الدبلوماسية.",
    ingredientsEN: [
      "3 cups Diamond Castle long-grain rice, soaked",
      "3 lamb shanks, seasoned",
      "2 onions, sliced",
      "4 tbsp ghee",
      "1 tbsp cardamom pods plus 2 bay leaves",
      "4 cups lamb stock",
      "1 cup mixed nuts and baby carrots, roasted",
      "Smoked paprika, salt, and pepper",
    ],
    ingredientsAR: [
      "3 أكواب من أرز دايموند كاسل طويل الحبة، منقوع",
      "3 سيقان لحم ضأن متبلة",
      "2 بصلة مقطعة شرائح",
      "4 ملاعق كبيرة سمن",
      "1 ملعقة كبيرة حبوب هيل + ورقتا غار",
      "4 أكواب من مرق اللحم",
      "1 كوب مكسرات مشكلة وجزر صغير محمص",
      "فلفل مدخن وملح وفلفل أسود",
    ],
    stepsEN: [
      "Sear the lamb shanks in ghee until browned, then remove.",
      "Caramelize onions with cardamom and bay leaves in the same pan.",
      "Add rice, lamb stock, and spices; bring to a gentle simmer.",
      "Nestle shanks on top, cover tightly with foil, and bake at 180°C for 90 minutes.",
      "Uncover, baste with smoked paprika butter, add nuts and carrots, and bake 15 minutes more.",
    ],
    stepsAR: [
      "حمّر سيقان اللحم في السمن حتى تكتسب لوناً بنياً ثم ارفعها.",
      "كرمل البصل مع الهيل وورق الغار في نفس القدر.",
      "أضف الأرز ومرق اللحم والتوابل واتركه يغلي بخفة.",
      "ضع السيقان فوق الأرز وغطِ بإحكام واخبز على 180 درجة مئوية لمدة 90 دقيقة.",
      "اكشف الغطاء وادهن بزبدة الفلفل المدخن وأضف المكسرات والجزر واخبز 15 دقيقة إضافية.",
    ],
    tipEN:
      "Rest the tray for 15 minutes before service so the rice reabsorbs the lamb juices.",
    tipAR:
      "اترك الصينية لترتاح 15 دقيقة قبل التقديم ليعيد الأرز امتصاص عصائر اللحم.",
    seoENTitle: "Smoky Lamb Ouzi Tray | Diamond Castle Rice",
    seoENDescription:
      "Banquet-ready lamb ouzi baked over Diamond Castle long-grain rice.",
    seoARTitle: "صينية أوزي لحم مدخن بأرز دايموند كاسل",
    seoARDescription: "أوزي ولائم بسيقان لحم ضأن وأرز دايموند كاسل طويل الحبة.",
  },
  {
    slug: "/recipes/cardamom-rose-rice-pudding",
    titleEN: "Cardamom Rose Rice Pudding Parfait",
    titleAR: "بارفيه أرز بحليب الهيل والورد",
    heroIntroEN:
      "Silky rice pudding layered with rose mascarpone shows Diamond Castle rice in dessert form.",
    heroIntroAR:
      "مهلبية أرز مخملية بطبقات ماسكاربوني الورد تُظهر جانب الحلوى من أرز دايموند كاسل.",
    heroBodyEN:
      "We cook the grains low and slow with cardamom, then fold in whipped cream for a glass-ready parfait.",
    heroBodyAR:
      "نطهو الحبات على نار هادئة مع الهيل ثم نخلطها بالكريمة المخفوقة لتحضير بارفيه جاهز للتقديم.",
    highlightsEN: [
      "Diamond Castle basmati stays tender yet holds texture in pudding.",
      "Layered with rosewater mascarpone and roasted pistachios.",
      "Portioned in glasses for buffets or afternoon tea.",
    ],
    highlightsAR: [
      "تحافظ حبات دايموند كاسل البسمتي على قوامها في الحلويات.",
      "طبقات من ماسكاربوني الورد والفستق المحمص.",
      "مقسمة في كؤوس جاهزة للبوفيه أو شاي بعد الظهر.",
    ],
    servingsEN: "Makes 12 parfait glasses.",
    servingsAR: "يُحضّر 12 كوب بارفيه.",
    cookTimeEN: "Total time: 50 minutes plus chilling.",
    cookTimeAR: "الوقت الإجمالي: 50 دقيقة مع التبريد.",
    occasionEN:
      "Ideal for afternoon tea towers, Ramadan dessert bars, or retail sampling.",
    occasionAR:
      "مثالي لأبراج الشاي بعد الظهر أو بارات التحلية الرمضانية أو تذوق المتاجر.",
    ingredientsEN: [
      "1 cup Diamond Castle basmati rice, rinsed",
      "4 cups whole milk",
      "1/2 cup sugar or condensed milk",
      "6 cardamom pods, crushed",
      "2 tbsp rose water",
      "1 cup whipped cream or mascarpone",
      "1/2 cup chopped pistachios",
      "Dried rose petals and honey for garnish",
    ],
    ingredientsAR: [
      "1 كوب من أرز دايموند كاسل بسمتي، مغسول",
      "4 أكواب حليب كامل الدسم",
      "نصف كوب سكر أو حليب مكثف محلى",
      "6 حبات هيل مهروسة",
      "2 ملعقة كبيرة ماء ورد",
      "1 كوب كريمة مخفوقة أو ماسكاربوني",
      "نصف كوب فستق مفروم",
      "بتلات ورد مجففة وعسل للتزيين",
    ],
    stepsEN: [
      "Simmer rice, milk, sugar, and cardamom over low heat until thick and creamy.",
      "Remove the pods, stir in rose water, and cool to room temperature.",
      "Fold in whipped cream or mascarpone for extra body.",
      "Layer pudding in glasses with pistachios and honey.",
      "Chill for at least 2 hours and garnish with rose petals before serving.",
    ],
    stepsAR: [
      "اغل الأرز والحليب والسكر والهيل على نار هادئة حتى يصبح الخليط كثيفاً وكريمياً.",
      "أزل حبات الهيل وأضف ماء الورد ثم اترك المزيج يبرد إلى درجة حرارة الغرفة.",
      "اخلط الكريمة المخفوقة أو الماسكاربوني لتحصل على قوام غني.",
      "قسّم المهلبية في كؤوس وطبّقها مع الفستق والعسل.",
      "برّدها لمدة ساعتين على الأقل وزيّنها ببتلات الورد قبل التقديم.",
    ],
    tipEN:
      "Keep the pudding moving with a rubber spatula so the milk never scorches.",
    tipAR: "حرّك المهلبية باستمرار بملعقة سيليكون كي لا يحترق الحليب.",
    seoENTitle: "Cardamom Rose Rice Pudding | Diamond Castle",
    seoENDescription:
      "Creamy cardamom rice pudding parfait layered with rose mascarpone and pistachios.",
    seoARTitle: "مهلبية أرز بالهيل والورد من دايموند كاسل",
    seoARDescription:
      "بارفيه أرز مخملي بالهيل وماء الورد مع فستق محمص لبوفيهات الحلويات.",
  },
  {
    slug: "/recipes/crispy-golden-rice-peppers",
    titleEN: "Crispy Peppers Stuffed with Golden Rice",
    titleAR: "فلفل محشي بأرز ذهبي مقرمش",
    heroIntroEN:
      "Sweet peppers blister in the oven while Diamond Castle rice inside stays fluffy and aromatic.",
    heroIntroAR:
      "يتفحم الفلفل الحلو في الفرن بينما يبقى أرز دايموند كاسل في الداخل منفوشاً وعطراً.",
    heroBodyEN:
      "Serve these as premium mezze bites or plated starters—turmeric and saffron give the grains a golden hue.",
    heroBodyAR:
      "قدّمها كمقبلات فاخرة أو كطبق بداية؛ يمنح الكركم والزعفران الحبات صبغة ذهبية.",
    highlightsEN: [
      "Diamond Castle grains hold structure even after double cooking.",
      "Turmeric-saffron butter tints the rice naturally.",
      "Roasted until the pepper edges blister for smoky sweetness.",
    ],
    highlightsAR: [
      "تحافظ حبات دايموند كاسل على قوامها حتى بعد الطهي المزدوج.",
      "زبدة الكركم والزعفران تلوّن الأرز طبيعياً.",
      "يُشوى الفلفل حتى تتشكل فقاعات لذيذة على الأطراف.",
    ],
    servingsEN: "Makes 16 stuffed pepper halves.",
    servingsAR: "يحضّر 16 نصف فلفل محشي.",
    cookTimeEN: "Total time: 70 minutes including roasting.",
    cookTimeAR: "الوقت الإجمالي: 70 دقيقة مع التحميص.",
    occasionEN:
      "Great for mezze spreads, catering trays, or vegetarian tasting menus.",
    occasionAR: "مثالي لأطباق المزّة وصواني الضيافة أو قوائم التذوق النباتية.",
    ingredientsEN: [
      "2 cups Diamond Castle basmati rice",
      "8 sweet bell peppers, halved and seeded",
      "3 tbsp olive oil",
      "1 onion, finely diced",
      "1 tsp turmeric plus pinch saffron",
      "2 tbsp tomato paste",
      "3 cups vegetable or chicken stock",
      "Pomegranate seeds, parsley, and mint to finish",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل بسمتي",
      "8 حبات فلفل حلو مقطعة أنصافاً ومنزوعة البذور",
      "3 ملاعق كبيرة زيت زيتون",
      "1 بصلة مفرومة ناعماً",
      "1 ملعقة صغيرة كركم مع رشة زعفران",
      "2 ملعقة كبيرة معجون طماطم",
      "3 أكواب من مرق الخضار أو الدجاج",
      "حبوب رمان وبقدونس ونعناع للتقديم",
    ],
    stepsEN: [
      "Par-cook the rice with stock, turmeric, saffron, and tomato paste until al dente.",
      "Sauté the onion in olive oil, fold it into the rice, and adjust seasoning.",
      "Fill the pepper halves, drizzle with the remaining oil, and arrange on trays.",
      "Roast at 200°C for 25 minutes covered, then uncover to blister for 10 minutes.",
      "Finish with herbs and pomegranate seeds before serving warm or at room temperature.",
    ],
    stepsAR: [
      "اسلق الأرز جزئياً مع المرق والكركم والزعفران ومعجون الطماطم حتى يصبح نصف ناضج.",
      "قلّب البصل في زيت الزيتون ثم امزجه مع الأرز وعدّل التتبيل.",
      "احشِ أنصاف الفلفل بالأرز ورش ما تبقى من الزيت ورتبها في صواني.",
      "اخبز على 200 درجة مئوية لمدة 25 دقيقة وهي مغطاة ثم اكشفها لتتشوى 10 دقائق إضافية.",
      "أنه الطبق بالأعشاب وحبوب الرمان وقدمه ساخناً أو بدرجة الغرفة.",
    ],
    tipEN:
      "Brush the pepper edges with oil to encourage blistering without drying the rice.",
    tipAR: "ادهن حواف الفلفل بالزيت لتتشكل فقاعات الشوي من دون أن يجف الأرز.",
    seoENTitle: "Stuffed Peppers with Diamond Castle Rice",
    seoENDescription:
      "Golden saffron rice baked inside blistered peppers for mezze or plated starters.",
    seoARTitle: "فلفل محشي بأرز دايموند كاسل الذهبي",
    seoARDescription:
      "مقبلات فاخرة من فلفل محشو بأرز الزعفران من دايموند كاسل مع حبوب الرمان.",
  },
  {
    slug: "/recipes/mushroom-truffle-rice",
    titleEN: "Wild Mushroom Truffle Rice Skillet",
    titleAR: "مقلاة أرز الفطر البري بالكمأة",
    heroIntroEN:
      "Earthy mushrooms and truffle oil coat Diamond Castle Sella grains for a luxe vegetarian centerpiece.",
    heroIntroAR:
      "فطر بري وزيت كمأة يغلفان حبات أرز دايموند كاسل سيلا لطبق نباتي فاخر.",
    heroBodyEN:
      "Cooked like risotto but finished fluffy, it shows clients how versatile the grains can be.",
    heroBodyAR:
      "نطهوه مثل الريزوتو ثم نفلّكه ليبقى منفوشاً، لإبراز تعدد استخدام الحبوب.",
    highlightsEN: [
      "Diamond Castle Sella withstands constant stirring without breaking.",
      "Layered mushrooms deliver umami depth without meat.",
      "Finished with truffle oil and crispy shallots.",
    ],
    highlightsAR: [
      "يتحمل أرز دايموند كاسل سيلا التحريك المستمر دون أن يتكسر.",
      "طبقات الفطر تمنح عمق أومامي من دون لحم.",
      "يُنهي بزيت الكمأة وكراث مقرمش فاخر.",
    ],
    servingsEN: "Serves 6 as a vegetarian main.",
    servingsAR: "يكفي 6 أشخاص كطبق نباتي رئيسي.",
    cookTimeEN: "Total time: 45 minutes.",
    cookTimeAR: "الوقت الإجمالي: 45 دقيقة.",
    occasionEN:
      "Perfect for modern banquets, chef stations, or plant-forward tastings.",
    occasionAR:
      "مثالي للولائم العصرية أو محطات الطهاة أو قوائم التذوق النباتية.",
    ingredientsEN: [
      "2 cups Diamond Castle Sella rice",
      "500 g mixed wild mushrooms, sliced",
      "3 tbsp olive oil plus 2 tbsp butter",
      "1 shallot, minced",
      "2 cloves garlic, minced",
      "1/2 cup white grape juice or cooking wine",
      "4 cups hot vegetable stock",
      "1 tbsp truffle oil plus crispy shallots and herbs",
    ],
    ingredientsAR: [
      "2 كوب من أرز دايموند كاسل سيلا",
      "500 غرام من الفطر البري المشكل المقطع",
      "3 ملاعق كبيرة زيت زيتون + 2 ملعقة كبيرة زبدة",
      "1 كراث صغير مفروم ناعماً",
      "2 فص ثوم مفروم",
      "نصف كوب عصير عنب أبيض أو نبيذ طبخ",
      "4 أكواب من مرق الخضار الساخن",
      "1 ملعقة كبيرة زيت كمأة مع شرائح كراث مقرمشة وأعشاب",
    ],
    stepsEN: [
      "Sear the mushrooms in batches until deeply browned; season and set aside.",
      "Sauté shallot and garlic in butter, add the rice, and toast until translucent.",
      "Deglaze with grape juice, then add warm stock a ladle at a time while stirring.",
      "Once the rice is tender with a slight bite, fold the mushrooms back in.",
      "Finish with butter, truffle oil, and top with crispy shallots and herbs.",
    ],
    stepsAR: [
      "حمّر الفطر على دفعات حتى يكتسب لوناً بنياً عميقاً ثم تبّله وضعه جانباً.",
      "قلّب الكراث والثوم في الزبدة ثم أضف الأرز وحمّصه حتى يصبح شبه شفاف.",
      "اطفِ عصير العنب ثم أضف المرق الساخن مغرفة تلو الأخرى مع التحريك.",
      "عندما يصبح الأرز طرياً مع قوام متماسك أعد الفطر إلى القدر.",
      "أنه الطبق بالزبدة وزيت الكمأة وزينه بشرائح الكراث المقرمشة والأعشاب.",
    ],
    tipEN:
      "Warm the stock separately so the rice cooks evenly without turning gluey.",
    tipAR:
      "احتفظ بالمرق ساخناً في قدر منفصل ليطهى الأرز بالتساوي من دون أن يصبح معجناً.",
    seoENTitle: "Wild Mushroom Truffle Rice | Diamond Castle",
    seoENDescription:
      "Luxe mushroom and truffle rice skillet built on Diamond Castle Sella grains.",
    seoARTitle: "أرز الفطر البري بالكمأة من دايموند كاسل",
    seoARDescription:
      "مقلاة أرز نباتية فاخرة بالفطر البري وزيت الكمأة مع أرز دايموند كاسل سيلا.",
  },
  {
    slug: "/recipes/date-almond-breakfast-rice",
    titleEN: "Date & Almond Breakfast Rice Bowls",
    titleAR: "أطباق فطور الأرز بالتمر واللوز",
    heroIntroEN:
      "A make-ahead breakfast where Diamond Castle rice simmers with almond milk, dates, and tahini.",
    heroIntroAR:
      "وجبة فطور جاهزة حيث يُطهى أرز دايموند كاسل مع حليب اللوز والتمر والطحينة.",
    heroBodyEN:
      "Portion into jars for retail or hotel amenities—serve warm with fruit or chilled with yogurt.",
    heroBodyAR:
      "قسّمه في برطمانات للبيع أو لضيافة الفنادق، وقدمه دافئاً مع الفاكهة أو بارداً مع اللبن.",
    highlightsEN: [
      "Diamond Castle grains stay creamy yet distinct in almond milk.",
      "Sweetened naturally with Medjool dates.",
      "Packable for grab-and-go service.",
    ],
    highlightsAR: [
      "يبقى أرز دايموند كاسل كريمياً في حليب اللوز دون أن يذوب.",
      "محلّى طبيعياً بتمر المدجول.",
      "سهل التعبئة للخدمة السريعة أثناء التنقل.",
    ],
    servingsEN: "Makes 8 breakfast bowls or jars.",
    servingsAR: "يُحضّر 8 أطباق أو برطمانات فطور.",
    cookTimeEN: "Total time: 35 minutes plus chilling if desired.",
    cookTimeAR: "الوقت الإجمالي: 35 دقيقة مع إمكانية التبريد.",
    occasionEN:
      "Built for hotel amenities, corporate pantries, or retail sampling.",
    occasionAR: "مصمم لامتيازات الفنادق أو مخازن الشركات أو تذوق التجزئة.",
    ingredientsEN: [
      "1.5 cups Diamond Castle basmati rice, rinsed",
      "4 cups unsweetened almond milk",
      "8 Medjool dates, chopped",
      "2 tbsp tahini",
      "1 tsp cinnamon plus pinch of salt",
      "1/2 cup toasted sliced almonds",
      "1 cup seasonal berries or figs",
      "Honey or date syrup for serving",
    ],
    ingredientsAR: [
      "1.5 كوب من أرز دايموند كاسل بسمتي، مغسول",
      "4 أكواب حليب لوز غير محلى",
      "8 حبات تمر مدجول مفرومة",
      "2 ملعقة كبيرة طحينة",
      "1 ملعقة صغيرة قرفة مع رشة ملح",
      "نصف كوب لوز شرائح محمص",
      "1 كوب من التوت الموسمي أو التين",
      "عسل أو دبس تمر للتقديم",
    ],
    stepsEN: [
      "Simmer the rice with almond milk, dates, cinnamon, and salt until creamy.",
      "Stir in tahini for richness and let cool slightly.",
      "Portion into jars or bowls and top with toasted almonds.",
      "Add berries or figs and drizzle with honey before serving.",
      "Serve warm for breakfast buffets or chill for grab-and-go.",
    ],
    stepsAR: [
      "اطه الأرز مع حليب اللوز والتمر والقرفة والملح حتى يصبح كريمياً.",
      "أضف الطحينة للحصول على قوام غني واتركه يبرد قليلاً.",
      "قسّم الخليط في برطمانات أو أطباق وزينه باللوز المحمص.",
      "أضف التوت أو التين ورش العسل قبل التقديم.",
      "قدمه دافئاً لبوفيه الفطور أو بارداً كخيار جاهز للتناول.",
    ],
    tipEN:
      "Blend two of the dates into the almond milk first so sweetness is evenly distributed.",
    tipAR:
      "اخلط حبتين من التمر مع حليب اللوز بالخلاط أولاً ليتوزع الحلاوة بالتساوي.",
    seoENTitle: "Breakfast Rice Bowls with Dates & Almonds",
    seoENDescription:
      "Creamy almond-milk rice bowls sweetened with Medjool dates and toasted nuts.",
    seoARTitle: "فطور أرز بالتمر واللوز من دايموند كاسل",
    seoARDescription:
      "أطباق فطور كريمية بحليب اللوز والتمر واللوز المحمص جاهزة للتقديم أو الحمل.",
  },
  {
    slug: "/recipes/green-harissa-vegetable-rice",
    titleEN: "Green Harissa Roasted Vegetable Rice",
    titleAR: "أرز الخضار المحمصة بالهريسة الخضراء",
    heroIntroEN:
      "Roasted zucchini, cauliflower, and green harissa fold through Diamond Castle rice for a plant-forward main.",
    heroIntroAR:
      "خضار محمصة وهريسة خضراء تمتزج مع أرز دايموند كاسل لطبق نباتي غني.",
    heroBodyEN:
      "Ideal for modern buffets where color matters—the grains stay bright and separate.",
    heroBodyAR:
      "مثالي للبوفيهات العصرية حيث يظل اللون أخضر زاهياً والحبات منفصلة.",
    highlightsEN: [
      "Diamond Castle long grain stays fluffy even after tossing in harissa.",
      "Roasted vegetables add charred sweetness and body.",
      "Vibrant green herbs keep the platter photo-ready for hours.",
    ],
    highlightsAR: [
      "يبقى أرز دايموند كاسل طويل الحبة منفوشاً حتى بعد مزجه بالهريسة.",
      "الخضار المحمصة تضيف حلاوة مدخنة وقواماً مشبعاً.",
      "الأعشاب الخضراء تحافظ على حيوية الطبق لساعات.",
    ],
    servingsEN: "Serves 12 as a plant-forward main.",
    servingsAR: "يكفي 12 شخصاً كطبق نباتي رئيسي.",
    cookTimeEN: "Total time: 60 minutes including roasting.",
    cookTimeAR: "الوقت الإجمالي: 60 دقيقة مع التحميص.",
    occasionEN:
      "Built for wellness buffets, executive lounges, or retail tastings.",
    occasionAR: "مصمم لبوفيهات العافية أو صالات التنفيذيين أو تذوق التجزئة.",
    ingredientsEN: [
      "2.5 cups Diamond Castle long-grain rice",
      "3 cups vegetable stock",
      "1 cup roasted cauliflower florets",
      "1 cup roasted zucchini and green beans",
      "1/2 cup roasted chickpeas",
      "1/3 cup green harissa or herb paste",
      "1 bunch coriander and parsley, chopped",
      "Olive oil, lemon zest, and sumac to finish",
    ],
    ingredientsAR: [
      "2.5 كوب من أرز دايموند كاسل طويل الحبة",
      "3 أكواب من مرق الخضار",
      "1 كوب زهرات قرنبيط محمصة",
      "1 كوب كوسا وفاصوليا خضراء محمصة",
      "نصف كوب حمص محمص",
      "ثلث كوب هريسة خضراء أو معجون أعشاب",
      "حزمة كزبرة وبقدونس مفرومة",
      "زيت زيتون وبرش ليمون وسماق للتقديم",
    ],
    stepsEN: [
      "Cook the rice in vegetable stock until fluffy, then spread on trays to cool slightly.",
      "Roast cauliflower, zucchini, beans, and chickpeas until caramelized.",
      "Fold the vegetables into the rice with green harissa and herbs.",
      "Adjust seasoning with lemon zest, sumac, and olive oil.",
      "Hold warm or at room temperature; refresh with more herbs before service.",
    ],
    stepsAR: [
      "اطه الأرز في مرق الخضار حتى ينتفخ ثم افرده على صواني ليبرد قليلاً.",
      "حمّص القرنبيط والكوسا والفاصوليا والحمص حتى تتكرمل.",
      "اخلط الخضار مع الأرز والهريسة الخضراء والأعشاب.",
      "عدّل التتبيل ببرش الليمون والسماق وزيت الزيتون.",
      "قدمه دافئاً أو بحرارة الغرفة وجدد الأعشاب قبل التقديم.",
    ],
    tipEN:
      "Fold the harissa in while the rice is warm so the herbs release their oils without darkening.",
    tipAR:
      "أضف الهريسة والأعشاب والأرز لا يزال دافئاً لتطلق زيوتها من دون أن يتغير لونها.",
    seoENTitle: "Green Harissa Vegetable Rice | Diamond Castle",
    seoENDescription:
      "Plant-forward rice with roasted vegetables, green harissa, and Diamond Castle grains.",
    seoARTitle: "أرز الخضار بالهريسة الخضراء من دايموند كاسل",
    seoARDescription:
      "طبق نباتي ملون من أرز دايموند كاسل مع خضار محمصة وهريسة خضراء منعشة.",
  },
];

type Section = {
  key: string;
  label?: string;
  style?: Record<string, any>;
  rows?: any[];
  blocks?: any[];
};

function buildSections(recipe: RecipeSeed): Section[] {
  return [
    {
      key: "hero",
      label: "Hero",
      style: {
        background: "cream",
        container: "wide",
        paddingTop: { base: "xl" },
        paddingBottom: { base: "lg" },
      },
      rows: [
        {
          gap: { base: "md" },
          columns: [
            {
              span: { base: 12, md: 7 },
              blocks: [
                {
                  type: "heading",
                  level: 1,
                  textEN: recipe.titleEN,
                  textAR: recipe.titleAR,
                },
                {
                  type: "paragraph",
                  textEN: recipe.heroIntroEN,
                  textAR: recipe.heroIntroAR,
                },
                {
                  type: "paragraph",
                  textEN: recipe.heroBodyEN,
                  textAR: recipe.heroBodyAR,
                },
                {
                  type: "button",
                  labelEN: "Book a tasting",
                  labelAR: "احجز جلسة تذوق",
                  href: "/contact",
                  style: "primary",
                },
              ],
            },
            {
              span: { base: 12, md: 5 },
              blocks: [
                {
                  type: "heading",
                  level: 3,
                  textEN: "Why it shines",
                  textAR: "لماذا يبهرك",
                },
                {
                  type: "list",
                  itemsEN: recipe.highlightsEN,
                  itemsAR: recipe.highlightsAR,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "quick-facts",
      label: "Quick Facts",
      style: {
        background: "white",
        container: "normal",
        paddingTop: { base: "sm" },
        paddingBottom: { base: "sm" },
      },
      rows: [
        {
          gap: { base: "md" },
          columns: [
            {
              span: { base: 12, md: 4 },
              blocks: [
                {
                  type: "heading",
                  level: 4,
                  textEN: "Servings",
                  textAR: "عدد الحصص",
                },
                {
                  type: "paragraph",
                  textEN: recipe.servingsEN,
                  textAR: recipe.servingsAR,
                },
              ],
            },
            {
              span: { base: 12, md: 4 },
              blocks: [
                {
                  type: "heading",
                  level: 4,
                  textEN: "Timing",
                  textAR: "الوقت",
                },
                {
                  type: "paragraph",
                  textEN: recipe.cookTimeEN,
                  textAR: recipe.cookTimeAR,
                },
              ],
            },
            {
              span: { base: 12, md: 4 },
              blocks: [
                {
                  type: "heading",
                  level: 4,
                  textEN: "Best occasion",
                  textAR: "أفضل مناسبة",
                },
                {
                  type: "paragraph",
                  textEN: recipe.occasionEN,
                  textAR: recipe.occasionAR,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "ingredients",
      label: "Ingredients",
      style: {
        background: "white",
        container: "normal",
        paddingTop: { base: "md" },
        paddingBottom: { base: "md" },
        dividerTop: true,
      },
      blocks: [
        {
          type: "heading",
          level: 2,
          textEN: "Ingredients",
          textAR: "المكونات",
        },
        {
          type: "paragraph",
          textEN: "Measure precisely to showcase Diamond Castle texture.",
          textAR: "اضبط المقادير بدقة لإبراز قوام دايموند كاسل.",
        },
        {
          type: "list",
          itemsEN: recipe.ingredientsEN,
          itemsAR: recipe.ingredientsAR,
        },
      ],
    },
    {
      key: "method",
      label: "Method",
      style: {
        background: "cream",
        container: "normal",
        paddingTop: { base: "md" },
        paddingBottom: { base: "md" },
      },
      blocks: [
        {
          type: "heading",
          level: 2,
          textEN: "Method",
          textAR: "طريقة التحضير",
        },
        {
          type: "list",
          ordered: true,
          itemsEN: recipe.stepsEN,
          itemsAR: recipe.stepsAR,
        },
      ],
    },
    {
      key: "tip",
      label: "Chef tip",
      style: {
        background: "white",
        container: "narrow",
        paddingTop: { base: "sm" },
        paddingBottom: { base: "lg" },
      },
      blocks: [
        {
          type: "quote",
          textEN: recipe.tipEN,
          textAR: recipe.tipAR,
          citeEN: "Diamond Castle Culinary Team",
          citeAR: "فريق دايموند كاسل للطهي",
        },
        {
          type: "button",
          labelEN: "Add to menu",
          labelAR: "أضفها إلى قائمتك",
          href: "/contact",
          style: "secondary",
        },
      ],
    },
  ];
}

async function seedRecipePages() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    for (const recipe of recipes) {
      const sections = buildSections(recipe);
      const payload = {
        slug: recipe.slug,
        status: "published",
        template: "landing",
        en: {
          title: recipe.titleEN,
          seo: {
            title: recipe.seoENTitle,
            description: recipe.seoENDescription,
          },
          sections,
        },
        ar: {
          title: recipe.titleAR,
          seo: {
            title: recipe.seoARTitle,
            description: recipe.seoARDescription,
          },
          sections: JSON.parse(JSON.stringify(sections)),
        },
      };

      const result = await Page.findOneAndUpdate(
        { slug: recipe.slug },
        payload,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`✓ Seeded page: ${result.en.title} (${result.slug})`);
    }

    console.log(`\n✅ Seeded ${recipes.length} recipe pages.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding recipe pages:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedRecipePages();
