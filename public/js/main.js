document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Toast
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const template = document.getElementById('toast-template');
        if (!container || !template) return;
        
        const clone = template.content.cloneNode(true);
        const toastEl = clone.querySelector('.toast-message');
        const iconEl = clone.querySelector('.toast-icon');
        const textEl = clone.querySelector('.toast-text');
        
        textEl.textContent = message;
        
        if (type === 'success') {
            toastEl.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-200');
            iconEl.textContent = '✅';
        } else if (type === 'error') {
            toastEl.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-200');
            iconEl.textContent = '❌';
        } else if (type === 'warning') {
            toastEl.classList.add('bg-yellow-100', 'text-yellow-800', 'border', 'border-yellow-200');
            iconEl.textContent = '⚠️';
        }
        
        container.appendChild(toastEl);
        
        requestAnimationFrame(() => {
            toastEl.classList.add('toast-enter');
        });
        
        setTimeout(() => {
            toastEl.classList.remove('toast-enter');
            setTimeout(() => toastEl.remove(), 300);
        }, 3000);
    };

    // Modal
    window.showModal = function(title, description, onConfirm) {
        const modal = document.getElementById('confirmModal');
        if (!modal) return;
        
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;
        
        const confirmBtn = document.getElementById('modal-confirm-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.add('modal-enter');
        });
        
        const closeModal = () => {
            modal.classList.remove('modal-enter');
            setTimeout(() => modal.classList.add('hidden'), 300);
        };
        
        // Remove old event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        newCancelBtn.addEventListener('click', closeModal);
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            closeModal();
        });
    };

    // Sidebar Logout
    const logoutForm = document.getElementById('logoutFormSidebar');
    if (logoutForm) {
        logoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const res = await fetch('/logout', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    window.location.href = data.redirectUrl || '/login';
                }
            } catch (err) {
                console.error(err);
                window.location.href = '/login';
            }
        });
    }
});
