export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access")
  const refresh = localStorage.getItem("refresh")

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  })

  if (response.status === 401 && refresh) {
    const refreshResponse = await fetch(
      "http://127.0.0.1:8000/api/token/refresh/",
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

    return fetch(url, {
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