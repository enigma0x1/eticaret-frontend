// auth.js
const AuthManager = {
    async logout() {
        try {
            const userType = localStorage.getItem('userType');
            const response = await fetch('https://eticaret-glif.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear(); // Session storage'ı da temizle
                
                // Cache'i temizle
                if (window.caches) {
                    caches.keys().then(names => {
                        names.forEach(name => {
                            caches.delete(name);
                        });
                    });
                }

                // History'yi temizle
                window.history.replaceState(null, '', '/');
                
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
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};
