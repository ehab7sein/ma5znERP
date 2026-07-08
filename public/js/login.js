document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn  = document.getElementById('loginBtn');

    // ── Toggle password visibility ──────────────────────────────────────────
    const toggleBtn      = document.getElementById('togglePassword');
    const passwordInput  = document.getElementById('password');
    const toggleIcon     = toggleBtn?.querySelector('.material-symbols-outlined');

    if (toggleBtn && passwordInput && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            toggleIcon.textContent = isHidden ? 'visibility' : 'visibility_off';
        });
    }

    // ── Loading state helpers ───────────────────────────────────────────────
    function setLoading(isLoading) {
        if (!loginBtn) return;
        loginBtn.disabled = isLoading;
        loginBtn.textContent = isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول';
        loginBtn.style.opacity = isLoading ? '0.7' : '1';
    }

    // ── Error message helpers ───────────────────────────────────────────────
    const errorMessage = document.getElementById('errorMessage');
    const errorText    = document.getElementById('errorText');

    function showError(message) {
        if (!errorMessage || !errorText) return;
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        if (!errorMessage) return;
        errorMessage.classList.add('hidden');
    }

    // ── Form submit ─────────────────────────────────────────────────────────
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data     = Object.fromEntries(formData.entries());

            hideError();
            setLoading(true);

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    window.location.href = result.redirectUrl || '/dashboard';
                } else {
                    showError(result.error || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
                    setLoading(false);
                }
            } catch (error) {
                showError('خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
                setLoading(false);
            }
        });
    }
});
