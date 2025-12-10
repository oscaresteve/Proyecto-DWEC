import { setState, state$ } from "./stateService.js";
import { fetchUser } from "./userService.js";

const SUPABASE_URL = "https://ypfxbsnqfpdkwzrhmkoa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZnhic25xZnBka3d6cmhta29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTc0MTgsImV4cCI6MjA3NjA5MzQxOH0.ZhyDd2DzaJTR_2lE7T361rwiubFLG7dV0QiJzu6Ie8w";

async function fetchSupabase(endpoint, body) {
  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const data = await fetchSupabase("/auth/v1/token?grant_type=password", {
      email,
      password,
    });

    const token = data.access_token;
    if (!token) {
      alert("Login failed: no access token received");
      return;
    }

    await ensureUserExists(email, token);

    const userData = await fetchUser(email, token);
    if (!userData) {
      alert("No se pudo obtener información del usuario");
      return;
    }

    setState({
      user: {
        email,
        token,
        ...userData,
      },
      route: "game",
    });

    console.log("Estado:", state$.value);
    console.log("Usuario logueado:", userData);
  } catch (error) {
    alert(`Login failed: ${error?.error || JSON.stringify(error)}`);
  }
}

export async function register(email, password) {
  try {
    const data = await fetchSupabase("/auth/v1/signup", { email, password });

    if (data.user) {
      alert("Registration successful! You can now log in.");
    } else {
      alert("Registration failed.");
    }

    return data;
  } catch (error) {
    alert(`Registration failed: ${error?.error || JSON.stringify(error)}`);
  }
}

export async function ensureUserExists(email, token, nickname = "Player") {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        Prefer: "resolution=ignore-duplicates",
      },
      body: JSON.stringify({
        email,
        nickname,
        max_score: 0,
        game: null,
      }),
    });
    console.log(`Usuario asegurado en Supabase: ${email}`);
  } catch (err) {
    console.error("Error asegurando usuario:", err);
  }
}
