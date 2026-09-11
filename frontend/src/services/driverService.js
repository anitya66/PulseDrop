import api from "./api";

export const updateDriverAvailability = async (
  driverId,
  availability
) => {
  const response = await api.put(
    `/api/drivers/${driverId}/availability`,
    null,
    {
      params: {
        availability,
      },
    }
  );

  return response.data;
};

export const getDriverAvailability = async (driverId) => {
  const response = await api.get(
    `/api/drivers/${driverId}/availability`
  );

  return response.data;
};