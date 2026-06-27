const API_URL = "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    
    if (!res.ok) {
      // Intercept 401 Unauthorized errors (invalid or expired token)
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-expired"));
      }
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (err) {
    console.error(`❌ API error at ${endpoint}:`, err.message);
    throw err;
  }
}
