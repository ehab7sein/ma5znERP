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
            refreshBtn.querySelector('svg').classList.add('animate-spin');
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
                refreshBtn.querySelector('svg').classList.remove('animate-spin');
            }
        }
    }

    function renderStats(stats) {
        statsGrid.innerHTML = '';
        const template = document.getElementById('stat-card-template');

        statCardsConfig.forEach(config => {
            const clone = template.content.cloneNode(true);
            const card = clone.querySelector('div');
            const iconContainer = clone.querySelector('.icon-container');
            const title = clone.querySelector('.stat-title');
            const value = clone.querySelector('.stat-value');

            card.classList.add(config.border);
            iconContainer.classList.add(config.color, config.text);
            iconContainer.textContent = config.icon;
            title.textContent = config.title;
            value.textContent = stats[config.id] || 0;

            statsGrid.appendChild(clone);
        });
    }

    function renderRecent(transactions) {
        recentTableBody.innerHTML = '';
        
        if (!transactions || transactions.length === 0) {
            recentTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">لا توجد حركات حديثة</td></tr>`;
            return;
        }

        transactions.forEach(tx => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            const date = new Date(tx.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
            
            let typeHtml = '';
            if (tx.transaction_type === 'IN') {
                typeHtml = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">إضافة</span>`;
            } else {
                typeHtml = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">صرف</span>`;
            }

            let itemTypeHtml = tx.item_type === 'shoe' ? 'حذاء' : 'مواد تعبئة';

            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
                <td class="px-6 py-4 whitespace-nowrap">${typeHtml}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${itemTypeHtml}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.transaction_type === 'IN' ? 'text-green-600' : 'text-red-600'}">
                    ${tx.transaction_type === 'IN' ? '+' : '-'}${tx.quantity}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tx.created_by || 'النظام'}</td>
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
