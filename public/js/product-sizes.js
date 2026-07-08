document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('sizesTableBody');
    const modal = document.getElementById('sizeModal');
    const form = document.getElementById('sizeForm');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    const quantityGroup = document.getElementById('quantityGroup');

    const tc = window.themeClasses || {};

    let allSizes = [];

    // ── Skeleton ────────────────────────────────────────────────────────────
    function renderSkeletons() {
        const template = document.getElementById('skeleton-table-row');
        tableBody.innerHTML = '';
        if (template) {
            for (let i = 0; i < 4; i++) {
                tableBody.appendChild(template.content.cloneNode(true));
            }
        } else {
            // Fallback inline skeleton
            tableBody.innerHTML = Array(4).fill(`
                <tr class="animate-pulse border-b border-outline-variant">
                    <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-16"></div></td>
                    <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-12"></div></td>
                    <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-10"></div></td>
                    <td class="py-3 px-lg"><div class="h-5 bg-surface-container-high rounded-full w-20"></div></td>
                    <td class="py-3 px-lg"><div class="h-4 bg-surface-container-high rounded w-24"></div></td>
                </tr>`).join('');
        }
    }

    // ── Fetch ────────────────────────────────────────────────────────────────
    async function fetchSizes() {
        renderSkeletons();
        try {
            const res = await fetch(`/api/products/${currentProductId}/sizes`);
            const data = await res.json();
            if (data.success) {
                allSizes = data.data;
                renderTable(allSizes);
            } else {
                window.showToast?.('تعذر جلب البيانات', 'error');
                tableBody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-on-surface-variant">تعذر تحميل البيانات</td></tr>`;
            }
        } catch (err) {
            console.error('fetchSizes error:', err);
            window.showToast?.('تعذر جلب البيانات', 'error');
            tableBody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-on-surface-variant">خطأ في الاتصال بالخادم</td></tr>`;
        }
    }

    // ── Render Table ─────────────────────────────────────────────────────────
    function renderTable(sizes) {
        tableBody.innerHTML = '';

        if (!sizes || sizes.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-12 text-center">
                        <span class="material-symbols-outlined text-4xl text-outline block mb-2">format_size</span>
                        <p class="text-on-surface-variant font-body-md">لا توجد مقاسات مسجلة لهذا الموديل</p>
                    </td>
                </tr>`;
            return;
        }

        sizes.forEach(s => {
            const tr = document.createElement('tr');
            const isLowStock = s.quantity <= s.minimum_quantity && s.quantity > 0;
            const isEmpty    = s.quantity === 0;

            tr.className = tc.tableRow || 'hover:bg-slate-50 transition-colors';

            let chipHtml;
            if (isEmpty) {
                chipHtml = `<span class="${tc.chipError || 'bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold inline-block'}">نفد</span>`;
            } else if (isLowStock) {
                chipHtml = `<span class="${tc.chipWarning || 'bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold inline-block'}">قارب على النفاذ</span>`;
            } else {
                chipHtml = `<span class="${tc.chipSuccess || 'bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold inline-block'}">متوفر</span>`;
            }

            const qtyColor = isEmpty ? 'text-error' : isLowStock ? 'text-amber-600' : 'text-emerald-600';

            tr.innerHTML = `
                <td class="${tc.tdText || 'py-3 px-lg text-body-md text-on-background font-bold'}">${s.size}</td>
                <td class="py-3 px-lg text-body-md font-bold ${qtyColor}">${s.quantity}</td>
                <td class="${tc.tdMuted || 'py-3 px-lg text-body-md text-on-surface-variant'}">${s.minimum_quantity}</td>
                <td class="py-3 px-lg">${chipHtml}</td>
                <td class="py-3 px-lg">
                    <button class="${tc.btnEdit || 'text-primary hover:bg-primary-container/10 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px] ml-1'} edit-btn" data-id="${s.id}">edit</button>
                    <button class="${tc.btnDelete || 'text-error hover:bg-error-container/20 p-1.5 rounded-md transition-colors material-symbols-outlined text-[20px]'} delete-btn" data-id="${s.id}" data-size="${s.size}">delete</button>
                </td>`;

            tableBody.appendChild(tr);
        });

        // Edit buttons
        tableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                // Compare as strings to avoid type mismatch
                const id = String(e.currentTarget.dataset.id);
                const size = allSizes.find(x => String(x.id) === id);
                if (size) openModal(size);
            };
        });

        // Delete buttons
        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id    = e.currentTarget.dataset.id;
                const label = e.currentTarget.dataset.size;
                window.showModal?.('تأكيد الحذف', `هل أنت متأكد من حذف مقاس "${label}"؟`, () => deleteSize(id));
            };
        });
    }

    // ── Modal ────────────────────────────────────────────────────────────────
    function openModal(size = null) {
        form.reset();
        if (size) {
            modalTitle.textContent = 'تعديل المقاس';
            form.id.value = size.id;
            form.size.value = size.size;
            form.minimum_quantity.value = size.minimum_quantity;
            quantityGroup.classList.add('hidden');
            form.quantity.removeAttribute('required');
        } else {
            modalTitle.textContent = 'إضافة مقاس جديد';
            form.id.value = '';
            quantityGroup.classList.remove('hidden');
            form.quantity.setAttribute('required', 'required');
        }
        modal.classList.remove('hidden');
    }

    function closeModal() { modal.classList.add('hidden'); }

    addBtn.onclick    = () => openModal();
    cancelBtn.onclick = closeModal;

    // ── Form Submit ──────────────────────────────────────────────────────────
    form.onsubmit = async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = 'جاري الحفظ...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        try {
            const url    = id ? `/api/sizes/${id}` : `/api/products/${currentProductId}/sizes`;
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
                fetchSizes();
            } else {
                window.showToast?.(result.message || 'حدث خطأ', 'error');
            }
        } catch (err) {
            console.error('saveSize error:', err);
            window.showToast?.('حدث خطأ في الاتصال', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'حفظ';
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    async function deleteSize(id) {
        try {
            const res = await fetch(`/api/sizes/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                window.showToast?.(result.message, 'success');
                fetchSizes();
            } else {
                window.showToast?.(result.message || 'حدث خطأ', 'error');
            }
        } catch (err) {
            console.error('deleteSize error:', err);
            window.showToast?.('حدث خطأ في الاتصال', 'error');
        }
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    fetchSizes();
});
