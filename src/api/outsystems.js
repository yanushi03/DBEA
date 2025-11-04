import axios from 'axios'; // Add this at the top

// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;

//get customers service API url
const customerAPIUrl = process.env.CUSTOMER_SERVICE_API_URL;

// Basic Auth

const basicAuth = btoa(`${username}:${password}`);


export async function fetchTransactionData(accountNum) {
    console.log(apiUrl);
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

export async function loginUser(accountId, password) {
  try {
    const response = await axios.post(`${customerAPIUrl}/login`, {
      params: {
        accountId,
        password,
      },
    });
    return response.data; // Return only the API data
  } catch (error) {
    console.error('Login failed:', error);
    throw error.response ? error.response.data : error;
  }
}


