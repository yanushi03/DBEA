import axios from 'axios'; // Add this at the top

// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;

//get customers service API url
const customerAPIUrl = process.env.VUE_APP_CUSTOMER_SERVICE_API_URL;

// Notification service API url
const notificationAPIUrl = process.env.VUE_APP_NOTIFICATION_SERVICE_API_URL;

//Expense service API url
const expenseAPIUrl = process.env.VUE_APP_EXPENSE_SERVICE_API_URL;

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
      `${customerAPIUrl}/customer/${phoneNumber}/`,
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
      `${expenseAPIUrl}/CreateExpense`,
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
      `${expenseAPIUrl}/GetMySplitExpenses?CustomerId=${customerId}`,
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

// Send Email Notification
export async function sendEmailNotification(receipientEmail, subject, messageBody, notificationType) {
  try {
    const response = await axios.post(
      `${notificationAPIUrl}/SendEmailNotification`,
      {
        receipientEmail,
        subject,
        messageBody,
        notificationType
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
      "Send email notification failed:",
      error.response ? error.response.data : error
    );
    throw error.response ? error.response.data : error;
  }
}

//Send SMS Notification
export async function sendSMSNotification(receipientPhoneNumber, messageBody, notificationType) {
  try {
    const response = await axios.post(
      `${notificationAPIUrl}/SendSMSNotification`,
      {
        receipientPhoneNumber,
        messageBody,
        notificationType
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
      "Send SMS notification failed:",
      error.response ? error.response.data : error
    );
    throw error.response ? error.response.data : error;
  }
}