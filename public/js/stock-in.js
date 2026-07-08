document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('stockInForm');
    const productSelect = document.getElementById('productSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const balanceContainer = document.getElementById('balanceContainer');
    const currentBalanceEl = document.getElementById('currentBalance');
    const quantityInput = document.getElementById('quantityInput');
    const submitBtn = document.getElementById('submitBtn');

    let currentSizes = [];

    async function loadProducts() {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();

            if (data.success) {
                productSelect.innerHTML = '<option value="">اختر الموديل...</option>';
                data.data.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.textContent = `${p.model_name} - ${p.color} (${p.category})`;
                    productSelect.appendChild(option);
                });
            }
        } catch (err) {
            window.showToast?.('تعذر تحميل الموديلات', 'error');
            productSelect.innerHTML = '<option value="">خطأ في التحميل</option>';
        }
    }

    productSelect.addEventListener('change', async (e) => {
        const productId = e.target.value;

        sizeSelect.innerHTML = '<option value="">اختر المقاس...</option>';
        sizeSelect.disabled = true;

        balanceContainer.style.display = 'none';
        quantityInput.value = '';
        quantityInput.disabled = true;
        submitBtn.disabled = true;

        if (!productId) return;

        try {
            const res = await fetch(`/api/products/${productId}/sizes`);
            const data = await res.json();

            if (data.success) {
                currentSizes = data.data;

                if (currentSizes.length === 0) {
                    sizeSelect.innerHTML = '<option value="">لا توجد مقاسات مسجلة</option>';
                } else {
                    currentSizes.forEach(s => {
                        const option = document.createElement('option');
                        option.value = s.id;
                        option.textContent = `مقاس ${s.size} (الرصيد: ${s.quantity})`;
                        sizeSelect.appendChild(option);
                    });
                    sizeSelect.disabled = false;
                }
            }
        } catch (err) {
            window.showToast?.('تعذر تحميل المقاسات', 'error');
        }
    });

    sizeSelect.addEventListener('change', (e) => {
        const sizeId = e.target.value;
        quantityInput.value = '';
        submitBtn.disabled = true;

        if (!sizeId) {
            balanceContainer.style.display = 'none';
            quantityInput.disabled = true;
            return;
        }

        const selectedSize = currentSizes.find(s => s.id === sizeId);
        if (selectedSize) {
            currentBalanceEl.textContent = selectedSize.quantity;
            balanceContainer.style.display = 'flex';
            quantityInput.disabled = false;
        }
    });

    quantityInput.addEventListener('input', () => {
        const val = Number(quantityInput.value);
        if (Number.isInteger(val) && val > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });

    async function refreshSizesSelect(productId, sizeIdToKeep) {
        try {
            const res = await fetch(`/api/products/${productId}/sizes`);
            const data = await res.json();
            if (!data.success) return;

            const sizes = data.data || [];
            const selectedSize = sizes.find(s => String(s.id) === String(sizeIdToKeep));

            sizeSelect.innerHTML = '<option value="">اختر المقاس...</option>';
            sizes.forEach(s => {
                const option = document.createElement('option');
                option.value = s.id;
                option.textContent = `مقاس ${s.size} (الرصيد: ${s.quantity})`;
                sizeSelect.appendChild(option);
            });
            sizeSelect.disabled = sizes.length === 0;

            if (selectedSize) {
                sizeSelect.value = selectedSize.id;
                currentBalanceEl.textContent = selectedSize.quantity;
                balanceContainer.style.display = 'flex';
            }
        } catch (err) {
            // silent
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productId = productSelect.value;
        const sizeId = sizeSelect.value;
        const quantity = Number(quantityInput.value);

        if (!productId) {
            window.showToast?.('يرجى اختيار الموديل', 'warning');
            return;
        }
        if (!sizeId) {
            window.showToast?.('يرجى اختيار المقاس', 'warning');
            return;
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
            window.showToast?.('الكمية يجب أن تكون رقماً صحيحاً أكبر من صفر', 'warning');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري الإضافة...';

        try {
            const res = await fetch('/api/transactions/in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    product_size_id: sizeId,
                    quantity: quantity,
                    supplier: form.supplier.value.trim(),
                    notes: form.notes.value.trim()
                })
            });
            const result = await res.json();

            if (result.success) {
                window.showToast?.(result.message, 'success');
                form.reset();
                productSelect.dispatchEvent(new Event('change'));
            } else {
                window.showToast?.(result.message || 'حدث خطأ أثناء الحفظ', 'error');
                submitBtn.disabled = false;
            }
        } catch (err) {
            window.showToast?.('تعذر الاتصال بالخادم', 'error');
            submitBtn.disabled = false;
        } finally {
            submitBtn.textContent = originalText;
        }
    });

    loadProducts();
});
