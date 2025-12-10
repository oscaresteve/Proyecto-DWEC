import { setState } from "./stateService.js";
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
    return { error: "Error de conexión con Supabase" };
  }
}

export async function login(email, password) {
  try {
    const data = await fetchSupabase("/auth/v1/token?grant_type=password", {
      email,
      password,
    });

    if (!data.access_token) {
      console.warn("Login fallido: no se recibió token");
      return { error: "Email o contraseña incorrectos" };
    }

    const token = data.access_token;
    await ensureUserExists(email, token);

    const userData = await fetchUser(email, token);
    if (!userData) {
      console.warn("No se pudo obtener información del usuario");
      return { error: "No se pudo obtener información del usuario" };
    }

    console.log("Usuario logueado:", userData);

    setState({
      user: {
        email: userData.email,
        token: token,
        nickname: userData.nickname,
        max_score: userData.max_score,
        game: userData.game,
      },
      route: "game",
    });

    return { success: true };
  } catch (error) {
    console.error("Error en login:", error);
    return { error: "Ocurrió un error inesperado" };
  }
}

export async function register(email, password) {
  try {
    const data = await fetchSupabase("/auth/v1/signup", { email, password });

    console.log("Respuesta de registro:", data);

    if (!data.email) {
      return { error: "Ocurrió un error inesperado durante el registro" };
    }

    console.log("Registro exitoso, email de confirmación enviado:", data.email);
    return {
      success: true,
      message:
        "Registro exitoso. Revisa tu email para confirmar la cuenta antes de iniciar sesión.",
    };
  } catch (err) {
    console.error("Error en registro:", err);
    return { error: "Ocurrió un error inesperado durante el registro" };
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
