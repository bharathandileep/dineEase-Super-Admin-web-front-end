import axios, { Method, AxiosRequestConfig, AxiosResponse } from "axios";

export const commonapi = async (
  httprequest: Method,
  url: string,
  reqBody: any = null,
  reqHeader?: AxiosRequestConfig["headers"]
): Promise<AxiosResponse | null> => {
  const reqConfig: AxiosRequestConfig = {
    method: httprequest,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { 'Content-Type': 'application/json' },
  };

  try {
    const result = await axios(reqConfig);
    if (result) {
      return result;
    } else {
      console.error('API call succeeded but no result was returned.');
      return null;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('API Call Error:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected API Call Error:', error);
    }
    return null;
  }
};
