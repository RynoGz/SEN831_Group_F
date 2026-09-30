import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("category_id, name")
    .order("name");

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  return data.map((category) => ({
    id: category.category_id,
    name: category.name,
  }));
}