## TODO List

- [x] Task 1 — تهيئة المشروع
- [x] Task 2 — إنشاء ملفات SQL لقاعدة البيانات
- [x] Task 3 — إعداد البيئة وربط Supabase
- [x] Task 4 — إنشاء Models Layer
- [x] Task 5 — Middleware Layer
- [x] Task 6 — Authentication Controller و Routes
- [x] Task 7 — صفحة تسجيل الدخول (Frontend)
- [x] Task 8 — الـ Layout الرئيسي (EJS Partial Layout)
- [x] Task 9 — لوحة التحكم (Dashboard)
- [x] Task 10 — إدارة موديلات الأحذية (Products CRUD + Frontend)
- [x] Task 11 — إدارة المقاسات داخل الموديل (Product Sizes CRUD + Frontend)
- [x] Task 12 — إضافة مخزون (Stock IN Workflow)
- [x] Task 13 — صرف مخزون (Stock OUT Workflow)
- [x] Task 14 — سجل الحركات (Transactions History + Filters)
- [x] Task 15 — مواد التعبئة (Packaging Items Full CRUD)
- [x] Task 16 — التقارير (Reports Page)
- [ ] Task 17 — تحسينات تجربة المستخدم (UX Polish)
- [ ] Task 18 — اختبار النظام (Testing + Bug Fixes)
- [ ] Task 19 — تحسينات الأمان والأداء (Security & Performance)
- [ ] Task 20 — التوثيق النهائي (Documentation)

---
Task 1 ✓ — تهيئة المشروع
الهدف: إنشاء هيكل المجلدات وإعداد بيئة التطوير.
الوصف التفصيلي:
- إنشاء هيكل MVC كامل: controllers/, models/, routes/, views/, public/, config/, middleware/, database/
- إنشاء مجلدات الواجهة: public/css/, public/js/, public/img/
- إنشاء مجلد views/pages/ و views/partials/
- تهيئة package.json مع Express.js وتثبيت الحزم المطلوبة:
  - express, @supabase/supabase-js, bcryptjs, express-session, dotenv, cookie-parser, morgan
- إنشاء server.js كنقطة دخول أساسية (Express App فارغ)
- إنشاء .env (template) و .gitignore
الملفات التي سيتم إنشاؤها:
- /package.json
- /server.js
- /.env
- /.gitignore
- /config/
- /controllers/
- /models/
- /routes/
- /middleware/
- /database/
- /views/pages/
- /views/partials/
- /public/css/
- /public/js/
- /public/img/
الاعتماديات: لا يوجد
النتيجة المتوقعة: هيكل مجلدات جاهز، npm install يعمل، node server.js يشغل السيرفر.
Task 2 ✓ — إنشاء ملفات SQL لقاعدة البيانات
الهدف: كتابة سكربت إنشاء جميع جداول قاعدة البيانات في Supabase.
الوصف التفصيلي:
- كتابة ملف database/schema.sql لإنشاء جميع الجداول الخمسة:
  - users — جدول المستخدمين (admin واحد)
  - products — جدول موديلات الأحذية
  - product_sizes — جدول المقاسات المستقل
  - packaging_items — جدول مواد التعبئة
  - inventory_transactions — جدول سجل الحركات
- كتابة ملف database/seed.sql لإدراج:
  - مستخدم Admin افتراضي (username: admin, password مشفر بـ bcrypt)
  - مواد التعبئة الستة الافتراضية (علبة رجالي، علبة حريمي، علبة أطفال، كيس، استيكر، ورق تغليف)
- إضافة جميع العلاقات (Foreign Keys) والقيود (NOT NULL, CHECK) والفهارس (Indexes)
- التأكد من توافق schema.sql مع Supabase
الملفات التي سيتم إنشاؤها:
- /database/schema.sql
- /database/seed.sql
الاعتماديات: Task 1
النتيجة المتوقعة: تنفيذ schema.sql + seed.sql على Supabase SQL Editor ينتج قاعدة بيانات كاملة وجاهزة.
Task 3 ✓ — إعداد البيئة وربط Supabase
الهدف: تكوين ملفات البيئة وإنشاء Singleton لاتصال Supabase.
الوصف التفصيلي:
- إكمال .env بالمتغيرات: SUPABASE_URL, SUPABASE_ANON_KEY, SESSION_SECRET, PORT
- إنشاء config/supabase.js — Singleton Client لـ Supabase
- إنشاء config/database.js — تصدير supabase client وإعدادات عامة
- تحديث server.js لتحميل dotenv واستيراد الـ config
- التأكد من عمل الاتصال مع Supabase (ping test)
الملفات التي سيتم إنشاؤها/تعديلها:
- /config/supabase.js (إنشاء)
- /config/database.js (إنشاء)
- /.env (تعديل)
- /server.js (تعديل)
الاعتماديات: Task 1, Task 2
النتيجة المتوقعة: السيرفر يقرأ .env ويتمكن من الاتصال بـ Supabase بنجاح.
Task 4 — إنشاء Models Layer
الهدف: كتابة جميع الـ Models للتعامل مع Supabase (Data Access Layer).
الوصف التفصيلي:
- models/User.js — findByUsername(username), verifyPassword(input, hash)
- models/Product.js — getAll(), getById(id), search(query), create(data), update(id, data), delete(id), getAllWithSizes()
- models/ProductSize.js — getByProductId(productId), create(productId, data), update(id, data), delete(id), addQuantity(id, amount), deductQuantity(id, amount), getLowStock()
- models/PackagingItem.js — getAll(), getById(id), search(query), create(data), update(id, data), delete(id), addQuantity(id, amount), deductQuantity(id, amount), getLowStock()
- models/Transaction.js — create(data), getAll(filters), getRecent(limit), getDailyCount(), search(query)
- كل Model يستخدم config/supabase.js للاتصال
- استخدام Async/Await مع try/catch
الملفات التي سيتم إنشاؤها:
- /models/User.js
- /models/Product.js
- /models/ProductSize.js
- /models/PackagingItem.js
- /models/Transaction.js
الاعتماديات: Task 3
النتيجة المتوقعة: كل Model يعمل بشكل مستقل عند اختباره مباشرة (استدعاء دواله يعيد بيانات من Supabase).
Task 5 — Middleware Layer
الهدف: إنشاء جميع الـ Middleware (Authentication, Validation, Errors).
الوصف التفصيلي:
- middleware/auth.js — requireAuth(req, res, next): يتحقق من وجود session.userId, إذا لم يوجد يعيد توجيه إلى /login
- middleware/auth.js — redirectIfAuth(req, res, next): إذا كان مسجلاً بالفعل يعيد توجيه إلى /dashboard
- middleware/auth.js — setUserLocals(req, res, next): يحقن req.user في res.locals.user ليظهر الاسم في الـ views
- middleware/validate.js — دوال تحقق من صحة المدخلات لكل API endpoint (منع القيم السالبة، التحقق من الحقول المطلوبة، إلخ)
- middleware/errorHandler.js — Global error handler يعيد JSON للأخطاء برسائل عربية
- middleware/errorHandler.js — 404 handler
الملفات التي سيتم إنشاؤها:
- /middleware/auth.js
- /middleware/validate.js
- /middleware/errorHandler.js
الاعتماديات: Task 4
النتيجة المتوقعة: Middleware جاهز للاستخدام في الـ Routes، يحمي الصفحات ويتحقق من المدخلات.
Task 6 — Authentication Controller و Routes
الهدف: إنشاء نظام تسجيل الدخول المحلي بالكامل (Backend).
الوصف التفصيلي:
- controllers/authController.js:
  - showLogin(req, res) — يعرض صفحة تسجيل الدخول
  - login(req, res) — يتحقق من اسم المستخدم وكلمة المرور عبر bcrypt، ينشئ session
  - logout(req, res) — يدمر session ويعيد توجيه إلى login
- routes/auth.js — Express Router:
  - GET /login → showLogin
  - POST /login → login (مع validation middleware)
  - POST /logout → logout
- تكوين express-session في server.js (cookie, secret, maxAge)
- ربط cookie-parser و morgan في server.js
- تسجيل authRoutes في server.js
الملفات التي سيتم إنشاؤها/تعديلها:
- /controllers/authController.js (إنشاء)
- /routes/auth.js (إنشاء)
- /server.js (تعديل)
الاعتماديات: Task 4, Task 5
النتيجة المتوقعة: POST /login ببيانات صحيحة ينشئ session ويعيد redirect إلى dashboard. بيانات خاطئة تعيد رسالة خطأ عربية. POST /logout يدمر session.
Task 7 — صفحة تسجيل الدخول (Frontend)
الهدف: إنشاء صفحة تسجيل الدخول بتصميم Minimal احترافي.
الوصف التفصيلي:
- views/pages/login.ejs:
  - تصميم Centered Card بتدرجات الألوان Indigo/White
  - حقل اسم المستخدم (مع placeholder عربي)
  - حقل كلمة المرور (مع placeholder عربي)
  - زر تسجيل الدخول مع Loading indicator
  - عرض رسائل الخطأ بتنسيق Toast/Alert
  - RTL كامل، خط Cairo
  - Responsive (mobile-first)
  - Animation خفيف عند ظهور الصفحة
- public/css/login.css — تنسيقات إضافية للصفحة
- public/js/login.js — معالجة form submission (Fetch API), Loading state, عرض الأخطاء
- تخصيص <head> بإضافة خط Cairo من Google Fonts و Tailwind CDN
الملفات التي سيتم إنشاؤها:
- /views/pages/login.ejs
- /public/css/login.css
- /public/js/login.js
الاعتماديات: Task 6
النتيجة المتوقعة: صفحة تسجيل دخول عربية احترافية، تعمل login/logout بشكل صحيح، رسائل خطأ واضحة.
Task 8 — الـ Layout الرئيسي (EJS Partial Layout)
الهدف: إنشاء الهيكل الرئيسي المشترك لجميع الصفحات الداخلية.
الوصف التفصيلي:
- views/partials/head.ejs — <head> مشترك: meta charset UTF-8, viewport, title ديناميكي, Tailwind CDN, خط Cairo, direction RTL, CSS عام
- views/partials/sidebar.ejs — الشريط الجانبي مع جميع الأقسام الستة (لوحة التحكم، موديلات الأحذية، حركات المخزون، مواد التعبئة، التقارير، تسجيل الخروج)
- views/partials/header.ejs — شريط علوي مصغر: اسم المستخدم، Breadcrumbs، زر Mobile menu toggle
- views/partials/footer.ejs — تذييل بسيط (حقوق النشر)
- views/partials/toast.ejs — مكون Toast Notifications عام
- views/partials/modal.ejs — مكون Modal تأكيد الحذف عام
- views/partials/skeleton.ejs — مكون Skeleton Loading عام
- views/layouts/main.ejs — Layout رئيسي يجمع: head + sidebar + header + <%- body %> + footer + toast + modal
- public/css/main.css — تنسيقات عامة (Sidebar, Header, Cards, Buttons, Tables, Forms, RTL adjustments)
- public/js/main.js — وظائف عامة (Sidebar toggle, Toast, Modal, Skeleton, API helpers, Format dates/numbers)
الملفات التي سيتم إنشاؤها:
- /views/partials/head.ejs
- /views/partials/sidebar.ejs
- /views/partials/header.ejs
- /views/partials/footer.ejs
- /views/partials/toast.ejs
- /views/partials/modal.ejs
- /views/partials/skeleton.ejs
- /views/layouts/main.ejs
- /public/css/main.css
- /public/js/main.js
الاعتماديات: Task 7
النتيجة المتوقعة: هيكل View كامل بالعربية RTL، يمكن استخدامه لأي صفحة داخلية عبر res.render('pages/xxx', { layout: 'layouts/main' }).
Task 9 — لوحة التحكم (Dashboard)
الهدف: إنشاء Dashboard يعرض بطاقات إحصائية وآخر الحركات.
الوصف التفصيلي:
- controllers/dashboardController.js:
  - showDashboard(req, res) — يجمع الإحصائيات: إجمالي الموديلات، إجمالي المقاسات، إجمالي كمية الأحذية، إجمالي مواد التعبئة، المنتجات قليلة الكمية، مواد التعبئة قليلة الكمية، عمليات اليوم، آخر 10 حركات
  - يستخدم الـ Models لجلب البيانات
- routes/dashboard.js — GET /dashboard
- views/pages/dashboard.ejs:
  - 8 بطاقات إحصائية (Grid responsive: 4 columns desktop → 2 tablet → 1 mobile)
  - كل بطاقة: أيقونة، قيمة رقمية، عنوان، لون accent
  - جدول "آخر 10 حركات" مع أعمدة: التاريخ، النوع، العنصر، المقاس، الكمية، المنفذ
  - Skeleton Loading للبطاقات والجدول
- public/js/dashboard.js — جلب البيانات وعرضها مع Skeleton animation
الملفات التي سيتم إنشاؤها/تعديلها:
- /controllers/dashboardController.js (إنشاء)
- /routes/dashboard.js (إنشاء)
- /views/pages/dashboard.ejs (إنشاء)
- /public/js/dashboard.js (إنشاء)
- /server.js (تعديل — ربط dashboard routes)
الاعتماديات: Task 8
النتيجة المتوقعة: /dashboard يعرض لوحة تحكم كاملة مع بطاقات إحصائية وجدول آخر الحركات، Skeleton يظهر أثناء التحميل.
Task 10 — إدارة موديلات الأحذية (Products CRUD + Frontend)
الهدف: إنشاء صفحة كاملة لإدارة الموديلات مع REST API.
الوصف التفصيلي:
- controllers/productController.js:
  - showPage(req, res) — عرض صفحة إدارة الموديلات
  - getAll(req, res) — API JSON لكل الموديلات
  - search(req, res) — API بحث (اسم، لون، فئة، مقاس)
  - create(req, res) — إضافة موديل جديد (اسم، فئة، لون، خامة، علامة تجارية، ملاحظات)
  - update(req, res) — تعديل موديل
  - delete(req, res) — حذف موديل (مع التأكد من حذف المقاسات المرتبطة)
  - getWithSizes(req, res) — جلب موديل مع مقاساته
- routes/products.js — REST API endpoints مع validation middleware:
  - GET /products → عرض الصفحة
  - GET /api/products → JSON all
  - GET /api/products/search?q=... → بحث
  - GET /api/products/:id/sizes → موديل + مقاسات
  - POST /api/products → إضافة
  - PUT /api/products/:id → تعديل
  - DELETE /api/products/:id → حذف
- views/pages/products.ejs:
  - جدول الموديلات (اسم، فئة، لون، خامة، علامة تجارية، ملاحظات، عدد المقاسات، إجمالي الكمية)
  - شريط بحث سريع أعلى الجدول
  - زر "إضافة موديل جديد" يفتح Modal/Form
  - Modal تعديل الموديل
  - Modal تأكيد الحذف
  - عند الضغط على موديل → ينتقل إلى صفحة المقاسات
- public/js/products.js — Fetch API للـ CRUD، Toast، Modal، Skeleton، Debounced search
الملفات التي سيتم إنشاؤها:
- /controllers/productController.js
- /routes/products.js
- /views/pages/products.ejs
- /public/js/products.js
الاعتماديات: Task 9
النتيجة المتوقعة: صفحة /products تعرض كل الموديلات، إضافة/تعديل/حذف تعمل بكامل Toast وModal، البحث يعمل live.
Task 11 — إدارة المقاسات داخل الموديل (Product Sizes CRUD + Frontend)
الهدف: صفحة تفصيلية لإدارة مقاسات موديل معين.
الوصف التفصيلي:
- controllers/sizeController.js:
  - showPage(req, res) — عرض صفحة مقاسات موديل (مع معلومات الموديل)
  - getAll(req, res) — API JSON لمقاسات الموديل
  - create(req, res) — إضافة مقاس جديد (المقاس، الكمية، الحد الأدنى للتنبيه)
  - update(req, res) — تعديل مقاس (المقاس، الحد الأدنى)
  - delete(req, res) — حذف مقاس
- routes/sizes.js:
  - GET /products/:id/sizes → عرض الصفحة
  - GET /api/products/:id/sizes → JSON
  - POST /api/products/:id/sizes → إضافة
  - PUT /api/sizes/:id → تعديل
  - DELETE /api/sizes/:id → حذف
- views/pages/product-sizes.ejs:
  - Header: اسم الموديل، اللون، الفئة + زر العودة
  - جدول المقاسات (المقاس، الكمية الحالية، الحد الأدنى، حالة التنبيه — أحمر/أصفر/أخضر)
  - زر "إضافة مقاس جديد" يفتح Form inline/Modal
  - زر تعديل لكل مقاس (تعديل المقاس والحد الأدنى فقط، بدون لمس الكمية)
  - زر حذف مع Modal تأكيد
  - المقاسات قليلة الكمية مظللة بلون تحذيري
- public/js/product-sizes.js — كل عمليات الـ CRUD الخاصة بالمقاسات
الملفات التي سيتم إنشاؤها:
- /controllers/sizeController.js
- /routes/sizes.js
- /views/pages/product-sizes.ejs
- /public/js/product-sizes.js
الاعتماديات: Task 10
النتيجة المتوقعة: صفحة مقاسات كل موديل تعمل بكامل CRUD، حدود التنبيه تظهر بألوانها، التحقق من القيم السالبة يعمل.
Task 12 — إضافة مخزون (Stock IN Workflow)
الهدف: إنشاء workflow كامل لإضافة كمية إلى المقاس مع تسجيل الحركة.
الوصف التفصيلي:
- controllers/stockInController.js:
  - showForm(req, res) — عرض صفحة إضافة كمية (جلب كل الموديلات للاختيار)
  - getSizesByProduct(req, res) — API: جلب مقاسات موديل معين (للـ cascading select)
  - processStockIn(req, res) — تنفيذ عملية الإضافة:
    1. التحقق من صحة المدخلات
    2. جلب الرصيد الحالي
    3. تحديث كمية المقاس (+ quantity)
    4. حساب الرصيد بعد العملية
    5. إنشاء سجل حركة (transaction_type = IN, item_type = shoe)
- routes/stockIn.js:
  - GET /transactions/in → عرض الصفحة
  - GET /api/products/:id/sizes-for-select → مقاسات للاختيار
  - POST /api/transactions/in → تنفيذ الإضافة
- views/pages/stock-in.ejs:
  - Select/Dropdown: اختيار الموديل (مع Search)
  - Select/Dropdown: اختيار المقاس (يتغير حسب الموديل المختار — cascading)
  - Input: الكمية (عدد صحيح موجب)
  - Input: اسم المورد (اختياري)
  - Textarea: ملاحظات
  - زر "إضافة" مع Loading
  - Toast نجاح بعد الحفظ
  - إعادة تعيين الفورم بعد الإضافة الناجحة
- public/js/stock-in.js — cascading selects, form submission, validation
الملفات التي سيتم إنشاؤها:
- /controllers/stockInController.js
- /routes/stockIn.js
- /views/pages/stock-in.ejs
- /public/js/stock-in.js
الاعتماديات: Task 11
النتيجة المتوقعة: إضافة كمية تعمل بكامل الـ workflow: اختيار موديل → اختيار مقاس → إدخال كمية → حفظ → تحديث الكمية + سجل حركة → Toast نجاح.
Task 13 — صرف مخزون (Stock OUT Workflow)
الهدف: إنشاء workflow كامل لصرف كمية مع منع الصرف إذا الكمية غير متاحة.
الوصف التفصيلي:
- controllers/stockOutController.js:
  - showForm(req, res) — عرض صفحة صرف كمية
  - processStockOut(req, res):
    1. التحقق من صحة المدخلات
    2. جلب الرصيد الحالي
    3. التحقق: إذا الكمية المطلوبة > الرصيد → رفض مع رسالة عربية "الكمية المطلوبة أكبر من المتوفر"
    4. خصم الكمية من المقاس (- quantity)
    5. التأكد من عدم وصول الكمية لأقل من صفر
    6. حساب الرصيد بعد العملية
    7. إنشاء سجل حركة (transaction_type = OUT)
- routes/stockOut.js:
  - GET /transactions/out → عرض الصفحة
  - POST /api/transactions/out → تنفيذ الصرف
- views/pages/stock-out.ejs:
  - Select: اختيار الموديل (مع Search)
  - Select: اختيار المقاس (cascading)
  - عرض الرصيد الحالي بعد اختيار المقاس (Real-time)
  - Input: الكمية المطلوبة
  - Validation حي: إذا الكمية > الرصيد → تحديد الحقل باللون الأحمر + رسالة تحذير
  - Input: الجهة المستلمة
  - Select: سبب الصرف (بيع، تالف، مرتجع، نقل مخزن آخر، هدية...)
  - Textarea: ملاحظات
  - زر "صرف" مع Loading
- public/js/stock-out.js — cascading, real-time balance check, validation, Toast
الملفات التي سيتم إنشاؤها:
- /controllers/stockOutController.js
- /routes/stockOut.js
- /views/pages/stock-out.ejs
- /public/js/stock-out.js
الاعتماديات: Task 12
النتيجة المتوقعة: صرف كمية يعمل، يمنع الصرف إذا الكمية غير كافية برسالة عربية واضحة، يسجل الحركة مع الرصيد قبل/بعد.
Task 14 — سجل الحركات (Transactions History + Filters)
الهدف: إنشاء صفحة كاملة لعرض سجل الحركات مع فلترة وبحث.
الوصف التفصيلي:
- controllers/transactionController.js:
  - showPage(req, res) — عرض صفحة سجل الحركات
  - getAll(req, res) — API JSON مع فلترة:
    - ?type=IN|OUT
    - ?itemType=shoe|packaging
    - ?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
    - ?search=keyword
    - ?page=1&limit=50 (Pagination)
    - ?sort=created_at:desc|asc
  - getById(req, res) — تفاصيل حركة واحدة
- routes/transactions.js:
  - GET /transactions → عرض الصفحة
  - GET /api/transactions?... → JSON مع فلترة
  - GET /api/transactions/:id → تفاصيل حركة
- views/pages/transactions.ejs:
  - شريط فلترة أعلى الجدول:
    - حقل بحث نصي
    - Select: نوع العملية (الكل / إضافة / صرف)
    - Select: نوع العنصر (الكل / حذاء / مواد تعبئة)
    - Input: من تاريخ → إلى تاريخ
    - زر "تطبيق الفلترة" + زر "مسح"
  - جدول الحركات:
    - التاريخ والوقت (بتنسيق عربي)
    - نوع العملية (شارة: أخضر للإضافة، أحمر للصرف)
    - نوع العنصر (شارة: Indigo للحذاء، أصفر لمواد التعبئة)
    - اسم العنصر
    - المقاس (إن وجد)
    - الكمية
    - الرصيد قبل
    - الرصيد بعد
    - المنفذ
    - ملاحظات (زر توسيع)
  - Pagination أسفل الجدول
  - إجمالي عدد النتائج
- public/js/transactions.js — Fetch مع query params، Pagination، Skeleton، Reset filters
الملفات التي سيتم إنشاؤها:
- /controllers/transactionController.js
- /routes/transactions.js
- /views/pages/transactions.ejs
- /public/js/transactions.js
الاعتماديات: Task 13
النتيجة المتوقعة: صفحة سجل حركات كاملة مع فلترة وبحث و Pagination وجدول احترافي.
Task 15 — مواد التعبئة (Packaging Items Full CRUD)
الهدف: إنشاء صفحة كاملة لإدارة مواد التعبئة مع REST API.
الوصف التفصيلي:
- controllers/packagingController.js:
  - showPage(req, res) — عرض صفحة مواد التعبئة
  - getAll(req, res) — API JSON
  - search(req, res) — API بحث
  - create(req, res) — إضافة عنصر جديد
  - update(req, res) — تعديل عنصر (الاسم، الحد الأدنى)
  - delete(req, res) — حذف عنصر
  - addQuantity(req, res) — إضافة كمية (مع سجل حركة)
  - deductQuantity(req, res) — صرف كمية (مع التحقق من الكمية المتاحة + سجل حركة)
- routes/packaging.js:
  - GET /packaging → عرض الصفحة
  - GET /api/packaging → JSON
  - GET /api/packaging/search?q=... → بحث
  - POST /api/packaging → إضافة عنصر
  - PUT /api/packaging/:id → تعديل
  - DELETE /api/packaging/:id → حذف
  - POST /api/packaging/:id/in → إضافة كمية
  - POST /api/packaging/:id/out → صرف كمية
- views/pages/packaging.ejs:
  - جدول العناصر: الاسم، الكمية، الحد الأدنى، حالة التنبيه
  - لكل عنصر:
    - زر "إضافة كمية" → Modal (إدخال كمية + ملاحظات)
    - زر "صرف كمية" → Modal (إدخال كمية + سبب + ملاحظات + عرض الرصيد)
    - زر تعديل (Inline edit للاسم والحد الأدنى)
    - زر حذف مع Modal تأكيد
  - زر "إضافة عنصر جديد" أعلى الجدول
  - العناصر قليلة الكمية مظللة بلون تحذيري
  - العناصر الافتراضية الستة موجودة مسبقاً (من seed.sql)
- public/js/packaging.js — CRUD, Quantities modals, Toast, Skeleton
الملفات التي سيتم إنشاؤها:
- /controllers/packagingController.js
- /routes/packaging.js
- /views/pages/packaging.ejs
- /public/js/packaging.js
الاعتماديات: Task 14
النتيجة المتوقعة: صفحة مواد تعبئة كاملة CRUD + إضافة/صرف كميات مع سجل حركات. 6 عناصر افتراضية تظهر تلقائياً.
Task 16 — التقارير (Reports Page)
الهدف: إنشاء صفحة تقارير تعرض إحصائيات متقدمة ورسم بياني بسيط.
الوصف التفصيلي:
- controllers/reportController.js:
  - showPage(req, res) — عرض صفحة التقارير
  - getStats(req, res) — API إحصائيات عامة (نفس dashboard لكن تفصيلية)
  - getCategoryDistribution(req, res) — توزيع الموديلات حسب الفئة (رجالي، حريمي، أطفال، رياضي...)
  - getBrandDistribution(req, res) — توزيع حسب العلامة التجارية
  - getTopMoving(req, res) — أكثر المقاسات حركة
  - getStockValue(req, res) — تقدير قيمة المخزون (بسيط)
  - getMonthlyReport(req, res) — تقرير شهري (حركات الشهر، إجمالي IN/OUT)
- routes/reports.js:
  - GET /reports → عرض الصفحة
  - GET /api/reports/stats → JSON
  - GET /api/reports/categories → JSON
  - GET /api/reports/brands → JSON
  - GET /api/reports/top-moving → JSON
  - GET /api/reports/monthly?month=7&year=2026 → JSON
- views/pages/reports.ejs:
  - بطاقات إحصائية مشابهة للـ Dashboard
  - رسم بياني شريطي بسيط (Canvas/Chart.js light clone بالـ CSS+JS فقط) لتوزيع الفئات
  - جدول: توزيع حسب العلامة التجارية (Brand, عدد الموديلات, إجمالي الكمية)
  - جدول: أكثر 10 مقاسات حركة
  - تقرير شهري: اختيار الشهر والسنة → عرض إجمالي الإضافات والصرفات
  - أزرار تصدير (تحضير للـ CSV لاحقاً)
- public/js/reports.js — Fetch APIs, رسم بياني بسيط
الملفات التي سيتم إنشاؤها:
- /controllers/reportController.js
- /routes/reports.js
- /views/pages/reports.ejs
- /public/js/reports.js
الاعتماديات: Task 15
النتيجة المتوقعة: صفحة تقارير تعرض إحصائيات متقدمة ورسم بياني بسيط (CSS-only chart) وتقرير شهري.
Task 17 — تحسينات تجربة المستخدم (UX Polish)
الهدف: تطبيق جميع تحسينات UX المطلوبة في النظام كاملاً.
الوصف التفصيلي:
- Toast Notifications: إنشاء نظام Toast موحد (نجاح أخضر، خطأ أحمر، تحذير أصفر، معلومات أزرق) — animation slide-in من الأعلى + auto-dismiss بعد 3 ثواني
- Modal تأكيد الحذف: نافذة منبثقة "هل أنت متأكد من حذف اسم العنصر؟" مع زرين: "نعم، احذف" (أحمر) و "إلغاء" (رمادي)
- Skeleton Loading: تطبيق Skeleton animation على جميع الجداول والبطاقات (pulse animation + gray placeholder bars)
- Loading States: جميع أزرار الإرسال تُظهر Spinner + تعطيل مؤقت (disabled + "جاري الحفظ...")
- Empty States: عرض رسالة مناسبة عند عدم وجود بيانات ("لا توجد موديلات بعد"، "لا توجد حركات لهذا اليوم"...)، مع أيقونة توضيحية
- Responsive تحسينات:
  - Sidebar يتحول إلى Drawer على الموبايل (hamburger menu)
  - الجداول تتحول إلى Cards على الشاشات الصغيرة
  - البطاقات الإحصائية Grid 1 column على الموبايل
- Keyboard Shortcuts: Ctrl+K للبحث السريع العام
- Auto-refresh: Dashboard يعيد تحميل البيانات كل 60 ثانية
- Breadcrumbs: مسار التنقل أعلى كل صفحة (لوحة التحكم > موديلات الأحذية > Nike Air)
- Form Validation Visual: الحقول غير الصالحة تحاط بـ border أحمر + رسالة تحت الحقل
الملفات التي سيتم تعديلها:
- /public/css/main.css (إضافة تنسيقات Toast, Modal, Skeleton, Empty States, Mobile)
- /public/js/main.js (إضافة وظائف Toast, Modal, Skeleton, Keyboard Shortcuts, Auto-refresh)
- جميع صفحات views/pages/*.ejs (إضافة Empty States, Breadcrumbs, تحسين responsive)
- جميع ملفات public/js/*.js (إضافة Skeleton loading, Loading states للأزرار)
الاعتماديات: Task 16
النتيجة المتوقعة: تجربة مستخدم احترافية: Toast لكل عملية، تأكيد قبل الحذف، Skeleton أثناء التحميل، أزرار Loading، Empty States واضحة، Responsive مثالي.
Task 18 — اختبار النظام (Testing + Bug Fixes)
الهدف: اختبار جميع وظائف النظام يدوياً وتوثيق وإصلاح المشاكل.
الوصف التفصيلي:
- اختبار كل API endpoint (GET, POST, PUT, DELETE) بـ curl أو Postman:
  - Auth endpoints (login, logout)
  - Products CRUD
  - Product Sizes CRUD
  - Stock IN (إضافة كمية + سجل حركة)
  - Stock OUT (صرف كمية + منع الصرف الزائد)
  - Packaging CRUD + IN/OUT
  - Transactions (فلترة، Pagination، بحث)
  - Dashboard stats
  - Reports stats
- اختبار السيناريوهات الحدية:
  - محاولة صرف كمية أكبر من المتوفر → يجب رفضها
  - إدخال كميات سالبة → يجب رفضها
  - حذف موديل له مقاسات → يجب حذف المقاسات أيضاً
  - الوصول لصفحة بدون تسجيل دخول → يجب redirect إلى login
  - البحث بمدخلات فارغة → يعيد كل النتائج
  - Pagination: صفحة 1 و 2 بشكل صحيح
- فحص الـ Browser Console بحثاً عن أخطاء JavaScript
- فحص Responsive Design على 3 أحجام: Mobile (375px), Tablet (768px), Desktop (1440px)
- توثيق أي Bug وإصلاحه
الملفات التي سيتم تعديلها: حسب نتائج الاختبار (Controllers, Models, Views, JS)
الاعتماديات: Task 17
النتيجة المتوقعة: نظام خالي من الأخطاء الوظيفية، كل السيناريوهات الحدية تُعالج بشكل صحيح، تجربة المستخدم سلسة على جميع الأجهزة.
Task 19 — تحسينات الأمان والأداء (Security & Performance)
الهدف: تطبيق تحسينات الأمان والأداء النهائية.
الوصف التفصيلي:
- Security:
  - Helmet.js headers (X-Frame-Options, CSP, HSTS...)
  - Rate Limiting على /login (5 محاولات كل 15 دقيقة)
  - Input Sanitization: منع HTML/SQL Injection عبر validation middleware
  - CSRF Protection بسيطة (Token per request — يدوي أو مكتبة خفيفة)
  - Session timeout: انتهاء الجلسة بعد 8 ساعات inactivity
  - Password policy: admin password يجب تغييره أول مرة
- Performance:
  - Gzip Compression مع compression middleware
  - Caching للـ API responses المتكررة (Dashboard stats, Products list) — In-Memory cache بسيط مع TTL 30 ثانية
  - Lazy loading للصور (إن وجدت)
  - Debounce للبحث (300ms delay)
  - Limit API returns: pagination max 100 per page
  - Database query optimization: Index hints للـ Supabase queries
- Error Handling:
  - Global unhandled rejection handler
  - Graceful shutdown (SIGTERM)
  - Logging للأخطاء مع timestamps
الملفات التي سيتم تعديلها/إنشاؤها:
- /server.js (إضافة Helmet, Compression, Rate Limit, Session config)
- /middleware/auth.js (Session timeout logic)
- /middleware/validate.js (إضافة sanitization)
- /middleware/cache.js (إنشاء — in-memory caching)
- /config/security.js (إنشاء — security constants)
الاعتماديات: Task 18
النتيجة المتوقعة: نظام آمن ضد الهجمات الشائعة، أداء محسن، زمن استجابة أقل من 200ms للـ API البسيطة.
Task 20 — التوثيق النهائي (Documentation)
الهدف: إنشاء ملف README بالعربية + ملف تشغيل وتعليمات.
الوصف التفصيلي:
- README.md بالعربية:
  - اسم المشروع ووصفه
  - التقنيات المستخدمة
  - هيكل المجلدات (شجرة)
  - متطلبات التشغيل (Node.js, Supabase account)
  - خطوات التثبيت والتشغيل (خطوة بخطوة):
    1. git clone
    2. npm install
    3. إنشاء Supabase project
    4. تنفيذ schema.sql و seed.sql
    5. نسخ .env.example إلى .env وملء البيانات
    6. npm start
  - شرح API endpoints (جدول REST API)
  - شرح صفحات النظام
  - كيفية إضافة admin جديد
  - أسماء المستخدم وكلمة المرور الافتراضية
  - لقطات الشاشة (اختياري)
- التأكد من وضوح التعليمات وسهولة المتابعة
الملفات التي سيتم إنشاؤها:
- /README.md
الاعتماديات: Task 19
النتيجة المتوقعة: README شامل بالعربية، أي مطور يستطيع تشغيل النظام في أقل من 10 دقائق باتباع التعليمات.
ملخص الاعتماديات (Dependency Graph)
Task 1 ←─────────── البدء
  ↓
Task 2 ←─────────── قاعدة البيانات
  ↓
Task 3 ←─────────── ربط Supabase
  ↓
Task 4 ←─────────── Models
  ↓
Task 5 ←─────────── Middleware
  ↓
Task 6 ←─────────── Auth Controller + Routes
  ↓
Task 7 ←─────────── Login UI
  ↓
Task 8 ←─────────── Main Layout
  ↓
Task 9 ←─────────── Dashboard
  ↓
Task 10 ←────────── Products CRUD
  ↓
Task 11 ←────────── Product Sizes CRUD
  ↓  ↓
Task 12    ←─────── Stock IN
  ↓
Task 13 ←────────── Stock OUT
  ↓
Task 14 ←────────── Transactions History
  ↓
Task 15 ←────────── Packaging CRUD
  ↓
Task 16 ←────────── Reports
  ↓
Task 17 ←────────── UX Polish
  ↓
Task 18 ←────────── Testing
  ↓
Task 19 ←────────── Security & Performance
  ↓
Task 20 ←────────── Documentation
إجمالي المهام: 20 Task
إجمالي الملفات المقدرة: ~60 ملف
مدة التنفيذ التقديرية: قابلة للتوقف والاستكمال في أي وقت دون كسر أي جزء.