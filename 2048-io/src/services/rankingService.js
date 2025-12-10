const SUPABASE_URL = "https://ypfxbsnqfpdkwzrhmkoa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZnhic25xZnBka3d6cmhta29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTc0MTgsImV4cCI6MjA3NjA5MzQxOH0.ZhyDd2DzaJTR_2lE7T361rwiubFLG7dV0QiJzu6Ie8w";

export async function fetchGlobalRanking(limit = 10) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=email,nickname,max_score&order=max_score.desc&limit=${limit}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error fetching ranking:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching ranking:", err);
    return [];
  }
}
