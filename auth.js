// auth.js
const AuthManager = {
    async logout() {
        try {
            document.body.style.display = 'none';
            
            const userType = localStorage.getItem('userType');
            const token = localStorage.getItem('token');

            await fetch('https://eticaret-glif.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.clear();
            sessionStorage.clear();
            window.history.forward();
            
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
    },

    async checkAuthAndRedirect() {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || !userType) {
            this.logout();
            return false;
        }

        try {
            const response = await fetch('https://eticaret-glif.onrender.com/api/manufacturer/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            this.logout();
            return false;
        }
    },

    isAuthenticated() {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        return !!token && !!userType;
    },

    getUserData() {
        const userData = localStorage.getItem('userData');
        try {
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    },

    setUserData(token, userType, userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUserType() {
        return localStorage.getItem('userType');
    },

    clearAuth() {
        localStorage.clear();
        sessionStorage.clear();
    },

    setupAuthHeaders() {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },

    preventBackNavigation() {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function() {
            window.history.pushState(null, null, window.location.href);
        };
    },

    async refreshToken() {
        try {
            const token = this.getToken();
            if (!token) return false;

            const response = await fetch('https://eticaret-glif.onrender.com/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    },

    init() {
        this.preventBackNavigation();
        
        // Token yenileme için interval
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.refreshToken();
            }
        }, 15 * 60 * 1000); // Her 15 dakikada bir

        // Storage event listener
        window.addEventListener('storage', (e) => {
            if (e.key === 'token' && !e.newValue) {
                this.logout();
            }
        });

        // Visibility change listener
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (!this.isAuthenticated()) {
                    this.logout();
                }
            }
        });
    }
};

// Sayfa yüklendiğinde init fonksiyonunu çalıştır
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
