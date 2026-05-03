const API_URL = import.meta.env.VITE_API_URL

export async function authFetch(endpoint, options = {}) {
  let access = localStorage.getItem("access")
  const refresh = localStorage.getItem("refresh")

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(access && { Authorization: `Bearer ${access}` }),
      "Content-Type": "application/json",
    },
  })

  // 🔁 tenta renovar token
  if (response.status === 401 && refresh) {
    const refreshResponse = await fetch(
      `${API_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      }
    )

    if (!refreshResponse.ok) {
      localStorage.clear()
      window.location.href = "/entrar"
      return
    }

    const data = await refreshResponse.json()
    localStorage.setItem("access", data.access)

    // 🔁 refaz a requisição original
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.access}`,
        "Content-Type": "application/json",
      },
    })
  }

  return response
}