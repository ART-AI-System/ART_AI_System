const API_BASE_URL = 'http://localhost:4000/api';

// Check if token exists, otherwise redirect to login page (except on login itself)
function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return null;
    }
    return token;
}

// Global fetch wrapper with JWT authentication
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            window.location.href = '../auth/login.html';
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// Subject Head API Calls
const api = {
    async getOverview(semester) {
        const query = semester ? `?semester=${encodeURIComponent(semester)}` : '';
        return apiFetch(`/subject-head/overview${query}`);
    },

    async getClasses(semester) {
        const query = semester ? `?semester=${encodeURIComponent(semester)}` : '';
        return apiFetch(`/subject-head/classes${query}`);
    },

    async getClassAnalytics(classId) {
        return apiFetch(`/subject-head/classes/${classId}/analytics`);
    },

    async getGradeReports(status) {
        const query = status ? `?status=${encodeURIComponent(status)}` : '';
        return apiFetch(`/subject-head/grade-reports${query}`);
    },

    async approveGradeReport(reportId) {
        return apiFetch(`/subject-head/grade-reports/${reportId}/approve`, {
            method: 'PATCH'
        });
    },

    async rejectGradeReport(reportId, reviewNote) {
        return apiFetch(`/subject-head/grade-reports/${reportId}/reject`, {
            method: 'PATCH',
            body: JSON.stringify({ reviewNote })
        });
    },

    async getSuspiciousCases() {
        return apiFetch('/reports/suspicious-cases');
    }
};
