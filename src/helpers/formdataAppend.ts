export function appendToFormData(data: any) {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] instanceof File || data[key] instanceof Blob) {
      formData.append(key, data[key]);
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item:any, index:number) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (typeof data[key] === "object" && data[key] !== null) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
} 
