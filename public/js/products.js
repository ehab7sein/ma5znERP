document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('productsTableBody');
    const searchInput = document.getElementById('searchInput');
    
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');

    let allProducts = [];

    async function fetchProducts() {
        tableBody.innerHTML = Array(5).fill(document.getElementById('skeleton-table-row').innerHTML).join('');
        
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                allProducts = data.data;
                renderTable(allProducts);
            }
        } catch (err) {
            window.showToast?.('تعذر جلب البيانات', 'error');
        }
    }

    function renderTable(products) {
        tableBody.innerHTML = '';
        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="py-12 px-lg text-center text-on-surface-variant font-body-md">لا توجد موديلات</td></tr>`;
            return;
        }
        
        const tc = window.themeClasses || {};

        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = tc.tableRow || '';
            tr.onclick = (e) => {
                if (!e.target.closest('button')) {
                    window.location.href = `/products/${p.id}/sizes`;
                }
            };
            
            tr.innerHTML = `
                <td class="${tc.tdText}">${p.model_name}</td>
                <td class="${tc.tdMuted}">${p.category}</td>
                <td class="${tc.tdMuted}">${p.color}</td>
                <td class="${tc.tdMuted}">
                    <span class="${tc.chip}">${p.sizes_count} مقاس</span>
                </td>
                <td class="${tc.tdText} ${p.total_quantity > 0 ? 'text-emerald-600' : 'text-outline-variant'}">${p.total_quantity}</td>
                <td class="${tc.tdMuted} text-left">
                    <button class="${tc.btnEdit} edit-btn" data-id="${p.id}">edit</button>
                    <button class="${tc.btnDelete} delete-btn" data-id="${p.id}" data-name="${p.model_name}">delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach events to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const product = allProducts.find(x => x.id === id);
                if (product) openModal(product);
            };
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const name = e.currentTarget.dataset.name;
                window.showModal('تأكيد الحذف', `هل أنت متأكد من حذف الموديل "${name}"؟ سيتم حذف جميع المقاسات المرتبطة به.`, () => {
                    deleteProduct(id);
                });
            };
        });
    }

    // Modal Logic
    function openModal(product = null) {
        form.reset();
        if (product) {
            modalTitle.textContent = 'تعديل موديل';
            form.id.value = product.id;
            form.model_name.value = product.model_name;
            form.category.value = product.category;
            form.color.value = product.color;
            form.material.value = product.material || '';
            form.brand.value = product.brand || '';
            form.notes.value = product.notes || '';
        } else {
            modalTitle.textContent = 'إضافة موديل جديد';
            form.id.value = '';
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
            const url = id ? `/api/products/${id}` : '/api/products';
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
                fetchProducts();
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

    async function deleteProduct(id) {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                window.showToast?.(result.message, 'success');
                fetchProducts();
            } else {
                window.showToast?.(result.message, 'error');
            }
        } catch (err) {
            window.showToast?.('حدث خطأ', 'error');
        }
    }

    // Search Logic (Debounce)
    let timeout = null;
    searchInput.oninput = (e) => {
        clearTimeout(timeout);
        const val = e.target.value.trim().toLowerCase();
        timeout = setTimeout(() => {
            if (!val) {
                renderTable(allProducts);
                return;
            }
            const filtered = allProducts.filter(p => 
                (p.model_name && p.model_name.toLowerCase().includes(val)) ||
                (p.category && p.category.toLowerCase().includes(val)) ||
                (p.color && p.color.toLowerCase().includes(val)) ||
                (p.brand && p.brand.toLowerCase().includes(val))
            );
            renderTable(filtered);
        }, 300);
    };

    // Keyboard shortcut (Ctrl+K)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    fetchProducts();
});
