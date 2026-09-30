// FR-002 labels from PED v1.0. Preview IDs are NOT database category IDs.
export const previewCategories = [
  ["maintenance", "Maintenance"],
  ["it-support", "IT support"],
  ["facility-fault", "Facility fault"],
  ["damaged-equipment", "Damaged equipment"],
  ["security-concern", "Security concern"],
  ["lost-property", "Lost property"],
  ["other", "Other"],
].map(([id, name]) => ({ id: `preview-${id}`, name }));

export const previewRequester = {
  displayName: "Example requester",
  contact: "requester@example.test",
};

export const exampleRequest = {
  id: "example",
  reference: "EXAMPLE-001",
  title: "Leaking tap in the community hall",
  description: "The tap beside the entrance keeps dripping after it is closed.",
  category: "Maintenance",
  location: "Community hall · entrance washroom",
  status: "Submitted",
  createdAt: "2026-09-30T08:30:00+02:00",
  sensitiveInformation: false,
};
