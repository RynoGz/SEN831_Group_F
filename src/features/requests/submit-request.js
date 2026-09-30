"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitRequest(input) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      ok: false,
      fieldErrors: {
        form: "You must be signed in to submit a request.",
      },
    };
  }

  const { title, description, categoryId, location, sensitiveInformation } =
    input;

  if (!title?.trim()) {
    return {
      ok: false,
      fieldErrors: {
        title: "Enter a title.",
      },
    };
  }

  if (!description?.trim()) {
    return {
      ok: false,
      fieldErrors: {
        description: "Enter a description.",
      },
    };
  }

  if (!location?.trim()) {
    return {
      ok: false,
      fieldErrors: {
        location: "Enter a location.",
      },
    };
  }

  if (!categoryId) {
    return {
      ok: false,
      fieldErrors: {
        categoryId: "Select a category.",
      },
    };
  }

  const { data: requester, error: requesterError } = await supabase
    .from("requesters")
    .select("requester_id")
    .eq("auth_user_id", userData.user.id)
    .single();

  if (requesterError || !requester) {
    return {
      ok: false,
      fieldErrors: {
        form: "Your requester profile could not be found.",
      },
    };
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("category_id")
    .eq("category_id", categoryId)
    .single();

  if (categoryError || !category) {
    return {
      ok: false,
      fieldErrors: {
        categoryId: "The selected category is not valid.",
      },
    };
  }

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .insert({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      requester_id: requester.requester_id,
      category_id: category.category_id,
      sensitive_information: Boolean(sensitiveInformation),
    })
    .select("request_id, created_at, status_id")
    .single();

  if (requestError) {
    return {
      ok: false,
      fieldErrors: {
        form: "The request could not be submitted.",
      },
    };
  }

  const { data: status, error: statusError } = await supabase
    .from("statuses")
    .select("name")
    .eq("status_id", request.status_id)
    .single();

  if (statusError) {
    return {
      ok: true,
      request: {
        id: request.request_id,
        createdAt: request.created_at,
        status: "Submitted",
      },
    };
  }

  return {
    ok: true,
    request: {
      id: request.request_id,
      createdAt: request.created_at,
      status: status.name,
    },
  };
}