import axios from "axios"; // Add this at the top

// get from OutSystem API with all the authentications
const apiUrl = process.env.VUE_APP_API_URL;
const username = process.env.VUE_APP_API_USERNAME;
const password = process.env.VUE_APP_API_PASSWORD;
// Basic Auth
const basicAuth = btoa(`${username}:${password}`);

// Customer service API url
const customerAPIUrl = process.env.VUE_APP_CUSTOMER_SERVICE_API_URL;

// Notification service API url
const notificationAPIUrl = process.env.VUE_APP_NOTIFICATION_SERVICE_API_URL;

// Expense service API url
const expenseAPIUrl = process.env.VUE_APP_EXPENSE_SERVICE_API_URL;

// Wallet Service API URL
const walletAPIUrl = process.env.VUE_APP_WALLET_SERVICE_API_URL;

export async function fetchTransactionData(accountNum, startDate, endDate) {
  // Create query parameters using URLSearchParams
  const params = new URLSearchParams({
    PageNo: 1,
    PageSize: 50,
    StartDate: startDate,
    EndDate: endDate,
  });
  const transactionURL = `${apiUrl}/Account/${accountNum}/transactions?${params.toString()}`;

  try {
    const response = await axios.get(transactionURL, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

//--------------------- WITHDRAWAL FROM DEPOSIT ACCOUNT API---------------------------------//
export async function topUpWallet(
  customerId,
  accountId,
  walletId,
  amount,
  narrative
) {
  // Step 1: Withdraw from deposit account
  const withdrawDepositAcc = `${apiUrl}/account/${customerId}/WithdrawCash`;
  const authHeader = {
    headers: {
      Authorization: "Basic " + btoa(`${username}:${password}`),
      "Content-Type": "application/json",
    },
  };

  try {
    const withdrawBody = {
      consumerId: customerId,
      transactionId: "",
      accountId: accountId,
      amount: amount,
      narrative: narrative || "Wallet top-up",
    };

    const withdrawResponse = await axios.put(
      withdrawDepositAcc,
      withdrawBody,
      authHeader
    );

    if (withdrawResponse.status !== 200) {
      return {
        success: false,
        message: "Withdrawal failed from deposit account.",
      };
    }

    // Step 2: Update wallet balance
    const updateWalletAmount = `${walletAPIUrl}/wallet/${walletId}`;
    const walletBody = { amount };

    const walletResponse = await axios.put(updateWalletAmount, walletBody);

    if (walletResponse.status !== 200) {
      return { success: false, message: "Wallet top-up failed." };
    }

    // Step 3: Record wallet transaction
    const createTransactionUrl = `${walletAPIUrl}/wallet/${walletId}/transactions`;
    const transactionBody = {
      type: "Top-up",
      amount,
      narrative: narrative || "Wallet top-up from deposit account",
      transactionDate: new Date().toISOString(),
    };

    const transactionResponse = await axios.post(
      createTransactionUrl,
      transactionBody
    );

    if (
      transactionResponse.status === 200 ||
      transactionResponse.status === 201
    ) {
      return {
        success: true,
        message: "Wallet top-up successful and transaction recorded.",
      };
    } else {
      console.warn("Top-up succeeded but failed to record transaction.");
      return {
        success: true,
        message: "Wallet top-up successful, but transaction not saved.",
      };
    }
  } catch (error) {
    console.error(
      "Error during top-up:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
//--------------------- END OF WITHDRAWAL FROM DEPOSIT ACCOUNT API---------------------------------//

//--------------------- GET WALLET DETAILS ---------------------------------//
export async function getWalletDetails(walletId) {
  const url = `${walletAPIUrl}/GetWalletDetails?WalletId=${walletId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: "Failed to fetch wallet transactions.",
        data: null,
      };
    }
  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
//--------------------- END OF GET WALLET DETAILS ---------------------------------//



//--------------------- CUSTOMERS API---------------------------------//
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
    const response = await axios.get(
      `${customerAPIUrl}/customers/${accountId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
    });
    return response.data;
  } catch (err) {
    console.error("Unable to fetch all users because: " + err);
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
//---------------------END OF CUSTOMERS API---------------------------------//

export async function getAccountBalance(customerId, accountId) {
  try {
    const response = await axios.get(
      `${transactionURL}/account/${customerId}/${accountId}/balance`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Unable to fetch all users because: " + err);
    throw err;
  }
}

//--------------------- EXPENSE API---------------------------------//
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
    console.error(
      "Error creating expense:",
      error.response ? error.response.data : error
    );
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
    console.error(
      "Error fetching split expenses:",
      error.response ? error.response.data : error
    );
    throw error.response ? error.response.data : error;
  }
}

//--------------------- END OF EXPENSE API---------------------------------//

//--------------------- NOTIFICATION API---------------------------------//
// Send Email Notification
export async function sendEmailNotification(
  receipientEmail,
  subject,
  messageBody,
  notificationType
) {
  try {
    const response = await axios.post(
      `${notificationAPIUrl}/SendEmailNotification`,
      {
        receipientEmail,
        subject,
        messageBody,
        notificationType,
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
export async function sendSMSNotification(
  receipientPhoneNumber,
  messageBody,
  notificationType
) {
  try {
    const response = await axios.post(
      `${notificationAPIUrl}/SendSMSNotification`,
      {
        receipientPhoneNumber,
        messageBody,
        notificationType,
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

export async function sendNotifications({
  receipientEmail,
  subject,
  emailBody,
  receipientPhoneNumber,
  smsBody,
  notificationType
}) {
  const results = {
    email: null,
    sms: null
  };

  const tasks = [];

  if (receipientEmail && emailBody) {
    tasks.push(
      sendEmailNotification(
        receipientEmail,
        subject || '',
        emailBody,
        notificationType || ''
      ).then((response) => {
        results.email = {
          success: response?.Success !== false,
          response
        };
      }).catch((error) => {
        results.email = {
          success: false,
          error
        };
      })
    );
  }

  if (receipientPhoneNumber && smsBody) {
    tasks.push(
      sendSMSNotification(
        receipientPhoneNumber,
        smsBody,
        notificationType || ''
      ).then((response) => {
        results.sms = {
          success: response?.Success !== false,
          response
        };
      }).catch((error) => {
        results.sms = {
          success: false,
          error
        };
      })
    );
  }

  if (tasks.length === 0) {
    return results;
  }

  await Promise.allSettled(tasks);
  return results;
}

export async function addMember(walletId, accountId, role, invitedBy) {
  try {
    console.log({
      walletId, accountId, role, invitedByAccountId: invitedBy
    });
    const response = await axios.post(
      `${walletAPIUrl}/AddMemberToWallet`,  // URL
      {
        WalletId: walletId,
        AccountId: accountId,
        Role: role,
        InvitedByAccountId: invitedBy
      },

    );
    console.log("Add member response:", response); // Correct place to log

    // Check if the API returned Success: false
    if (response.data && response.data.Success === false) {
      // Throw the error data so it can be caught and displayed
      throw response.data;
    }

    return response.data;
  } catch (error) {
    console.error(
      "Add Member failed:",
      error.response ? error.response.data : error
    );
    // If it's already the error data object, throw it as is
    if (error.Success === false || error.Message) {
      throw error;
    }
    throw error.response ? error.response.data : error;
  }
}

export async function getWallet(walletId) {
  try {
    const response = await axios.get(`${walletAPIUrl}/GetWalletDetails?WalletId=${walletId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;
  } catch (err) {
    console.error("Unable to fetch wallet because: " + err)
    throw err;
  }
}

export async function getWalletList(AccountId) {
  try {
    const response = await axios.get(`${walletAPIUrl}/GetWalletListByAccId?AccountId=${AccountId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;
  } catch (err) {
    console.error("Unable to fetch wallet because: " + err)
    throw err;
  }
}

export async function createWallet(walletRequest) {
  try {
    const response = await axios.post(
      `${walletAPIUrl}/CreateWallet`,
      walletRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating wallet:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error;
  }
}

export async function getCustomerByPhone(phoneNumber) {
  try {
    const response = await axios.get(`${customerAPIUrl}/customer/${phoneNumber}/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error("Failed to fetch customer by phone: " + error)
    throw error.response ? error.response.data : error;
  }
}
