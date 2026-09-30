-- CivicConnect
-- M2 Secure Status Triggers
-- Migration: 004_secure_status_triggers

alter function public.set_initial_request_status()
security definer;

alter function public.set_initial_request_status()
set search_path = public;

alter function public.create_initial_status_history()
security definer;

alter function public.create_initial_status_history()
set search_path = public;