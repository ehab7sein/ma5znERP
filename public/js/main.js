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

    // Print Settings Dialog
    window.showPrintDialog = function(options) {
        const existing = document.getElementById('printDialogOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'printDialogOverlay';
        overlay.className = 'fixed inset-0 z-[70] bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-4';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        const dialog = document.createElement('div');
        dialog.className = 'bg-white rounded-xl shadow-hover border border-outline-variant max-w-md w-full p-lg relative overflow-hidden';
        dialog.onclick = (e) => e.stopPropagation();

        let content = '';

        if (options.type === 'stock') {
            content = `
                <div class="flex items-center gap-sm mb-lg">
                    <span class="material-symbols-outlined text-primary">print</span>
                    <h3 class="font-title-md text-title-md text-on-background">إعدادات طباعة المخزون</h3>
                </div>
                <div class="space-y-md">
                    <label class="flex items-center gap-md p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-all-200">
                        <input type="checkbox" id="includePackaging" checked class="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary">
                        <span class="font-body-md text-body-md text-on-background">تضمين مواد التغليف والتعبئة</span>
                    </label>
                </div>
                <div class="flex flex-row-reverse gap-sm mt-lg pt-lg border-t border-outline-variant">
                    <button id="printConfirmBtn" class="bg-primary text-on-primary font-label-sm text-label-sm py-2 px-6 rounded-lg shadow-soft hover:shadow-hover transition-all-200 flex items-center gap-xs">
                        <span class="material-symbols-outlined text-[18px]">print</span>
                        طباعة
                    </button>
                    <button id="printCancelBtn" class="bg-white border border-outline-variant text-primary font-label-sm text-label-sm py-2 px-6 rounded-lg shadow-soft hover:bg-surface-container-low transition-all-200">
                        إلغاء
                    </button>
                </div>`;
        } else if (options.type === 'transactions') {
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
            const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

            content = `
                <div class="flex items-center gap-sm mb-lg">
                    <span class="material-symbols-outlined text-primary">print</span>
                    <h3 class="font-title-md text-title-md text-on-background">إعدادات طباعة الحركات</h3>
                </div>
                <div class="space-y-md">
                    <label class="flex items-center gap-md p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-all-200" onclick="document.getElementById('customRange').classList.add('hidden'); document.getElementById('dateFrom').value='${today}'; document.getElementById('dateTo').value='${today}'; this.querySelector('input').checked=true;">
                        <input type="radio" name="dateRange" value="today" checked class="w-5 h-5 text-primary focus:ring-primary">
                        <span class="font-body-md text-body-md text-on-background">اليوم</span>
                    </label>
                    <label class="flex items-center gap-md p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-all-200" onclick="document.getElementById('customRange').classList.add('hidden'); document.getElementById('dateFrom').value='${weekAgo}'; document.getElementById('dateTo').value='${today}'; this.querySelector('input').checked=true;">
                        <input type="radio" name="dateRange" value="week" class="w-5 h-5 text-primary focus:ring-primary">
                        <span class="font-body-md text-body-md text-on-background">هذا الأسبوع</span>
                    </label>
                    <label class="flex items-center gap-md p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-all-200" onclick="document.getElementById('customRange').classList.add('hidden'); document.getElementById('dateFrom').value='${monthAgo}'; document.getElementById('dateTo').value='${today}'; this.querySelector('input').checked=true;">
                        <input type="radio" name="dateRange" value="month" class="w-5 h-5 text-primary focus:ring-primary">
                        <span class="font-body-md text-body-md text-on-background">هذا الشهر</span>
                    </label>
                    <label class="flex items-center gap-md p-3 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-all-200" onclick="document.getElementById('customRange').classList.remove('hidden'); this.querySelector('input').checked=true;">
                        <input type="radio" name="dateRange" value="custom" class="w-5 h-5 text-primary focus:ring-primary">
                        <span class="font-body-md text-body-md text-on-background">نطاق تاريخ مخصص</span>
                    </label>
                    <div id="customRange" class="hidden grid grid-cols-2 gap-md pr-8">
                        <div>
                            <label class="block font-label-sm text-label-sm text-on-surface-variant mb-1">من تاريخ</label>
                            <input type="date" id="dateFrom" class="w-full bg-white border border-outline-variant rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary text-body-md">
                        </div>
                        <div>
                            <label class="block font-label-sm text-label-sm text-on-surface-variant mb-1">إلى تاريخ</label>
                            <input type="date" id="dateTo" class="w-full bg-white border border-outline-variant rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary text-body-md">
                        </div>
                    </div>
                </div>
                <div class="flex flex-row-reverse gap-sm mt-lg pt-lg border-t border-outline-variant">
                    <button id="printConfirmBtn" class="bg-primary text-on-primary font-label-sm text-label-sm py-2 px-6 rounded-lg shadow-soft hover:shadow-hover transition-all-200 flex items-center gap-xs">
                        <span class="material-symbols-outlined text-[18px]">print</span>
                        طباعة
                    </button>
                    <button id="printCancelBtn" class="bg-white border border-outline-variant text-primary font-label-sm text-label-sm py-2 px-6 rounded-lg shadow-soft hover:bg-surface-container-low transition-all-200">
                        إلغاء
                    </button>
                </div>`;
        }

        dialog.innerHTML = content;
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('printCancelBtn').onclick = () => overlay.remove();
        document.getElementById('printConfirmBtn').onclick = () => {
            if (options.type === 'stock') {
                const include = document.getElementById('includePackaging').checked;
                const url = `/print/stock?includePackaging=${include}`;
                window.open(url, '_blank');
            } else if (options.type === 'transactions') {
                const from = document.getElementById('dateFrom').value;
                const to = document.getElementById('dateTo').value;
                let url = '/print/transactions?';
                if (from) url += `dateFrom=${from}&`;
                if (to) url += `dateTo=${to}&`;
                window.open(url, '_blank');
            }
            overlay.remove();
        };
    };

    // Modal
    window.showModal = function(title, description, onConfirm) {
        const modal = document.getElementById('globalModal');
        if (!modal) return;
        
        document.getElementById('globalModalTitleText').textContent = title;
        document.getElementById('globalModalMessage').textContent = description;
        
        const confirmBtn = document.getElementById('globalModalConfirmBtn');
        const cancelBtn = document.getElementById('globalModalCancelBtn');
        
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.add('modal-enter');
        });
        
        const closeModal = () => {
            modal.classList.remove('modal-enter');
            setTimeout(() => modal.classList.add('hidden'), 300);
        };
        
        confirmBtn.onclick = () => {
            onConfirm();
            closeModal();
        };
        cancelBtn.onclick = closeModal;
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
