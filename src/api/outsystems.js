import axios from 'axios'; // Add this at the top

// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;
// Basic Auth

const basicAuth = btoa(`${username}:${password}`);


export async function fetchTransactionData(accountNum) {
  // Create query parameters using URLSearchParams
  const params = new URLSearchParams({
    PageNo: 1,
    PageSize: 3,
    StartDate: '2023-02-05',
    EndDate: '2025-08-31'
  });
  const transactionURL = `${apiUrl}/Account/${accountNum}/transactions?${params.toString()}`;

  try{
    const response = await axios.get(transactionURL,{ headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/json"
    }})
    return response.data;
  }catch(error){
    throw error
  }
}
