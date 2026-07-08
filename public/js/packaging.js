document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('packagingTableBody');
    const addBtn = document.getElementById('addBtn');
    const itemModal = document.getElementById('itemModal');
    const itemForm = document.getElementById('itemForm');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const qtyModal = document.getElementById('qtyModal');
    const qtyForm = document.getElementById('qtyForm');
    const qtyModalTitle = document.getElementById('qtyModalTitle');
    const qtyItemId = document.getElementById('qtyItemId');
    const qtyAction = document.getElementById('qtyAction');
    const qtyAmount = document.getElementById('qtyAmount');
    const qtyReason = document.getElementById('qtyReason');
    const qtyReasonGroup = document.getElementById('qtyReasonGroup');
    const qtyNotes = document.getElementById('qtyNotes');
    const qtySaveBtn = document.getElementById('qtySaveBtn');
    const qtyCancelBtn = document.getElementById('qtyCancelBtn');
    const qtyBalanceContainer = document.getElementById('qtyBalanceContainer');
    const qtyCurrentBalance = document.getElementById('qtyCurrentBalance');

    let allItems = [];

    // ── Fetch ────────────────────────────────────────────────────────────────
    async function fetchItems() {
        renderSkeletons();
        try {
            const res = await fetch('/api/packaging');
            const result = await res.json();
            if (result.success) {
                allItems = result.data || [];
                renderTable(allItems);
            } else {
                window.showToast?.(result.message || 'تعذر جلب البيانات', 'error');
                renderEmpty();
            }
        } catch (err) {
            window.showToast?.('خطأ في الاتصال بالخادم', 'error');
            renderEmpty();
        }
    }

    function renderSkeletons() {
        tableBody.innerHTML = Array(4).fill(`
            <tr class="animate-pulse">
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-32"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-12"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-10"></div></td>
                <td class="py-3 px-lg"><div class="h-5 bg-surface-container-high rounded-full w-20"></div></td>
                <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-40"></div></td>
            </tr>`).join('');
    }

    function renderEmpty() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="py-12 text-center">
                    <span class="material-symbols-outlined text-4xl text-outline block mb-2">package_2</span>
                    <p class="text-on-surface-variant font-body-md">لا توجد مواد تغليف مسجلة</p>
                </td>
            </tr>`;
    }

    function renderTable(items) {
        tableBody.innerHTML = '';

        if (!items || items.length === 0) {
            renderEmpty();
            return;
        }

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors';
            const isLowStock = item.quantity <= item.minimum_quantity && item.quantity > 0;
            const isEmpty = item.quantity === 0;
            const qtyColor = isEmpty ? 'text-error' : isLowStock ? 'text-amber-600' : 'text-emerald-600';

            let chipHtml;
            if (isEmpty) {
                chipHtml = `<span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">نفد</span>`;
            } else if (isLowStock) {
                chipHtml = `<span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">قارب على النفاذ</span>`;
            } else {
                chipHtml = `<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-caption-xs font-bold inline-block">متوفر</span>`;
            }

            tr.innerHTML = `
                <td data-label="الاسم" class="py-3 px-lg text-body-md text-on-background font-bold">${item.name}</td>
                <td data-label="الكمية" class="py-3 px-lg text-body-md font-bold ${qtyColor}">${item.quantity}</td>
                <td data-label="الحد الأدنى" class="py-3 px-lg text-body-md text-on-surface-variant">${item.minimum_quantity}</td>
                <td data-label="الحالة" class="py-3 px-lg">${chipHtml}</td>
                <td data-label="" class="py-3 px-lg text-left whitespace-nowrap">
                    <button class="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px] ml-1 qty-in-btn" data-id="${item.id}" title="إضافة كمية">add_circle</button>
                    <button class="text-amber-600 hover:bg-amber-50 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px] ml-1 qty-out-btn" data-id="${item.id}" title="صرف كمية">remove_circle</button>
                    <button class="text-primary hover:bg-primary-container/10 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px] ml-1 edit-btn" data-id="${item.id}" title="تعديل">edit</button>
                    <button class="text-error hover:bg-error-container/20 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px] delete-btn" data-id="${item.id}" data-name="${item.name}" title="حذف">delete</button>
                </td>`;

            tableBody.appendChild(tr);
        });

        // Event delegation for action buttons
        tableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const item = allItems.find(x => String(x.id) === String(id));
                if (item) openModal(item);
            };
        });

        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                window.showModal?.('تأكيد الحذف', `هل أنت متأكد من حذف "${name}"؟`, () => deleteItem(id));
            };
        });

        tableBody.querySelectorAll('.qty-in-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const item = allItems.find(x => String(x.id) === String(id));
                if (item) openQtyModal(item, 'in');
            };
        });

        tableBody.querySelectorAll('.qty-out-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const item = allItems.find(x => String(x.id) === String(id));
                if (item) openQtyModal(item, 'out');
            };
        });
    }

    // ── Add/Edit Modal ──────────────────────────────────────────────────────
    function openModal(item = null) {
        itemForm.reset();
        if (item) {
            modalTitle.innerHTML = '<span class="material-symbols-outlined text-primary">edit_square</span> تعديل مادة التغليف';
            itemForm.id.value = item.id;
            itemForm.name.value = item.name;
            itemForm.quantity.value = item.quantity;
            itemForm.minimum_quantity.value = item.minimum_quantity;
        } else {
            modalTitle.innerHTML = '<span class="material-symbols-outlined text-primary">package_2</span> إضافة مادة جديدة';
            itemForm.id.value = '';
        }
        itemModal.classList.remove('hidden');
    }

    function closeModal() { itemModal.classList.add('hidden'); }
    cancelBtn.onclick = closeModal;
    addBtn.onclick = () => openModal();

    itemForm.onsubmit = async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = 'جاري الحفظ...';

        const formData = new FormData(itemForm);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        try {
            const url = id ? `/api/packaging/${id}` : '/api/packaging';
            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                window.showToast?.(result.message, 'success');
                closeModal();
                fetchItems();
            } else {
                window.showToast?.(result.message || 'حدث خطأ', 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ في الاتصال', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'حفظ';
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────
    async function deleteItem(id) {
        try {
            const res = await fetch(`/api/packaging/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                window.showToast?.(result.message, 'success');
                fetchItems();
            } else {
                window.showToast?.(result.message || 'حدث خطأ', 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ في الاتصال', 'error');
        }
    }

    // ── Quantity Modal ──────────────────────────────────────────────────────
    function openQtyModal(item, action) {
        qtyForm.reset();
        qtyItemId.value = item.id;
        qtyAction.value = action;

        if (action === 'in') {
            qtyModalTitle.innerHTML = '<span class="material-symbols-outlined text-primary">add_box</span> إضافة كمية';
            qtyBalanceContainer.style.display = 'flex';
            qtyCurrentBalance.textContent = item.quantity;
            qtyReasonGroup.classList.add('hidden');
            qtyReason.disabled = true;
            qtySaveBtn.textContent = 'إضافة';
        } else {
            qtyModalTitle.innerHTML = '<span class="material-symbols-outlined text-primary">remove_circle</span> صرف كمية';
            qtyBalanceContainer.style.display = 'flex';
            qtyCurrentBalance.textContent = item.quantity;
            qtyReasonGroup.classList.remove('hidden');
            qtyReason.disabled = false;
            qtySaveBtn.textContent = 'صرف';
        }

        qtyModal.classList.remove('hidden');
    }

    function closeQtyModal() { qtyModal.classList.add('hidden'); }
    qtyCancelBtn.onclick = closeQtyModal;

    qtyForm.onsubmit = async (e) => {
        e.preventDefault();
        qtySaveBtn.disabled = true;
        qtySaveBtn.textContent = 'جاري التنفيذ...';

        const id = qtyItemId.value;
        const action = qtyAction.value;
        const quantity = Number(qtyAmount.value);
        const notes = qtyNotes.value.trim();

        if (!Number.isInteger(quantity) || quantity <= 0) {
            window.showToast?.('الكمية يجب أن تكون رقماً صحيحاً أكبر من صفر', 'warning');
            qtySaveBtn.disabled = false;
            qtySaveBtn.textContent = action === 'in' ? 'إضافة' : 'صرف';
            return;
        }

        try {
            const body = { quantity, notes };
            if (action === 'out') body.reason = qtyReason.value;

            const res = await fetch(`/api/packaging/${id}/${action === 'in' ? 'in' : 'out'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await res.json();

            if (result.success) {
                window.showToast?.(result.message, 'success');
                closeQtyModal();
                fetchItems();
            } else {
                window.showToast?.(result.message || 'حدث خطأ', 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ في الاتصال', 'error');
        } finally {
            qtySaveBtn.disabled = false;
            qtySaveBtn.textContent = action === 'in' ? 'إضافة' : 'صرف';
        }
    };

    // ── Init ─────────────────────────────────────────────────────────────────
    fetchItems();
});
