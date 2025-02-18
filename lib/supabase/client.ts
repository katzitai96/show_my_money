import { PRIVATE_SUPABASE_SERVICE_KEY, PUBLIC_SUPABASE_URL } from "../../lib/config";
import { createClient } from "@supabase/supabase-js";

export async function checkDB() {
  const supabase = createClient(
    "https://pmbkizgjtcqgfebvxkaw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtpemdqdGNxZ2ZlYnZ4a2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTY4MjksImV4cCI6MjA1NTQ3MjgyOX0.tTXPdVKMcnZ-3B1Z3cso5EFyriTsYRTbfbiO-XpOqDo"
  );
  const { data, error } = await supabase
    .from("transactions")
    .insert({ amount: 100, description: "check", year: 2025, month: 1, day: 5, category: "מסעדות" })
    .select();
  console.log(data);
}

checkDB();
