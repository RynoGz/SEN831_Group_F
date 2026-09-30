// Browser feedback only. Steven's server operation must independently validate
// input, derive the requester from the session, and enforce authorisation.
export function validateRequestInput(input, categories) {
  const text = (value) => typeof value === "string" ? value.trim() : "";
  const values = {
    title: text(input?.title),
    description: text(input?.description),
    categoryId: text(input?.categoryId),
    location: text(input?.location),
    sensitiveInformation: input?.sensitiveInformation,
  };
  const errors = {};
  for (const [field, message] of [
    ["title", "Enter a title for your request."],
    ["description", "Describe what happened or what you need."],
    ["location", "Tell us where the issue is located."],
  ]) {
    if (!values[field]) errors[field] = message;
  }
  if (!categories.some((category) => category.id === values.categoryId)) {
    errors.categoryId = "Choose one of the available categories.";
  }
  if (typeof values.sensitiveInformation !== "boolean") {
    errors.sensitiveInformation = "Choose whether the request contains sensitive information.";
  }
  return { values, errors, valid: Object.keys(errors).length === 0 };
}
