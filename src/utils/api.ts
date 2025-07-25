export const fetchIncidents = async (resolved: boolean = false) => {
  const response = await fetch(`/api/incidents?resolved=${resolved}`);

  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }

  return response.json();
};

export const resolveIncident = async (id: number) => {
  const res = await fetch(`/api/incidents/${id}/resolve`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to resolve incident");
  }

  return res.json();
};

export const fetchCameras = async () => {
  const response = await fetch("/api/cameras");

  if (!response.ok) {
    throw new Error("Failed to fetch cameras");
  }

  return response.json();
};
