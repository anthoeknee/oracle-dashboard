import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getPersonalityTraits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/personality_traits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching personality traits:", error);
    throw error;
  }
};
