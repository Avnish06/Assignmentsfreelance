const API_BASE = '/api/appointments';

export async function fetchAppointments({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (search && search.trim()) params.append('search', search.trim());

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data.data;
}

export async function createAppointment(appointmentData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to create appointment');
    error.errors = data.errors;
    throw error;
  }
  return data.data;
}

export async function updateAppointmentStatus(id, status) {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update status');
  }
  return data.data;
}

