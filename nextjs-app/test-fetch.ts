import { fetchInitialFeeds } from "./lib/actions-server";
async function test() {
    console.log("Testing fetchInitialFeeds...");
    try {
        const feeds = await fetchInitialFeeds(5);
        console.log(JSON.stringify(feeds, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
