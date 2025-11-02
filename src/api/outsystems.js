
// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;
// Basic Auth

const basicAuth = btoa(`${username}:${password}`);


export function fetchTransactionData(accountNum) {
  // Create query parameters using URLSearchParams
  const params = new URLSearchParams({
    PageNo: 1,
    PageSize: 3,
    StartDate: '2023-02-05',
    EndDate: '2025-08-31'
  });
  const transactionURL = `${apiUrl}/Account/${accountNum}/transactions?${params.toString()}`;
  return fetch(transactionURL, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json());
}
