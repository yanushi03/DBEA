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

// TopUpWallet Composite Service API URL
const topupWalletUrl = process.env.VUE_APP_TOPUPWALLET_SERVICE_API_URL;

// Fund Transfer Service API URL
const fundTransferUrl = process.env.VUE_APP_FUNDTRANSFER_SERVICE_API_URL

export async function fetchTransactionData(accountNum, startDate, endDate) {
  // Create query parameters using URLSearchParams
  const params = new URLSearchParams({
    PageNo: 1,
    PageSize: 100000,
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

//------------------------------------ **UPDATED** TOP UP WALLET FUNCTION -------------------------------------//
export async function topUpWallet(topUpData) {
  try {
    // Safety: ensure topup service URL exists
    if (!topupWalletUrl) {
      console.error(
        "TOPUP service URL is missing (topupWalletUrl). Check env vars."
      );
      return {
        success: false,
        message: "Top-up service is not configured.",
        updatedBalance: 0,
        transactionId: "",
      };
    }

    const response = await axios.post(
      `${topupWalletUrl}/TopUpWallet`,
      {
        CustomerId: topUpData.customerId,
        AccountId: topUpData.accountId,
        WalletId: topUpData.walletId,
        Amount: parseFloat(topUpData.amount),
        DepositAccNarrative: topUpData.depositAccNarrative,
        Narrative: topUpData.narrative,
        PerformedBy: topUpData.performedBy,
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log(response)

    // Log full response for debugging (remove later)
    console.debug(
      "topUpWallet raw response:",
      response?.status,
      response?.data
    );

    // Try several possible response shapes
    const data = response.data || {};
    const output = data.TopUpWalletOutput || data.Output || data;

    // Normalize fields
    const success =
      output?.Success === true ||
      output?.success === true ||
      output?.Success === "true";
    const message =
      output?.Message ||
      output?.message ||
      (success ? "Top-up succeeded" : "Top-up failed");
    const updatedBalance =
      output?.UpdatedBalance ?? output?.updatedBalance ?? null;
    const transactionId = output?.TransactionId ?? output?.transactionId ?? "";

    return {
      success: Boolean(success),
      message,
      updatedBalance,
      transactionId,
    };
  } catch (error) {
    console.error(
      "Top-up error:",
      error?.response?.data ?? error?.message ?? error
    );

    const apiMsg =
      error?.response?.data?.Output?.Message ||
      error?.response?.data?.Message ||
      error?.response?.data?.message ||
      error?.message;

    return {
      success: false,
      message: apiMsg || "Failed to top up wallet. Please try again.",
      updatedBalance: 0,
      transactionId: "",
    };
  }
}
//------------------------------------ END OF**UPDATED** TOP UP WALLET FUNCTION -------------------------------------//

//--------------------- GET WALLET TRANSACTIONS --------------------------------------//
export async function getWalletTransactions(walletId) {
  if (!walletId) {
    console.warn("Missing walletId.");
    return { success: false, data: [] };
  }

  const url = `${walletAPIUrl}/wallet/${walletId}/transactions`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      return { success: true, data: response.data };
    } else {
      return { success: false, data: [] };
    }
  } catch (error) {
    return { success: false, data: [] };
  }
}
//--------------------- END OF GET WALLET TRANSACTIONS --------------------------------------//

//--------------------- GET WALLET DETAILS ---------------------------------//
export async function getWallet(walletId) {
  try {
    const response = await axios.get(
      `${walletAPIUrl}/GetWalletDetails?WalletId=${walletId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Unable to fetch wallet because: " + err);
    throw err;
  }
}
//--------------------- END OF GET WALLET DETAILS ---------------------------------//

//--------------------- CUSTOMERS API---------------------------------//
export async function loginUser(accountId, password) {
  try {
    const response = await axios.post(
      `${customerAPIUrl}/Login`,
      {
        AccountId: accountId.trim(),
        Password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if login was successful
    if (response.data && response.data.Success === true) {
      return response.data;
    } else {
      // Login failed based on Success flag
      throw new Error(
        "You have entered the wrong Account Id or Password. Please try again."
      );
    }
  } catch (error) {
    // Always throw user-friendly message without console logs
    throw new Error(
      "You have entered the wrong Account Id or Password. Please try again."
    );
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
  notificationType,
}) {
  const results = {
    email: null,
    sms: null,
  };

  const tasks = [];

  if (receipientEmail && emailBody) {
    tasks.push(
      sendEmailNotification(
        receipientEmail,
        subject || "",
        emailBody,
        notificationType || ""
      )
        .then((response) => {
          results.email = {
            success: response?.Success !== false,
            response,
          };
        })
        .catch((error) => {
          results.email = {
            success: false,
            error,
          };
        })
    );
  }

  if (receipientPhoneNumber && smsBody) {
    tasks.push(
      sendSMSNotification(
        receipientPhoneNumber,
        smsBody,
        notificationType || ""
      )
        .then((response) => {
          results.sms = {
            success: response?.Success !== false,
            response,
          };
        })
        .catch((error) => {
          results.sms = {
            success: false,
            error,
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
      walletId,
      accountId,
      role,
      invitedByAccountId: invitedBy,
    });
    const response = await axios.post(
      `${walletAPIUrl}/AddMemberToWallet`, // URL
      {
        WalletId: walletId,
        AccountId: accountId,
        Role: role,
        InvitedByAccountId: invitedBy,
      }
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

export async function getWalletList(AccountId) {
  try {
    const response = await axios.get(
      `${walletAPIUrl}/GetWalletListByAccId?AccountId=${AccountId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Unable to fetch wallet because: " + err);
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
    console.error(
      "Error creating wallet:",
      error.response ? error.response.data : error
    );
    throw error.response ? error.response.data : error;
  }
}

export async function getCustomerByPhone(phoneNumber) {
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
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error("Failed to fetch customer by phone: " + error);
    throw error.response ? error.response.data : error;
  }
}

export async function transferFunds(transferReq) {
  try{
    const response = await axios.post(
      `${fundTransferUrl}/TransferFunds`,
      transferReq,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data
  }
  catch(err){
    console.error("Unable to transfer funds because: " + err);
    throw err;
  }
}

export async function splitTransferFunds(transferReq) {
  try{
    const response = await axios.post(
      `${fundTransferUrl}/SplitExpenseTransferFunds`,
      transferReq,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data
  }
  catch(err){
    console.error("Unable to transfer funds because: " + err);
    throw err;
  }
}