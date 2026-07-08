document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toastContainer = document.getElementById('toast-container');
    const toastMessage = document.getElementById('toast-message');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    function showToast(message, type = 'error') {
        toastMessage.textContent = message;
        toastContainer.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
        
        if (type === 'error') {
            toastContainer.classList.add('bg-red-100', 'text-red-700');
        } else {
            toastContainer.classList.add('bg-green-100', 'text-green-700');
        }
        
        toastContainer.classList.add('flex');
    }

    function hideToast() {
        toastContainer.classList.add('hidden');
        toastContainer.classList.remove('flex');
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'جاري تسجيل الدخول...';
            btnSpinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'تسجيل الدخول';
            btnSpinner.classList.add('hidden');
        }
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        
        hideToast();
        setLoading(true);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showToast('تم تسجيل الدخول بنجاح، جاري التوجيه...', 'success');
                setTimeout(() => {
                    window.location.href = result.redirectUrl || '/dashboard';
                }, 1000);
            } else {
                showToast(result.error || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
                setLoading(false);
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
            setLoading(false);
        }
    });
});
