// helpers/formdataAppend.ts
export const appendToFormData = (data: any): FormData => {
  const formData = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (Array.isArray(value)) {
        // Stringify arrays to ensure proper JSON format
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  }

  return formData;
};