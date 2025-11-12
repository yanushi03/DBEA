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

//--------------------- WITHDRAW FROM DEPOSIT ACC FUNCTION ---------------------------------//
export async function withdrawFromDeposit(
  customerId,
  accountId,
  amount,
  narrative
) {
  if (!customerId || !accountId || !amount) {
    return {
      success: false,
      message: "Missing required parameters for withdrawal.",
    };
  }

  const authHeader = {
    headers: {
      Authorization: "Basic " + btoa(`${username}:${password}`),
      "Content-Type": "application/json",
    },
  };

  const url = `${apiUrl}/account/${customerId}/WithdrawCash`;
  const body = {
    consumerId: customerId,
    transactionId: "",
    accountId,
    amount,
    narrative: narrative || "Wallet top-up",
  };

  try {
    const res = await axios.put(url, body, authHeader);
    if (res.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Withdrawal failed." };
    }
  } catch (error) {
    console.error("Withdrawal error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
//--------------------- END OF WITHDRAW FROM DEPOSIT ACC FUNCTION ---------------------------------//

//--------------------- UPDATE WALLET BALANCE FUNCTION ------------------------------------------//
export async function updateWalletBalance(walletId, balance) {
  if (!walletId || balance === undefined) {
    return { success: false, message: "Missing wallet ID or balance." };
  }

  const authHeader = {
    headers: { "Content-Type": "application/json" },
  };

  const url = `${walletAPIUrl}/wallet/${walletId}`;
  const body = { balance };

  try {
    const res = await axios.put(url, body, authHeader);
    if (res.status === 200) {
      return { success: true, data: res.data }; // include returned balance
    } else {
      return { success: false, message: "Wallet update failed." };
    }
  } catch (error) {
    console.error(
      "Update wallet error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
//--------------------- END OF UPDATE WALLET BALANCE FUNCTION ------------------------------------------//

//----------------------- RECORD WALLET TRANSACTION FUNCTION ------------------------------------------//
export async function recordWalletTransaction(
  walletId,
  amount,
  narrative,
  performedBy
) {
  try {
    if (!walletId || amount == null || !narrative || !performedBy) {
      return { success: false, message: "Missing required parameters." };
    }

    const payload = {
      Amount: parseFloat(amount),
      Type: "Top-up",
      Narrative: narrative,
      TransactionDate: new Date().toISOString(),
      PerformedBy: performedBy,
    };

    const response = await axios.post(
      `${walletAPIUrl}/wallet/${walletId}/transactions`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data && response.data.success) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        message: response.data?.message || "Failed to record transaction.",
      };
    }
  } catch (err) {
    console.error(
      "Failed to record transaction:",
      err.response?.data || err.message || err
    );
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Error recording transaction.",
    };
  }
}
//----------------------- END OF RECORD WALLET TRANSACTION FUNCTION ------------------------------------------//

//------------------- UPDATE WALLET MEMBER ACC CONTRIBUTION FUNC ------------------------------------//
export async function updateWalletMemberContribution(walletId, userId, amount) {
  if (!walletId || !userId || !amount) {
    return { success: false, message: "Missing walletId, userId, or amount." };
  }

  const url = `${walletAPIUrl}/UpdateWalletMemberAmount?walletId=${walletId}&userId=${userId}&amount=${amount}`;

  try {
    const res = await axios.put(url, null, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 200) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: "Failed to update wallet member contribution.",
      };
    }
  } catch (error) {
    console.error(
      "Error updating wallet member contribution:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
//------------------- END OF UPDATE WALLET MEMBER ACC CONTRIBUTION FUNC ------------------------------------//

//------------------------------------ TOP UP WALLET FUNCTION -------------------------------------//
export async function topUpWallet(
  customerId,
  accountId,
  walletId,
  amount,
  narrative,
  performedBy
) {
  // Step 0: Withdraw must succeed first
  const withdraw = await withdrawFromDeposit(
    customerId,
    accountId,
    amount,
    narrative
  );
  if (!withdraw.success) return withdraw;

  try {
    // Step 1: Update wallet, member contribution, and record transaction in parallel
    const [updateWallet, updateMember, recordTx] = await Promise.all([
      updateWalletBalance(walletId, amount),
      updateWalletMemberContribution(walletId, accountId, amount),
      recordWalletTransaction(walletId, amount, narrative, performedBy),
    ]);

    let txMessage = "Wallet top-up successful.";
    if (!recordTx.success) {
      txMessage = "Wallet top-up succeeded, but transaction was not recorded.";
    }

    return {
      success: true,
      message: txMessage,
      updatedBalance: updateWallet?.data?.balance ?? null,
    };
  } catch (err) {
    console.error("Top-up failed:", err);
    return {
      success: false,
      message: "Failed to top up wallet due to server error.",
    };
  }
}
//------------------------------------ END OF TOP UP WALLET FUNCTION -------------------------------//

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
