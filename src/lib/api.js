import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
});

// Attach Authorization and content-type handling
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${u.token}`;
      }
    }
  } catch {}
  if (config.data instanceof FormData) {
    if (config.headers) delete config.headers["Content-Type"]; // let browser set boundary
  } else if (config.data !== undefined) {
    config.headers = config.headers || {};
    config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  }
  return config;
});

export async function post(path, body, opts = {}) {
  const { data } = await api.post(path, body, opts);
  return data;
}

export async function postForm(path, formData, opts = {}) {
  const { data } = await api.post(path, formData, {
    ...opts,
    headers: { ...(opts.headers || {}), "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function patchForm(path, formData, opts = {}) {
  const { data } = await api.patch(path, formData, opts);
  // const { data } = await api.patch(path, formData, {
  //   ...opts,
  //   headers: { ...(opts.headers || {}), "Content-Type": "multipart/form-data" },
  // });
  return data;
}

export async function putForm(path, formData, opts = {}) {
  const { data } = await api.put(path, formData, opts);
  // const { data } = await api.patch(path, formData, {
  //   ...opts,
  //   headers: { ...(opts.headers || {}), "Content-Type": "multipart/form-data" },
  // });
  return data;
}

/**
 * Generic function to upload form data or JSON.
 * Handles different HTTP methods.
 * @param {'post' | 'patch' | 'put'} method - HTTP method (post, patch, put)
 * @param {string} url - API endpoint URL
 * @param {FormData | object} data - Data to send. Use FormData for files.
 * @returns {Promise<object>} - The response data from the API
 */
export const uploadForm = async (method, url, data) => {
  try {
    let response;
    const config = {
      headers: {
        // If data is FormData, Content-Type will be set automatically by the browser.
        // Otherwise, we use the default JSON Content-Type.
        ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };

    if (method === 'post') {
      response = await api.post(url, data, config);
    } else if (method === 'patch') {
      // *** THIS IS THE CRUCIAL PART FOR YOUR 500 ERROR ***
      // Ensure that when 'patch' is called with FormData, the Content-Type
      // is correctly set to 'multipart/form-data' and not application/json.
      // Axios usually handles this if you provide FormData and don't explicitly set headers.
      // If your `api` instance has a default 'Content-Type': 'application/json',
      // you might need to override it here or ensure it's conditionally set.
      response = await api.patch(url, data, config);
    } else if (method === 'put') {
      response = await api.put(url, data, config);
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return response.data; // Return the data part of the response
  } catch (error) {
    console.error(`Error during ${method.toUpperCase()} request to ${url}:`, error);
    // Re-throw the error so it can be caught by the caller (e.g., handleSubmit)
    throw error;
  }
};


// const thumbnailFormData = new FormData();
// const publicIdsToKeep = [];

// formData.thumbnails.forEach(fileOrUrl => {
//     if (fileOrUrl instanceof File) {
//         // Append new files to the FormData
//         thumbnailFormData.append("images", fileOrUrl);
//     } else if (typeof fileOrUrl === 'string') {
//         // Extract the publicId from the image URL and add it to the list
//         const publicId = extractPublicIdFromUrl(fileOrUrl);
//         if (publicId) {
//             publicIdsToKeep.push(publicId);
//         }
//     }
// });

// // Append the list of public IDs to the FormData
// thumbnailFormData.append("currentPublicIds", JSON.stringify(publicIdsToKeep));

// // Send the PATCH request to the thumbnail API
// try {
//     // This is the corrected line. We use 'patch' to update the thumbnails.
//     await uploadForm("patch", `/products/${currentProductId}/images`, thumbnailFormData);

// } catch (err) {
//     console.warn("Thumbnail update failed:", err);
//     alert("Some thumbnails failed to update.");
// }