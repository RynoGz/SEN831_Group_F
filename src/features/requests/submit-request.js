"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submit, WorkflowError } from "../workflow/service.js";

export async function submitRequest(input) {
  try {
    const supabase = await createSupabaseServerClient();
    return await submit(supabase, input);
  } catch (error) {
    return {
      ok: false,
      fieldErrors: {
        form:
          error instanceof WorkflowError
            ? error.message
            : "The request could not be submitted.",
      },
    };
  }
}