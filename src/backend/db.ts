import PocketBase, { BaseAuthStore } from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKET_BASE_URL).autoCancellation(false);
export default pb;
