import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = "http://localhost:5001/api";

// ✅ Function to get token from localStorage
const getToken = () => {
  const auth = JSON.parse(localStorage.getItem("SyriaSouq-auth"));
  return auth ? auth.token : null;
};

const customFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Attach token if available
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};

const customDataProvider = {
  ...simpleRestProvider(apiUrl),

  getList: async (resource, params) => {
    const json = await customFetch(`${apiUrl}/${resource}`);

    if (!json || !json.data || !Array.isArray(json.data)) {
      throw new Error(
        "Invalid API response: 'data' is missing or not an array"
      );
    }

    return {
      data: json.data.map((item) => ({
        id: item._id,
        ...item,
        imageURL: item.images?.length
          ? `http://localhost:5001/uploads/cars/${item.images[0]}`
          : null,
      })),
      total: json.data.length,
    };
  },

  getOne: async (resource, params) => {
    const json = await customFetch(`${apiUrl}/${resource}/${params.id}`);
    return { data: { id: json.data._id, ...json.data } };
  },

  update: async (resource, params) => {
    const { id, status } = params.data;
    const json = await customFetch(`${apiUrl}/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }), // ✅ Only updating status
    });

    return { data: { id: json.data._id, ...json.data } };
  },

  delete: async (resource, params) => {
    await customFetch(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return { data: { id: params.id } };
  },
};

export default customDataProvider;
