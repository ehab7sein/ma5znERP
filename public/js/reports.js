document.addEventListener('DOMContentLoaded', () => {
    const statsGrid = document.getElementById('statsGrid');
    const categoryChart = document.getElementById('categoryChart');
    const brandChart = document.getElementById('brandChart');
    const monthlyReport = document.getElementById('monthlyReport');
    const reportMonth = document.getElementById('reportMonth');
    const reportYear = document.getElementById('reportYear');
    const loadMonthlyBtn = document.getElementById('loadMonthlyBtn');

    // ── Stats ────────────────────────────────────────────────────────────────
    async function loadStats() {
        try {
            const res = await fetch('/api/reports/stats');
            const result = await res.json();
            if (result.success) {
                renderStats(result.data);
            }
        } catch (err) {
            statsGrid.innerHTML = '<p class="text-error font-body-md col-span-4 text-center py-lg">خطأ في تحميل الإحصائيات</p>';
        }
    }

    function renderStats(stats) {
        const cards = [
            { label: 'إجمالي الموديلات', value: stats.totalProducts, icon: 'category', color: 'text-primary', border: 'bg-primary', bg: 'bg-primary-container/10' },
            { label: 'إجمالي المقاسات', value: stats.totalSizes, icon: 'straighten', color: 'text-secondary', border: 'bg-secondary', bg: 'bg-secondary-container/20' },
            { label: 'إجمالي كمية الأحذية', value: stats.totalShoesQuantity, icon: 'layers', color: 'text-primary', border: 'bg-primary', bg: 'bg-primary-container/10' },
            { label: 'إجمالي مواد التعبئة', value: stats.totalPackagingQuantity, icon: 'box', color: 'text-secondary', border: 'bg-secondary', bg: 'bg-secondary-container/20' },
            { label: 'موديلات منخفضة', value: stats.lowStockShoesCount, icon: 'warning', color: 'text-amber-600', border: 'bg-amber-500', bg: 'bg-amber-50', subtitle: 'تنبيه مخزون' },
            { label: 'مواد تعبئة منخفضة', value: stats.lowStockPackagingCount, icon: 'inventory', color: 'text-rose-600', border: 'bg-rose-500', bg: 'bg-rose-50', subtitle: 'عاجل' }
        ];

        statsGrid.innerHTML = cards.map(c => `
            <div class="bg-white rounded-xl border border-outline-variant p-lg shadow-soft hover:shadow-hover transition-all-200 relative overflow-hidden group">
                <div class="absolute right-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all-200 ${c.border}"></div>
                <div class="flex justify-between items-start mb-sm">
                    <p class="font-label-sm text-label-sm text-on-surface-variant">${c.label}</p>
                    <span class="material-symbols-outlined p-1.5 rounded-md ${c.bg} ${c.color}">${c.icon}</span>
                </div>
                <div class="flex items-end gap-sm">
                    <h3 class="font-display-xl text-display-xl text-on-background">${c.value}</h3>
                    ${c.subtitle ? `<span class="font-caption-xs text-caption-xs mb-1 ${c.color}">${c.subtitle}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // ── Category Distribution ────────────────────────────────────────────────
    async function loadCategories() {
        try {
            const res = await fetch('/api/reports/categories');
            const result = await res.json();
            if (result.success) {
                renderCategoryChart(result.data);
            }
        } catch (err) {
            categoryChart.innerHTML = '<p class="text-error font-body-md text-center py-lg">خطأ في التحميل</p>';
        }
    }

    function renderCategoryChart(data) {
        if (!data || data.length === 0) {
            categoryChart.innerHTML = '<p class="text-on-surface-variant font-body-md text-center py-lg">لا توجد بيانات</p>';
            return;
        }

        const maxCount = Math.max(...data.map(d => d.count), 1);

        categoryChart.innerHTML = `
            <div class="space-y-md">
                ${data.map(d => {
                    const pct = Math.round((d.count / maxCount) * 100);
                    return `
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="font-label-sm text-label-sm text-on-background">${d.category}</span>
                                <span class="font-label-sm text-label-sm text-on-surface-variant">${d.count}</span>
                            </div>
                            <div class="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                                <div class="bg-primary h-3 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
    }

    // ── Brand Distribution ───────────────────────────────────────────────────
    async function loadBrands() {
        try {
            const res = await fetch('/api/reports/brands');
            const result = await res.json();
            if (result.success) {
                renderBrandChart(result.data);
            }
        } catch (err) {
            brandChart.innerHTML = '<p class="text-error font-body-md text-center py-lg">خطأ في التحميل</p>';
        }
    }

    function renderBrandChart(data) {
        if (!data || data.length === 0) {
            brandChart.innerHTML = '<p class="text-on-surface-variant font-body-md text-center py-lg">لا توجد بيانات</p>';
            return;
        }

        const maxCount = Math.max(...data.map(d => d.count), 1);

        brandChart.innerHTML = `
            <div class="space-y-md">
                ${data.map(d => {
                    const pct = Math.round((d.count / maxCount) * 100);
                    return `
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="font-label-sm text-label-sm text-on-background">${d.brand}</span>
                                <span class="font-label-sm text-label-sm text-on-surface-variant">${d.count}</span>
                            </div>
                            <div class="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                                <div class="bg-secondary h-3 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
    }

    // ── Monthly Report ───────────────────────────────────────────────────────
    async function loadMonthlyReport() {
        const month = reportMonth.value;
        const year = reportYear.value;

        monthlyReport.innerHTML = '<p class="text-on-surface-variant font-body-md text-center py-lg">جاري التحميل...</p>';

        try {
            const res = await fetch(`/api/reports/monthly?month=${month}&year=${year}`);
            const result = await res.json();
            if (result.success) {
                renderMonthlyReport(result.data);
            } else {
                monthlyReport.innerHTML = '<p class="text-error font-body-md text-center py-lg">خطأ في التحميل</p>';
            }
        } catch (err) {
            monthlyReport.innerHTML = '<p class="text-error font-body-md text-center py-lg">خطأ في الاتصال بالخادم</p>';
        }
    }

    function renderMonthlyReport(data) {
        if (!data) {
            monthlyReport.innerHTML = '<p class="text-on-surface-variant font-body-md text-center py-lg">لا توجد بيانات</p>';
            return;
        }

        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

        monthlyReport.innerHTML = `
            <div class="mb-md">
                <h4 class="font-title-md text-title-md text-on-background text-center mb-md">تقرير شهر ${monthNames[data.month - 1]} ${data.year}</h4>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                <div class="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                    <p class="font-caption-xs text-caption-xs text-emerald-700 mb-1">إجمالي الإضافات</p>
                    <p class="font-display-xl text-display-xl text-emerald-700">${data.totalIn}</p>
                </div>
                <div class="bg-rose-50 rounded-lg p-4 text-center border border-rose-100">
                    <p class="font-caption-xs text-caption-xs text-rose-700 mb-1">إجمالي الصرف</p>
                    <p class="font-display-xl text-display-xl text-rose-700">${data.totalOut}</p>
                </div>
                <div class="bg-indigo-50 rounded-lg p-4 text-center border border-indigo-100">
                    <p class="font-caption-xs text-caption-xs text-indigo-700 mb-1">إضافات الأحذية</p>
                    <p class="font-display-xl text-display-xl text-indigo-700">${data.shoeIn}</p>
                </div>
                <div class="bg-amber-50 rounded-lg p-4 text-center border border-amber-100">
                    <p class="font-caption-xs text-caption-xs text-amber-700 mb-1">صرف الأحذية</p>
                    <p class="font-display-xl text-display-xl text-amber-700">${data.shoeOut}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div class="bg-teal-50 rounded-lg p-4 text-center border border-teal-100">
                    <p class="font-caption-xs text-caption-xs text-teal-700 mb-1">إضافات التعبئة</p>
                    <p class="font-display-xl text-display-xl text-teal-700">${data.packagingIn}</p>
                </div>
                <div class="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                    <p class="font-caption-xs text-caption-xs text-orange-700 mb-1">صرف التعبئة</p>
                    <p class="font-display-xl text-display-xl text-orange-700">${data.packagingOut}</p>
                </div>
                <div class="bg-slate-50 rounded-lg p-4 text-center border border-slate-200 col-span-2">
                    <p class="font-caption-xs text-caption-xs text-slate-700 mb-1">إجمالي الحركات</p>
                    <p class="font-display-xl text-display-xl text-slate-700">${data.totalTransactions}</p>
                </div>
            </div>`;
    }

    // ── Events ───────────────────────────────────────────────────────────────
    loadMonthlyBtn.addEventListener('click', loadMonthlyReport);

    // ── Init ─────────────────────────────────────────────────────────────────
    loadStats();
    loadCategories();
    loadBrands();
    loadMonthlyReport();
});
