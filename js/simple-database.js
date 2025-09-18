// Simple Database using localStorage
class SimpleDatabase {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('gym_users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('gym_users', JSON.stringify(this.users));
    }

    // Load current user from localStorage
    loadCurrentUser() {
        const user = localStorage.getItem('gym_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Save current user to localStorage
    saveCurrentUser(user) {
        if (user) {
            localStorage.setItem('gym_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('gym_current_user');
        }
    }

    // Register new user
    register(userData) {
        // Check if email already exists
        if (this.users.find(user => user.email === userData.email)) {
            return { success: false, message: 'Email đã được sử dụng!' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Đăng ký thành công!', user: newUser };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser(user);
            return { success: true, message: 'Đăng nhập thành công!', user: user };
        } else {
            return { success: false, message: 'Email hoặc mật khẩu không đúng!' };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.saveCurrentUser(null);
        return { success: true, message: 'Đăng xuất thành công!' };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update user profile
    updateProfile(userId, updateData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updateData };
            this.saveUsers();
            
            // Update current user if it's the same user
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = this.users[userIndex];
                this.saveCurrentUser(this.currentUser);
            }
            
            return { success: true, message: 'Cập nhật thông tin thành công!' };
        }
        return { success: false, message: 'Không tìm thấy người dùng!' };
    }

    // Get all users (for admin)
    getAllUsers() {
        return this.users;
    }

    // Delete user
    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.saveUsers();
            
            // Logout if current user is deleted
            if (this.currentUser && this.currentUser.id === userId) {
                this.logout();
            }
            
            return { success: true, message: 'Xóa người dùng thành công!' };
        }
        return { success: false, message: 'Không tìm thấy người dùng!' };
    }

    // Clear all data (for testing)
    clearAllData() {
        localStorage.removeItem('gym_users');
        localStorage.removeItem('gym_current_user');
        this.users = [];
        this.currentUser = null;
    }
}

// Create global database instance
window.db = new SimpleDatabase();
