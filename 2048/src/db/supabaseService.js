import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-data.json";

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

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signUp(email, password) {
  return fetchSupabase("/auth/v1/signup", { email, password });
}

export async function signIn(email, password) {
  return fetchSupabase("/auth/v1/token?grant_type=password", {
    email,
    password,
  });
}
