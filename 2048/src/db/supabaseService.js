const SUPABASE_URL = "https://ypfxbsnqfpdkwzrhmkoa.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZnhic25xZnBka3d6cmhta29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTc0MTgsImV4cCI6MjA3NjA5MzQxOH0.ZhyDd2DzaJTR_2lE7T361rwiubFLG7dV0QiJzu6Ie8w";

async function fetchSupabase(endpoint, body) {
  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
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
