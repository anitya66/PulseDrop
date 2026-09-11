import api from "./api";

export const updateDriverLocation = async (
  driverId,
  latitude,
  longitude
) => {
  const response = await api.post(`/api/locations/${driverId}`, {
    latitude,
    longitude,
  });

  return response.data;
};

export const getDriverLocation = async (driverId) => {
  const response = await api.get(`/api/locations/${driverId}`);

  return response.data;
};