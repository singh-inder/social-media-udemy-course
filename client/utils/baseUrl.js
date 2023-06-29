const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "https://inder-social-media2.herokuapp.com";

export default baseUrl;
