// Bano Qabil IMS API Configuration
// Local dev (Live Server, file://) talks to the local backend; everywhere else uses production.
const IS_LOCAL = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

const API_CONFIG = {
  BASE_URL: window.API_BASE_URL || (IS_LOCAL ? "http://localhost:5000" : "https://api.banoqabil.online"),
  ENDPOINTS: {
    FORM_CONFIG: "/api/form-config",
    REGISTRATION: "/api/registration"
  }
};
