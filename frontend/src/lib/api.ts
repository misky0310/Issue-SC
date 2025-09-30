const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }
    
    return response.json();
  },

  // Issues
  getIssues: async (token: string, filters?: any) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/issues?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    // Handle paginated response
    return data.issues || data;
  },

  createIssue: async (token: string, issueData: any) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to create issue');
    }

    return response.json();
  },

  pickIssue: async (token: string, issueId: string) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/pick`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to pick issue');
    }

    return data;
  },

  resolveIssue: async (token: string, issueId: string, remark: string) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remark }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resolve issue');
    }

    return data;
  },

  // Faculties
  getFaculties: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/faculties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    // Handle the response structure
    return data.faculties || data;
  },
};