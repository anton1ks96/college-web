import Cookies from "js-cookie";

export function getAccessToken(): string | null {
    const token = Cookies.get("access_token");
    return token ?? null;
}
