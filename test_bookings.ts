import { getBookingsApi } from "./src/apis/booking";
async function test() {
  try {
    const data = await getBookingsApi({ dateFrom: new Date().toISOString().split('T')[0], dateTo: new Date().toISOString().split('T')[0] });
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
