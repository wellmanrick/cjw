/** Public-file URL that works on localhost and GitHub Pages (`/cjw/`). */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
