document.addEventListener('DOMContentLoaded', () => {
    const statsGrid = document.getElementById('statsGrid');
    const recentTableBody = document.getElementById('recentTableBody');
    const refreshBtn = document.getElementById('refreshBtn');

    const statCardsConfig = [
        { id: 'totalProducts', title: 'إجمالي الموديلات', icon: '👞', color: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' },
        { id: 'totalSizes', title: 'إجمالي المقاسات المتاحة', icon: '📏', color: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
        { id: 'totalShoesQuantity', title: 'إجمالي كمية الأحذية', icon: '📦', color: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
        { id: 'totalPackagingQuantity', title: 'إجمالي مواد التعبئة', icon: '🛍️', color: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' },
        { id: 'lowStockShoesCount', title: 'أحذية قاربت على الانتهاء', icon: '⚠️', color: 'bg-red-100', text: 'text-red-600', border: 'border-red-500' },
        { id: 'lowStockPackagingCount', title: 'مواد تعبئة قاربت على الانتهاء', icon: '🚨', color: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' },
        { id: 'dailyTransactionsCount', title: 'عمليات اليوم', icon: '🔄', color: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' }
    ];

    function renderSkeletons() {
        const cardTemplate = document.getElementById('skeleton-card');
        const rowTemplate = document.getElementById('skeleton-table-row');

        statsGrid.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            statsGrid.appendChild(cardTemplate.content.cloneNode(true));
        }

        recentTableBody.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            recentTableBody.appendChild(rowTemplate.content.cloneNode(true));
        }
    }

    async function fetchDashboardData() {
        renderSkeletons();
        
        if (refreshBtn) {
            refreshBtn.classList.add('opacity-50', 'cursor-not-allowed');
            const refreshIcon = refreshBtn.querySelector('.material-symbols-outlined');
            if (refreshIcon) refreshIcon.classList.add('animate-spin');
        }

        try {
            const res = await fetch('/api/dashboard/stats');
            const data = await res.json();
            
            if (data.success) {
                renderStats(data.stats);
                renderRecent(data.recentTransactions);
            } else {
                window.showToast?.('تعذر جلب البيانات', 'error');
            }
        } catch (err) {
            console.error(err);
            window.showToast?.('حدث خطأ في الاتصال بالخادم', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                const refreshIcon = refreshBtn.querySelector('.material-symbols-outlined');
                if (refreshIcon) refreshIcon.classList.remove('animate-spin');
            }
        }
    }

    function renderStats(stats) {
        statsGrid.innerHTML = '';
        const template = document.getElementById('stat-card-template');
        const wideTemplate = document.getElementById('stat-card-wide-template');
        
        const overrides = window.dashboardThemeOverride || {};

        statCardsConfig.forEach(config => {
            const override = overrides[config.id] || {};
            const isWide = override.wide;
            
            const clone = (isWide ? wideTemplate : template).content.cloneNode(true);
            const title = clone.querySelector('.stat-title');
            const value = clone.querySelector('.stat-value');
            const iconContainer = clone.querySelector('.stat-icon-container');
            const borderColor = clone.querySelector('.stat-border-color');
            const icon = clone.querySelector('.material-symbols-outlined');
            const subtitle = clone.querySelector('.stat-subtitle');

            title.textContent = config.title;
            value.textContent = stats[config.id] || 0;
            
            if (icon) icon.textContent = override.icon || 'analytics';
            
            if (override.border && borderColor) {
                borderColor.classList.add(override.border);
            }
            
            if (!isWide && override.color && iconContainer) {
                const colors = override.color.split(' ');
                colors.forEach(c => iconContainer.classList.add(c));
            }

            if (subtitle && override.subtitle) {
                subtitle.textContent = override.subtitle;
                subtitle.classList.remove('hidden');
                
                // Inherit text color from icon container text color
                const textCol = (override.color || '').match(/text-[a-z]+-[0-9]+/);
                if (textCol) subtitle.classList.add(textCol[0]);
            }

            statsGrid.appendChild(clone);
        });
        
        const operationsCountEl = document.getElementById('todayOperationsCount');
        if (operationsCountEl) {
            operationsCountEl.textContent = stats.dailyTransactionsCount || 0;
        }
    }

    function renderRecent(transactions) {
        recentTableBody.innerHTML = '';
        
        if (!transactions || transactions.length === 0) {
            recentTableBody.innerHTML = `<tr><td colspan="4" class="py-12 text-center text-on-surface-variant font-body-md">لا توجد حركات حديثة</td></tr>`;
            return;
        }

        transactions.forEach(tx => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors group';
            
            const date = new Date(tx.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
            
            let typeHtml = '';
            if (tx.transaction_type === 'IN') {
                typeHtml = `<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">إضافة</span>`;
            } else {
                typeHtml = `<span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">صرف</span>`;
            }

            let itemTypeHtml = tx.item_type === 'shoe' ? 'حذاء' : 'مواد تعبئة';

            tr.innerHTML = `
                <td data-label="التاريخ" class="py-3 px-lg text-body-md text-on-background">${date}</td>
                <td data-label="النوع" class="py-3 px-lg text-body-md">${typeHtml}</td>
                <td data-label="العنصر" class="py-3 px-lg text-body-md text-on-background">${itemTypeHtml}</td>
                <td data-label="الكمية" class="py-3 px-lg text-body-md font-bold ${tx.transaction_type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}">
                    ${tx.transaction_type === 'IN' ? '+' : '-'}${tx.quantity}
                </td>
            `;
            recentTableBody.appendChild(tr);
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchDashboardData);
    }

    // Initial fetch
    fetchDashboardData();
    
    // Auto refresh every 60s
    setInterval(fetchDashboardData, 60000);
});
