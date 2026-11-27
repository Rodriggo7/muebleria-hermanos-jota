import { apiFetch, USE_MOCK } from './api.js';

const MOCK_DELAY_MS = 400;

// POST /contact con { name, email, phone, subject, message } (ver backend/API_CONTRACTS.md).
export async function sendContact(form) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { _id: 'mock-contact', name: form.name, email: form.email, status: 'pending' };
  }

  return apiFetch('/contact', { method: 'POST', body: form });
}
