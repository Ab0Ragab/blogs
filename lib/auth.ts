const API = process.env.NEXT_PUBLIC_AUTH_API_URL!;

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email?.trim(),
      password: password?.trim(),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return { token: data.accessToken, email: data.email };
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${API}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email?.trim(),
      password: password?.trim(),
      email: email?.trim(),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return { id: data.id, token: "fake-jwt-token-" + data.id };
}
