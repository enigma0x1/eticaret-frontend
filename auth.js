// auth.js
const AuthManager = {
    async logout() {
        try {
            // Önce sayfayı gizle
            document.body.style.display = 'none';
            
            const userType = localStorage.getItem('userType');
            const token = localStorage.getItem('token');

            // Backend'e logout isteği gönder
            await fetch('https://eticaret-glif.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Storage'ı temizle
            localStorage.clear();
            sessionStorage.clear();

            // Geri tuşunu devre dışı bırak
            window.history.forward();
            
            // Login sayfasına yönlendir
            switch(userType) {
                case 'manufacturer':
                    window.location.replace('ureticiLogin');
                    break;
                case 'professional':
                    window.location.replace('loginForPro');
                    break;
                case 'admin':
                    window.location.replace('adminLogin');
                    break;
                default:
                    window.location.replace('login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            window.location.replace('login');
        }
    }
};
