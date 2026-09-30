"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { validateRequestInput } from "./validate-request";

// Proposed integration: supply authorised categories/requester and a protected
// Server Action as submitRequest. See frontend-handoff.md before wiring it in.
export default function RequestForm({ categories, requester, submitRequest }) {
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [savedRequest, setSavedRequest] = useState(null);
  const [pending, setPending] = useState(false);
  const errorSummary = useRef(null);
  const resultPanel = useRef(null);
  const inFlight = useRef(false);
  const isPreview = !submitRequest;

  const focusAfterRender = (ref) => requestAnimationFrame(() => ref.current?.focus());
  const fieldProps = (name) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const errorFor = (name) => errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>;

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = new FormData(event.currentTarget);
    const sensitive = data.get("sensitiveInformation");
    const validation = validateRequestInput({
      title: data.get("title"),
      description: data.get("description"),
      categoryId: data.get("categoryId"),
      location: data.get("location"),
      sensitiveInformation: sensitive === "yes" ? true : sensitive === "no" ? false : undefined,
    }, categories);
    setErrors(validation.errors);
    setFeedback(null);
    if (!validation.valid) {
      focusAfterRender(errorSummary);
      return;
    }
    if (isPreview) {
      setFeedback({ kind: "info", message: "The form is ready for the next step. This preview has not submitted or saved your request." });
      focusAfterRender(resultPanel);
      return;
    }
    inFlight.current = true;
    setPending(true);
    try {
      const result = await submitRequest(validation.values);
      if (result?.ok && result.request?.id && result.request?.createdAt && result.request?.status) {
        setSavedRequest(result.request);
      } else {
        // Only known field keys are rendered as links in the error summary.
        const safeErrors = {};
        for (const key of ["title", "description", "categoryId", "location", "sensitiveInformation"]) {
          if (typeof result?.fieldErrors?.[key] === "string") safeErrors[key] = result.fieldErrors[key];
        }
        setErrors(safeErrors);
        setFeedback({ kind: "error", message: "Your request could not be confirmed. Check the details and try again." });
      }
    } catch {
      setFeedback({ kind: "error", message: "We could not confirm that your request was saved. Please check your connection before trying again." });
    } finally {
      inFlight.current = false;
      setPending(false);
      focusAfterRender(resultPanel);
    }
  }

  if (savedRequest) {
    return (
      <section className="panel" ref={resultPanel} tabIndex={-1} aria-labelledby="saved-heading">
        <p className="eyebrow">Request received</p>
        <h2 id="saved-heading">Your request has been saved</h2>
        <p>Reference: <strong>{savedRequest.id}</strong></p>
        <p>Status: {savedRequest.status}</p>
        <p>Submitted: <time dateTime={savedRequest.createdAt}>{savedRequest.createdAt}</time></p>
        <Link className="button" href={`/requests/${encodeURIComponent(savedRequest.id)}`}>View request</Link>
      </section>
    );
  }

  return (
    <form className="panel request-form" onSubmit={handleSubmit} noValidate aria-busy={pending}>
      {Object.keys(errors).length > 0 && (
        <div className="feedback error-feedback" ref={errorSummary} tabIndex={-1} role="alert">
          <h2>Please check your request</h2>
          <ul>{Object.entries(errors).map(([field, message]) => <li key={field}><a href={`#${field}`}>{message}</a></li>)}</ul>
        </div>
      )}
      <p className="form-intro">Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className="field"><label htmlFor="title">Title <span aria-hidden="true">*</span></label><input {...fieldProps("title")} required placeholder="A short summary of the issue" />{errorFor("title")}</div>
      <div className="field"><label htmlFor="description">Description <span aria-hidden="true">*</span></label><textarea {...fieldProps("description")} required rows={5} placeholder="What happened? Include details that will help someone assist you." />{errorFor("description")}</div>
      <div className="field"><label htmlFor="categoryId">Category <span aria-hidden="true">*</span></label><select {...fieldProps("categoryId")} required defaultValue=""><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errorFor("categoryId")}</div>
      <div className="field"><label htmlFor="location">Location <span aria-hidden="true">*</span></label><input {...fieldProps("location")} required placeholder="Building, room or a nearby landmark" />{errorFor("location")}</div>
      <section className="requester-info" aria-labelledby="requester-heading">
        <h2 id="requester-heading">Requester details</h2>
        <p>{requester?.displayName || "Requester profile unavailable"}<br />{requester?.contact || "Contact details unavailable"}</p>
        <p className="muted">{isPreview ? "Fictional details for this preview. Sign-in is not connected yet." : "These details come from your signed-in profile."}</p>
      </section>
      <fieldset className="field" id="sensitiveInformation" tabIndex={-1} aria-describedby={errors.sensitiveInformation ? "sensitivity-hint sensitiveInformation-error" : "sensitivity-hint"} aria-invalid={errors.sensitiveInformation ? true : undefined}>
        <legend>Does this contain sensitive information? <span aria-hidden="true">*</span></legend>
        <p id="sensitivity-hint" className="muted">Choose yes if the request needs restricted handling. Use fictional information in this preview.</p>
        <div className="radio-row"><label><input type="radio" name="sensitiveInformation" value="no" required /> No</label><label><input type="radio" name="sensitiveInformation" value="yes" required /> Yes</label></div>
        {errorFor("sensitiveInformation")}
      </fieldset>
      <section className="attachment-note" aria-labelledby="attachment-heading"><h2 id="attachment-heading">Attachment <span className="muted">· optional</span></h2><p>File attachments are not available yet. You can check the form without one.</p></section>
      <div ref={resultPanel} tabIndex={-1}>
        <div aria-live="polite" aria-atomic="true">{pending && <p>Submitting your request…</p>}{feedback && <p className={`feedback ${feedback.kind === "error" ? "error-feedback" : "info-feedback"}`}>{feedback.message}</p>}</div>
      </div>
      <div className="form-actions"><button className="button" type="submit" disabled={pending}>{pending ? "Submitting…" : isPreview ? "Check request" : "Submit request"}</button><Link className="text-link" href="/">Back to home</Link></div>
      {isPreview && <p className="muted small">Checking the form validates your input in this browser. It does not save or send a request.</p>}
    </form>
  );
}
