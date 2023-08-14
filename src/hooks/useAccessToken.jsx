import { useState, useCallback } from "react";

import { InteractionType, PopupRequest } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest
 * @returns
 */
const useAccesToken = (msalRequest) => {
  const { instance } = useMsal();
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Popup,
    {
      ...msalRequest,
      account: instance.getActiveAccount(),
      redirectUri: "/redirect",
    }
  );

  if(result)
    setToken(result.accessToken)

  return {
    token
  }

}

export default useAccesToken;
