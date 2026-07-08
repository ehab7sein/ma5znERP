document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('sizesTableBody');
    const modal = document.getElementById('sizeModal');
    const form = document.getElementById('sizeForm');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    const quantityGroup = document.getElementById('quantityGroup');

    let allSizes = [];

    async function fetchSizes() {
        tableBody.innerHTML = Array(3).fill(document.getElementById('skeleton-table-row').innerHTML).join('');
        
        try {
            const res = await fetch(`/api/products/${currentProductId}/sizes`);
            const data = await res.json();
            if (data.success) {
                allSizes = data.data;
                renderTable(allSizes);
            }
        } catch (err) {
            window.showToast?.('تعذر جلب البيانات', 'error');
        }
    }

    function renderTable(sizes) {
        tableBody.innerHTML = '';
        if (sizes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">لا توجد مقاسات مسجلة لهذا الموديل</td></tr>`;
            return;
        }

        sizes.forEach(s => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            const isLowStock = s.quantity <= s.minimum_quantity;
            let statusHtml = '';
            
            if (s.quantity === 0) {
                statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">نفد</span>';
                tr.classList.add('bg-red-50');
            } else if (isLowStock) {
                statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">قارب على النفاذ</span>';
                tr.classList.add('bg-yellow-50');
            } else {
                statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">متوفر</span>';
            }

            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${s.size}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}">${s.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${s.minimum_quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusHtml}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 ml-3 edit-btn" data-id="${s.id}">تعديل</button>
                    <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${s.id}" data-size="${s.size}">حذف</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const size = allSizes.find(x => x.id === id);
                if (size) openModal(size);
            };
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const size = e.currentTarget.dataset.size;
                window.showModal('تأكيد الحذف', `هل أنت متأكد من حذف مقاس "${size}"؟`, () => {
                    deleteSize(id);
                });
            };
        });
    }

    function openModal(size = null) {
        form.reset();
        if (size) {
            modalTitle.textContent = 'تعديل المقاس';
            form.id.value = size.id;
            form.size.value = size.size;
            form.minimum_quantity.value = size.minimum_quantity;
            quantityGroup.classList.add('hidden'); // Hide quantity on update
            form.quantity.removeAttribute('required');
        } else {
            modalTitle.textContent = 'إضافة مقاس جديد';
            form.id.value = '';
            quantityGroup.classList.remove('hidden');
            form.quantity.setAttribute('required', 'required');
        }
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    addBtn.onclick = () => openModal();
    cancelBtn.onclick = closeModal;

    form.onsubmit = async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = 'جاري الحفظ...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        try {
            const url = id ? `/api/sizes/${id}` : `/api/products/${currentProductId}/sizes`;
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
                window.showToast?.(result.message, 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'حفظ';
        }
    };

    async function deleteSize(id) {
        try {
            const res = await fetch(`/api/sizes/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                window.showToast?.(result.message, 'success');
                fetchSizes();
            } else {
                window.showToast?.(result.message, 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ', 'error');
        }
    }

    fetchSizes();
});
