import PocketBase, { BaseAuthStore } from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090").autoCancellation(false);
export default pb;
