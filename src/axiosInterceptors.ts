import axios from "axios";

axios.interceptors.request.use((config) => {
  (config as any).metadata = { startTime: new Date() };
  return config;
});

axios.interceptors.response.use(
  (response) => {
    const metadata = (response.config as any).metadata;
    metadata.endTime = new Date();
    // @ts-ignore
    response.config.metadata = metadata;
    return response;
  },
  (error) => {
    if (error.config) {
      const metadata = (error.config as any).metadata;
      if (metadata) {
        metadata.endTime = new Date();
        // @ts-ignore
        error.config.metadata = metadata;
      }
    }
    return Promise.reject(error);
  }
);
