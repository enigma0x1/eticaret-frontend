// auth.js
const AuthManager = {
    async logout() {
        try {
            showLoading(true);
            const userType = localStorage.getItem('userType');
            const response = await fetch('https://eticaret-glif.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                localStorage.clear();
                
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
