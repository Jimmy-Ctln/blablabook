import axios from "axios";

const externalApi = axios.create({
  baseURL: "https://openlibrary.org",
});

export default externalApi;
