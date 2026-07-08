document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('productSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const balanceContainer = document.getElementById('balanceContainer');
    const currentBalanceEl = document.getElementById('currentBalance');
    const quantityInput = document.getElementById('quantityInput');
    const quantityWarning = document.getElementById('quantityWarning');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('stockOutForm');

    let currentSizes = [];
    let availableBalance = 0;

    // Fetch Products on load
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

    // When Product changes, fetch its sizes
    productSelect.addEventListener('change', async (e) => {
        const productId = e.target.value;
        
        // Reset dependent fields
        sizeSelect.innerHTML = '<option value="">اختر المقاس...</option>';
        sizeSelect.disabled = true;
        sizeSelect.classList.add('bg-gray-50');
        
        balanceContainer.style.display = 'none';
        quantityInput.value = '';
        quantityInput.disabled = true;
        quantityInput.classList.add('bg-gray-50');
        quantityInput.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        quantityWarning.classList.add('hidden');
        submitBtn.disabled = true;
        availableBalance = 0;

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
                        option.textContent = `مقاس ${s.size} (متوفر: ${s.quantity})`;
                        // Optionally disable sizes that are out of stock
                        if (s.quantity === 0) option.disabled = true;
                        sizeSelect.appendChild(option);
                    });
                    sizeSelect.disabled = false;
                    sizeSelect.classList.remove('bg-gray-50');
                }
            }
        } catch (err) {
            window.showToast?.('تعذر تحميل المقاسات', 'error');
        }
    });

    // When Size changes, show balance and enable quantity input
    sizeSelect.addEventListener('change', (e) => {
        const sizeId = e.target.value;
        quantityInput.value = '';
        quantityInput.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        quantityWarning.classList.add('hidden');
        submitBtn.disabled = true;

        if (!sizeId) {
            balanceContainer.style.display = 'none';
            quantityInput.disabled = true;
            quantityInput.classList.add('bg-gray-50');
            return;
        }

        const selectedSize = currentSizes.find(s => s.id === sizeId);
        if (selectedSize) {
            availableBalance = selectedSize.quantity;
            currentBalanceEl.textContent = availableBalance;
            balanceContainer.style.display = 'flex';
            
            quantityInput.disabled = false;
            quantityInput.classList.remove('bg-gray-50');
        }
    });

    // Live validation for quantity vs balance
    quantityInput.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        
        if (val > availableBalance) {
            quantityInput.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            quantityWarning.classList.remove('hidden');
            submitBtn.disabled = true;
        } else if (val > 0) {
            quantityInput.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            quantityWarning.classList.add('hidden');
            submitBtn.disabled = false;
        } else {
            quantityInput.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            quantityWarning.classList.add('hidden');
            submitBtn.disabled = true;
        }
    });

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (Number(quantityInput.value) > availableBalance) {
            window.showToast?.('الكمية المطلوبة أكبر من المتوفر!', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري التنفيذ...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/transactions/out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (result.success) {
                window.showToast?.(result.message, 'success');
                // Reset form
                form.reset();
                productSelect.dispatchEvent(new Event('change')); // Trigger reset of dependencies
            } else {
                window.showToast?.(result.message, 'error');
                submitBtn.disabled = false;
            }
        } catch (err) {
            window.showToast?.('حدث خطأ أثناء الصرف', 'error');
            submitBtn.disabled = false;
        } finally {
            submitBtn.textContent = originalText;
        }
    });

    // Init
    loadProducts();
});
