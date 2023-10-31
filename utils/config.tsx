export const token = () => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("auth");
  }
  return token;
}