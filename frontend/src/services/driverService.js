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