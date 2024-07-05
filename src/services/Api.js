import Http from "./Http";

export const createUser = (config) => {
    return Http.post("auth/register", config);
}








