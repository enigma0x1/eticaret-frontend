// auth.js
const AuthManager = {
    async logout() {
        try {
            // 1. Önce sayfayı tamamen gizle ve loading göster
            document.body.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                            background: white; display: flex; justify-content: center; 
                            align-items: center; z-index: 9999;">
                    <div style="text-align: center;">
                        <div class="loading-spinner"></div>
                        <p>Çıkış yapılıyor...</p>
                    </div>
                </div>
            `;

            const userType = localStorage.getItem('userType');
            const token = localStorage.getItem('token');

            // 2. Backend'e logout isteği gönder
            await fetch('https://eticaret-glif.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // 3. Tüm storage'ları temizle
            localStorage.clear();
            sessionStorage.clear();
            
            // 4. History'yi temizle
            window.history.pushState(null, document.title, window.location.href);
            window.history.replaceState(null, document.title, window.location.href);
            
            // 5. Sayfayı yönlendir
            let loginPage;
            switch(userType) {
                case 'manufacturer':
                    loginPage = 'ureticiLogin';
                    break;
                case 'professional':
                    loginPage = 'loginForPro';
                    break;
                case 'admin':
                    loginPage = 'adminLogin';
                    break;
                default:
                    loginPage = 'login';
            }

            // 6. Yönlendirme öncesi son kontroller
            window.onbeforeunload = null;
            window.onpopstate = null;
            
            // 7. Sayfayı değiştir
            window.location.replace(loginPage);
            
            // 8. Ek güvenlik için
            setTimeout(() => {
                if (document.location.href !== loginPage) {
                    window.location.replace(loginPage);
                }
            }, 100);

        } catch (error) {
            console.error('Logout error:', error);
            window.location.replace('login');
        }
    }
};
