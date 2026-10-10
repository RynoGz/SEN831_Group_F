"use server";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { submit,WorkflowError } from '../workflow/service.js';
export async function submitRequest(input){
 try{return await submit(await createSupabaseServerClient(),input);}
 catch(error){return {ok:false,fieldErrors:{form:error instanceof WorkflowError?error.message:'Submission could not be confirmed. Check My requests before retrying.'}};}
}
