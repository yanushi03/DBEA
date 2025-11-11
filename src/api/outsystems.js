import axios from 'axios'; // Add this at the top

// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;

//get customers service API url
const customerAPIUrl = process.env.VUE_APP_CUSTOMER_SERVICE_API_URL;

// Basic Auth

const basicAuth = btoa(`${username}:${password}`);


export async function fetchTransactionData(accountNum, startDate, endDate) {
  // Create query parameters using URLSearchParams
  const params = new URLSearchParams({
    PageNo: 1,
    PageSize: 50,
    StartDate: startDate,
    EndDate: endDate
  });
  const transactionURL = `${apiUrl}/Account/${accountNum}/transactions?${params.toString()}`;

  try {
    const response = await axios.get(transactionURL, {
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      }
    })
    return response.data;
  } catch (error) {
    throw error
  }
}

export async function loginUser(accountId, password) {
  try {
    const response = await axios.post(
      `${customerAPIUrl}/login`,
      {
        accountId, // send directly
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error
    );
    throw error.response ? error.response.data : error;
  }
}

export async function getAccountDetails(accountId) {
  try {
    const response = await axios.get(`${customerAPIUrl}/customers/${accountId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;

  } catch (err) {
    console.error("Unable to fetch details because: " + err);
    throw err;
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(`${customerAPIUrl}/customers`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;
  } catch (err) {
    console.error("Unable to fetch all users because: " + err)
    throw err;
  }
}

export async function getAccountBalance(customerId, accountId) {
  try {
    const response = await axios.get(`${transactionURL}/account/${customerId}/${accountId}/balance`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;
  } catch (err) {
    console.error("Unable to fetch all users because: " + err)
    throw err;
  }
}

export async function checkPhoneNumberExists(phoneNumber) {
  try {
    const response = await axios.get(
      `https://personal-hvvfag03.outsystemscloud.com/Customers/rest/Customers/customer/${phoneNumber}/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // If 404, phone number doesn't exist
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createExpense(expenseRequest) {
  try {
    const response = await axios.post(
      'https://personal-jgmpftzu.outsystemscloud.com/Expense_Service/rest/ExpenseAPI/CreateExpense',
      expenseRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error.response ? error.response.data : error);
    throw error.response ? error.response.data : error;
  }
}

export async function getMySplitExpense(customerId) {
  try {
    const response = await axios.get(
      `https://personal-jgmpftzu.outsystemscloud.com/Expense_Service/rest/ExpenseAPI/GetMySplitExpenses?CustomerId=${customerId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching split expenses:', error.response ? error.response.data : error);
    throw error.response ? error.response.data : error;
  }
}

