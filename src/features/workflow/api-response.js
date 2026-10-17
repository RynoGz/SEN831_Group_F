export async function readApiResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error('The service returned an unexpected response. Please try again.');
    error.status = response.status;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(typeof data?.error === 'string' ? data.error : 'The information could not be loaded. Please try again.');
    error.status = response.status;
    throw error;
  }
  return data;
}
