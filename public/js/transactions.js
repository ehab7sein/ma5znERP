document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('transactionsTableBody');
    const filterSearch = document.getElementById('filterSearch');
    const filterType = document.getElementById('filterType');
    const filterItemType = document.getElementById('filterItemType');
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const applyBtn = document.getElementById('applyFiltersBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const paginationInfo = document.getElementById('paginationInfo');

    let currentPage = 1;
    let totalCount = 0;
    const limit = 50;

    function formatDate(iso) {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatTime(iso) {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    }

    function getStatusChip(transactionType) {
        if (transactionType === 'IN') {
            return `<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">إضافة</span>`;
        }
        return `<span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">صرف</span>`;
    }

    function getItemTypeChip(itemType) {
        if (itemType === 'shoe') {
            return `<span class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">حذاء</span>`;
        }
        return `<span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">تعبئة</span>`;
    }

    function renderSkeletons() {
        tableBody.innerHTML = Array(5).fill(`
            <tr class="animate-pulse">
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-20"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-12"></div></td>
                <td class="py-3 px-lg"><div class="h-5 bg-surface-container-high rounded-full w-14"></div></td>
                <td class="py-3 px-lg"><div class="h-5 bg-surface-container-high rounded-full w-14"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-24"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-12"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-10"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-10"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-10"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-16"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-20"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-20"></div></td>
            </tr>`).join('');
    }

    function renderEmpty() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="12" class="py-12 text-center">
                    <span class="material-symbols-outlined text-4xl text-outline block mb-2">history_toggle_off</span>
                    <p class="text-on-surface-variant font-body-md">لا توجد حركات مطابقة للفلترة</p>
                </td>
            </tr>`;
    }

    async function fetchTransactions(page = 1) {
        renderSkeletons();
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', limit);

        if (filterSearch.value.trim()) params.set('search', filterSearch.value.trim());
        if (filterType.value) params.set('type', filterType.value);
        if (filterItemType.value) params.set('itemType', filterItemType.value);
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value);
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value);

        try {
            const res = await fetch(`/api/transactions?${params}`);
            const result = await res.json();

            if (result.success) {
                totalCount = result.count || 0;
                currentPage = result.page || 1;
                renderTable(result.data || []);
                updatePagination();
            } else {
                window.showToast?.(result.message || 'تعذر جلب البيانات', 'error');
                renderEmpty();
            }
        } catch (err) {
            window.showToast?.('خطأ في الاتصال بالخادم', 'error');
            renderEmpty();
        }
    }

    function renderTable(transactions) {
        tableBody.innerHTML = '';

        if (!transactions || transactions.length === 0) {
            renderEmpty();
            return;
        }

        transactions.forEach(tx => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors';
            const qtyColor = tx.transaction_type === 'IN' ? 'text-emerald-600' : 'text-rose-600';

            tr.innerHTML = `
                <td class="py-3 px-lg text-body-md text-on-surface-variant text-nowrap">${formatDate(tx.created_at)}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant">${formatTime(tx.created_at)}</td>
                <td class="py-3 px-lg">${getStatusChip(tx.transaction_type)}</td>
                <td class="py-3 px-lg">${getItemTypeChip(tx.item_type)}</td>
                <td class="py-3 px-lg text-body-md text-on-background font-bold">${tx.item_name || '-'}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant">${tx.size || '-'}</td>
                <td class="py-3 px-lg text-body-md font-bold ${qtyColor}">${tx.quantity}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant">${tx.balance_before}</td>
                <td class="py-3 px-lg text-body-md text-on-background font-bold">${tx.balance_after}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant">${tx.username || '-'}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant">${tx.supplier_or_receiver || '-'}</td>
                <td class="py-3 px-lg text-body-md text-on-surface-variant max-w-[120px] truncate" title="${tx.notes || ''}">${tx.notes || '-'}</td>`;

            tableBody.appendChild(tr);
        });
    }

    function updatePagination() {
        const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
        pageIndicator.textContent = `${currentPage} / ${totalPages}`;
        paginationInfo.textContent = `${totalCount} نتيجة`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    applyBtn.addEventListener('click', () => fetchTransactions(1));
    clearBtn.addEventListener('click', () => {
        filterSearch.value = '';
        filterType.value = '';
        filterItemType.value = '';
        filterDateFrom.value = '';
        filterDateTo.value = '';
        fetchTransactions(1);
    });

    // Enter key to search
    filterSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchTransactions(1);
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) fetchTransactions(currentPage - 1);
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalCount / limit);
        if (currentPage < totalPages) fetchTransactions(currentPage + 1);
    });

    fetchTransactions(1);
});
