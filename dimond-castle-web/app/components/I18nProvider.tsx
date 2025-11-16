"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguageCode = "en" | "ar";

type Translations = Record<string, string>;

type Dictionaries = Record<LanguageCode, Translations>;

const dictionaries: Dictionaries = {
  en: {
    "nav.home": "Home",
    "nav.story": "Story",
    "nav.vision": "Vision",
    "nav.products": "Products",
    "nav.clients": "Clients",
    "nav.services": "Services",
    "nav.contact": "Contact Us",
    "nav.blog": "Blog",
    "lang.ar": "AR",
    "lang.en": "EN",
    "nav.aria.home": "Diamond Castle Home",
    "nav.aria.toggle": "Toggle main menu",
    "brand.short": "DC",
    "brand.full": "Diamond Castle",
    "hero.title.leading": "White Diamond",
    "hero.title.trailing": "The Crown Jewel of Rice",
    "hero.subtitle": "From Diamond Castle Trading Company, the \"White Diamond\" brand symbolizes purity, heritage, and perfection — the choice of premium rice buyers worldwide.",
    "hero.imageAlt": "Luxurious rice feast with roasted chicken, nuts, and tea service",
    "hero.cta.view": "View White Diamond Rice",
    "hero.cta.learn": "Learn More About Us",
    "hero.scroll": "Scroll",
    "story.since": "Since 2015",
    "story.heading": "Introduction & Story",
    "story.imageAlt": "Biryani and rice feast showcasing our premium rice products",
    "story.p1": "We are a company established in 2015 in the rice sector within the Kingdom of Saudi Arabia, driven by a clear vision to provide high-quality rice products that meet the needs of the local market and exceed consumer expectations.",
    "story.p2": "Since our inception, we have focused on building strong partnerships with the world's best suppliers and establishing an advanced distribution network that ensures our products reach all regions of the Kingdom efficiently and with superior quality.",
    "story.p3": "Today, we continue to grow confidently and consistently within this sector, remaining dedicated to being a trusted company that delivers only the finest rice to consumers across Saudi Arabia.",
    "story.b1": "Our company was founded on the belief that food is a fundamental pillar of community life, and on our commitment to contributing to the enhancement of food security in the Kingdom by offering reliable and premium rice.",
    "story.b2": "Since our inception, we have focused on building strong partnerships with the world's best suppliers and establishing an advanced distribution network that ensures our products reach all regions of the Kingdom efficiently and with superior quality.",
    "story.b3": "Today, we continue to grow confidently and consistently within this sector, remaining dedicated to being a trusted company that delivers only the finest rice to consumers across Saudi Arabia.",
    "story.badge": "Trusted • KSA",
    "vision.heading": "Vision, Mission & Strategic Objectives",
    "vision.preamble": "Since its establishment, Diamond Castle Trading Company has built its foundation on a clear purpose, strong values, and guiding principles that define its unique corporate culture. Throughout our history, our business has evolved and diversified, yet our core mission and values have remained constant — passed down and upheld by every new generation of our employees.",
    "vision.card1.title": "Vision & Values",
    "vision.card1.body": "We operate strategically to enhance the lives of more consumers every day, uniting our efforts to achieve this goal in meaningful and practical ways. Our employees are driven to make a positive contribution daily, reflecting the company’s values and the behaviors that shape how we work together and with our partners. These principles guide the continuous evolution of how we conduct our business.",
    "vision.card2.title": "How We Operate",
    "vision.card2.body": "We operate strategically to enhance the lives of more consumers every day, uniting our efforts to achieve this goal in meaningful and practical ways. Our employees are driven to make a positive contribution daily, reflecting the company’s values and the behaviors that shape how we work together and with our partners. These principles guide the continuous evolution of how we conduct our business.",
    "vision.card3.title": "Our Goal — Today and for the Future",
    "vision.card3.body": "To deliver high-quality, high-value products and services that improve the lives of consumers across the Kingdom of Saudi Arabia. Our success is reflected not only in strong sales and profitability but also in the value we create for our customers, shareholders, and local communities. Through this commitment, we ensure the continuity of our culture and values for generations to come.",
    "values.heading": "Corporate Values & Objectives",
    "values.integrity.title": "Integrity",
    "values.integrity.body": "We consistently uphold honesty and transparency in all our dealings, conducting our business in line with both the letter and spirit of the law. Our values and principles are the compass that guides every decision and plan.",
    "values.leadership.title": "Leadership",
    "values.leadership.body": "Every individual in our company is a leader within their area of responsibility. We are committed to achieving pioneering results through a clear vision, strategic investment of our resources, and continuous development to overcome challenges and execute our plans successfully.",
    "values.ownership.title": "Ownership",
    "values.ownership.body": "We take full personal responsibility for our work, constantly improving our systems and supporting others to enhance the company’s performance. We see ourselves as true owners of Qalat Al-Almas, treating its assets as our own and focusing on its long-term success.",
    "values.passion.title": "Passion for Success",
    "values.passion.body": "We are driven to excel in everything we do and constantly push beyond the status quo. Our passion fuels innovation, market leadership, and excellence across all aspects of our business.",
    "values.trust.title": "Trust",
    "values.trust.body": "We treat our colleagues, customers, and consumers with respect and fairness. Trust empowers our employees to perform at their best and creates a work environment that delivers exceptional results for everyone.",
    "products.heading": "Our Premium Rice Selection",
    "products.subtitle": "Explore the excellence of White Diamond rice — sourced, processed, and delivered with perfection.",
    "products.origin": "Origin:",
    "products.availableSizes": "Available Sizes:",
    "products.learnMore": "Learn More",
    "products.viewAll": "View All Products",
    "productsPage.title": "Discover the full White Diamond portfolio",
    "productsPage.subtitle": "Browse every SKU we produce, compare origins, packaging sizes, and availability in one curated experience.",
    "productsPage.heroBadge": "Premium rice catalogue",
    "productsPage.metaTitle": "White Diamond Rice Products",
    "productsPage.metaDescription": "Explore the complete White Diamond rice catalogue and request the perfect product for retail, wholesale, or food-service partners.",
    "productsPage.searchPlaceholder": "Search by product name, SKU, or keyword",
    "productsPage.filters.featured": "Featured only",
    "productsPage.filters.availability": "Availability",
    "productsPage.filters.availability.all": "All stock",
    "productsPage.filters.availability.inStock": "In stock",
    "productsPage.filters.availability.outOfStock": "Out of stock",
    "productsPage.filters.sort": "Sort by",
    "productsPage.filters.sort.popular": "Most popular",
    "productsPage.filters.sort.newest": "Newest",
    "productsPage.filters.sort.name": "Name A-Z",
    "productsPage.filters.reset": "Reset filters",
    "productsPage.empty.title": "No products match your filters",
    "productsPage.empty.body": "Try updating the search or filter options to discover more of the White Diamond range.",
    "productsPage.loadMore": "Load more products",
    "productsPage.card.origin": "Origin",
    "productsPage.card.category": "Category",
    "productsPage.card.stock": "Stock status",
    "productsPage.card.stock.in": "Available now",
    "productsPage.card.stock.out": "Currently unavailable",
    "productsPage.card.viewDetails": "View product details",
    "productsPage.card.featured": "Signature pick",
    "productsPage.hero.stats.products": "Active SKUs",
    "productsPage.hero.stats.clients": "Clients served",
    "productsPage.hero.stats.years": "Years perfecting rice",
    "productsPage.error": "We couldn't load products. Please try again.",
    "clients.heading": "Our Valued Clients",
    "clients.subtitle": "We are proud to serve some of the most respected distributors, retailers, and hospitality brands in the region.",
    "clients.trust": "Trusted by",
    "clients.trustTail": "businesses across Saudi Arabia",
    "footer.brand": "Diamond Castle",
    "footer.tagline": "Premium “White Diamond” rice — sourced, processed, and delivered with perfection across KSA.",
    "footer.reach": "Reach us directly",
    "footer.reachSub": "Prefer not to use the form? Use any option below.",
    "footer.social": "Social",
    "footer.socialSub": "Follow “White Diamond” for updates.",
    "footer.backToTop": "Back to top",
    "footer.copyright": "All rights reserved.",
    "services.heading": "Services",
    "services.sectors.title": "Sectors we serve",
    "services.sectors.keyAccounts": "Key Accounts sector",
    "services.sectors.retail": "Retail and supermarket sectors",
    "services.sectors.restaurants": "Restaurants and Kitchens",
    "services.sectors.catering": "Catering and food supply",
    "services.transport.title": "Transport solutions",
    "services.transport.truck10": "10-ton Trucks",
    "services.transport.truck6": "6-ton Trucks",
    "services.transport.mechanizer": "Mechanizer Vehicles",
    "services.transport.salesmen": "Salesmen Vehicles",
    "contact.heading": "Contact Us",
    "contact.sub": "Send us a message and we’ll get back to you.",
    "contact.name": "Name",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.hours": "Business hours",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.placeholder.name": "Your full name",
    "contact.placeholder.email": "you@example.com",
    "contact.placeholder.subject": "How can we help?",
    "contact.placeholder.message": "Write your message here...",
    "contact.privacy": "We’ll never share your details.",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Message sent successfully.",
    "contact.fillRequired": "Please fill required fields.",
    "contact.failed": "Failed to send message.",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.story": "القصة",
    "nav.vision": "الرؤية",
    "nav.products": "المنتجات",
    "nav.clients": "العملاء",
    "nav.services": "الخدمات",
    "nav.contact": "تواصل معنا",
    "nav.blog": "المدونة",
    "lang.ar": "عربي",
    "lang.en": "EN",
    "brand.short": "قلعة الألماس",
    "brand.full": "قلعة الألماس",
    "nav.aria.home": "الصفحة الرئيسية - قلعة الألماس",
    "nav.aria.toggle": "فتح/إغلاق القائمة",
    "hero.title.leading": "الالماس الابيض",
    "hero.title.trailing": "جوهرة الأرز",
    "hero.subtitle": "من شركة قلعة الألماس للتجارة، تمثل علامة \"الالماس الابيض\" النقاء والإرث والكمال — الخيار المفضل لمتذوقي الأرز الفاخر حول العالم.",
    "hero.imageAlt": "وليمة أرز فاخرة مع دجاج محمّر ومكسرات وشاي",
    "hero.cta.view": "تعرّف على أرز الالماس الابيض",
    "hero.cta.learn": "اعرف المزيد عنا",
    "hero.scroll": "مرر للأسفل",
    "story.since": "منذ 2015",
    "story.heading": "المقدمة والقصة",
    "story.imageAlt": "وليمة برياني وأرز تعرض منتجاتنا المميزة",
    "story.p1": "نحن شركة تأسست عام 2015 في قطاع الأرز داخل المملكة العربية السعودية، بدافع رؤية واضحة لتقديم منتجات أرز عالية الجودة تلبي احتياجات السوق المحلي وتتجاوز توقعات المستهلكين.",
    "story.p2": "منذ بدايتنا، ركزنا على بناء شراكات قوية مع أفضل المورّدين في العالم، وإنشاء شبكة توزيع متقدمة تضمن وصول منتجاتنا إلى جميع مناطق المملكة بكفاءة وجودة عالية.",
    "story.p3": "اليوم، نواصل النمو بثقة وثبات داخل هذا القطاع، ملتزمين بأن نكون شركة موثوقة تقدم أفضل أنواع الأرز للمستهلكين في جميع أنحاء المملكة.",
    "story.b1": "تأسست شركتنا على قناعة بأن الطعام ركيزة أساسية في حياة المجتمع، وعلى التزامنا بالمساهمة في تعزيز الأمن الغذائي في المملكة من خلال تقديم الأرز الموثوق وعالي الجودة.",
    "story.b2": "منذ بدايتنا، ركزنا على بناء شراكات قوية مع أفضل المورّدين في العالم، وإنشاء شبكة توزيع متقدمة تضمن وصول منتجاتنا إلى جميع مناطق المملكة بكفاءة وجودة عالية.",
    "story.b3": "اليوم، نواصل النمو بثقة وثبات داخل هذا القطاع، ملتزمين بأن نكون شركة موثوقة تقدم أفضل أنواع الأرز للمستهلكين في جميع أنحاء المملكة.",
    "story.badge": "موثوق • السعودية",
    "vision.heading": "الرؤية والرسالة والأهداف الاستراتيجية",
    "vision.preamble": "منذ تأسيسها، بنت شركة قلعة الألماس للتجارة أسسها على هدف واضح وقيم راسخة ومبادئ توجّه ثقافتها المؤسسية. وعلى مر تاريخنا، تطور عملنا وتنوع، إلا أن رسالتنا وقيمنا الجوهرية بقيت ثابتة — تتناقلها وتتمسك بها الأجيال المتعاقبة من موظفينا.",
    "vision.card1.title": "الرؤية والقيم",
    "vision.card1.body": "نعمل باستراتيجية لتعزيز حياة المزيد من المستهلكين يوميًا، ونتحد لتحقيق هذا الهدف بطرق عملية وذات معنى. ويحرص موظفونا على ترك أثر إيجابي كل يوم، بما يعكس قيم الشركة والسلوكيات التي تشكل أسلوب عملنا معًا ومع شركائنا.",
    "vision.card2.title": "آلية عملنا",
    "vision.card2.body": "نعمل باستراتيجية لتعزيز حياة المزيد من المستهلكين يوميًا، ونتحد لتحقيق هذا الهدف بطرق عملية وذات معنى. ويحرص موظفونا على ترك أثر إيجابي كل يوم، بما يعكس قيم الشركة والسلوكيات التي تشكل أسلوب عملنا معًا ومع شركائنا.",
    "vision.card3.title": "هدفنا — اليوم وللمستقبل",
    "vision.card3.body": "تقديم منتجات وخدمات عالية الجودة والقيمة تُحسن حياة المستهلكين في المملكة العربية السعودية. ويظهر نجاحنا ليس فقط في المبيعات والربحية، بل أيضًا في القيمة التي نخلقها لعملائنا ومساهمينا ومجتمعاتنا المحلية.",
    "values.heading": "القيم المؤسسية والأهداف",
    "values.integrity.title": "النزاهة",
    "values.integrity.body": "نلتزم بالصدق والشفافية في جميع تعاملاتنا، وندير أعمالنا وفقًا لنص وروح القانون. قيمنا ومبادئنا هي البوصلة التي توجه كل قرار وخطة.",
    "values.leadership.title": "الريادة",
    "values.leadership.body": "كل فرد في شركتنا قائد ضمن نطاق مسؤوليته. نلتزم بتحقيق نتائج رائدة عبر رؤية واضحة واستثمار استراتيجي لمواردنا وتطوير مستمر لتجاوز التحديات وتنفيذ خططنا بنجاح.",
    "values.ownership.title": "الملكية",
    "values.ownership.body": "نتحمل المسؤولية الكاملة عن أعمالنا ونعمل باستمرار على تحسين أنظمتنا ودعم الآخرين لرفع أداء الشركة. ونرى أنفسنا ملاكًا حقيقيين لقلعة الألماس، فنحافظ على أصولها ونركز على نجاحها طويل الأمد.",
    "values.passion.title": "الشغف بالنجاح",
    "values.passion.body": "ندفع أنفسنا للتفوق في كل ما نقوم به ونتجاوز المألوف باستمرار. يشعل شغفنا الابتكار والريادة والتميّز في جميع جوانب أعمالنا.",
    "values.trust.title": "الثقة",
    "values.trust.body": "نتعامل مع زملائنا وعملائنا ومستهلكينا باحترام وعدل. فالثقة تمكّن موظفينا من أداء أفضل ما لديهم وتخلق بيئة عمل تحقق نتائج مميزة للجميع.",
    "products.heading": "تشكيلتنا المميزة من الأرز",
    "products.subtitle": "اكتشف تميّز أرز الالماس الابيض — مصدره ومعالجته وتسليمه بإتقان.",
    "products.origin": "المنشأ:",
    "products.availableSizes": "الأحجام المتاحة:",
    "products.learnMore": "اعرف المزيد",
    "products.viewAll": "عرض كل المنتجات",
    "productsPage.title": "استكشف المجموعة الكاملة من الألماس الأبيض",
    "productsPage.subtitle": "تصفح كل صنف نقدمه وقارن المصدر والأحجام والتوافر ضمن تجربة واحدة منسقة.",
    "productsPage.heroBadge": "دليل المنتجات المميزة",
    "productsPage.metaTitle": "منتجات أرز الألماس الأبيض",
    "productsPage.metaDescription": "اكتشف التشكيلة الكاملة لأرز الألماس الأبيض واختر المنتج الأنسب لقطاعات التجزئة أو الجملة أو خدمات الطعام.",
    "productsPage.searchPlaceholder": "ابحث بالاسم أو رقم الصنف أو الكلمات المفتاحية",
    "productsPage.filters.featured": "المنتجات المميزة فقط",
    "productsPage.filters.availability": "التوافر",
    "productsPage.filters.availability.all": "جميع الحالات",
    "productsPage.filters.availability.inStock": "متوفرة",
    "productsPage.filters.availability.outOfStock": "غير متوفرة",
    "productsPage.filters.sort": "ترتيب حسب",
    "productsPage.filters.sort.popular": "الأكثر رواجًا",
    "productsPage.filters.sort.newest": "الأحدث",
    "productsPage.filters.sort.name": "الاسم (أ-ي)",
    "productsPage.filters.reset": "إعادة التعيين",
    "productsPage.empty.title": "لا توجد منتجات مطابقة",
    "productsPage.empty.body": "جرّب تعديل البحث أو المرشحات لاكتشاف المزيد من منتجات الألماس الأبيض.",
    "productsPage.loadMore": "تحميل المزيد من المنتجات",
    "productsPage.card.origin": "المنشأ",
    "productsPage.card.category": "الفئة",
    "productsPage.card.stock": "حالة المخزون",
    "productsPage.card.stock.in": "متاح الآن",
    "productsPage.card.stock.out": "غير متاح حاليًا",
    "productsPage.card.viewDetails": "عرض تفاصيل المنتج",
    "productsPage.card.featured": "اختيار مميز",
    "productsPage.hero.stats.products": "أصناف نشطة",
    "productsPage.hero.stats.clients": "عملاء نخدمهم",
    "productsPage.hero.stats.years": "سنوات خبرة",
    "productsPage.error": "تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى.",
    "contact.heading": "تواصل معنا",
    "contact.sub": "أرسل لنا رسالة وسنعاود التواصل معك.",
    "contact.name": "الاسم",
    "contact.phone": "الهاتف",
    "contact.email": "البريد الإلكتروني",
    "contact.address": "العنوان",
    "contact.hours": "ساعات العمل",
    "contact.subject": "الموضوع",
    "contact.message": "الرسالة",
    "contact.placeholder.name": "الاسم الكامل",
    "contact.placeholder.email": "you@example.com",
    "contact.placeholder.subject": "كيف يمكننا مساعدتك؟",
    "contact.placeholder.message": "اكتب رسالتك هنا...",
    "contact.privacy": "لن نشارك بياناتك مع أي طرف.",
    "contact.send": "إرسال الرسالة",
    "contact.sending": "يتم الإرسال...",
    "contact.success": "تم إرسال الرسالة بنجاح.",
    "contact.fillRequired": "يرجى تعبئة الحقول المطلوبة.",
    "contact.failed": "تعذر إرسال الرسالة.",
    "clients.heading": "عملاؤنا المميزون",
    "clients.subtitle": "نفخر بخدمة نخبة من الموزعين وتجار التجزئة والعلامات الفندقية في المنطقة.",
    "clients.trust": "موثوق من",
    "clients.trustTail": "شركة في أنحاء المملكة",
    "footer.brand": "قلعة الألماس",
    "footer.tagline": "أرز \"الالماس الابيض\" المميز — مصدره ومعالجته وتسليمه بإتقان في المملكة.",
    "footer.reach": "تواصل معنا مباشرة",
    "footer.reachSub": "لا تفضّل استخدام النموذج؟ استخدم أي خيار أدناه.",
    "footer.social": "وسائل التواصل",
    "footer.socialSub": "تابع \"الالماس الابيض\" لمعرفة آخر التحديثات.",
    "footer.backToTop": "العودة للأعلى",
    "footer.copyright": "جميع الحقوق محفوظة.",
    "services.heading": "الخدمات",
    "services.sectors.title": "القطاعات التي نخدمها",
    "services.sectors.keyAccounts": "قطاع الحسابات الرئيسية",
    "services.sectors.retail": "قطاع التجزئة والسوبرماركت",
    "services.sectors.restaurants": "المطاعم والمطابخ",
    "services.sectors.catering": "التموين وتوريد الأغذية",
    "services.transport.title": "حلول النقل",
    "services.transport.truck10": "شاحنات 10 طن",
    "services.transport.truck6": "شاحنات 6 طن",
    "services.transport.mechanizer": "مركبات ميكانيزر",
    "services.transport.salesmen": "مركبات المندوبين",
  },
};

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "app_language";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) as LanguageCode | null) ?? null;
      if (stored === "en" || stored === "ar") {
        setLanguageState(stored);
        return;
      }
    } catch {}

    const browser = typeof navigator !== "undefined" ? navigator.language : "en";
    if (browser.startsWith("ar")) {
      setLanguageState("ar");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}

    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: LanguageCode) => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key: string) => {
    const dict = dictionaries[language];
    return dict[key] ?? dictionaries.en[key] ?? key;
  };

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t, dir: language === "ar" ? "rtl" : "ltr" }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


