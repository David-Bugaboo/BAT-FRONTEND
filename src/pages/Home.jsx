import {
  AuthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";
import { UnauthenticatedTemplate } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import useAccesToken from "../hooks/useAccessToken";
import { protectedResources } from "../authConfig";
import { useEffect, useState } from "react";
import { InteractionType } from "@azure/msal-browser";
import { Game } from "../components/Game";
import { Unity, useUnityContext } from "react-unity-webgl";

/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
  const { instance } = useMsal();

  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/build/Build/BAT.loader.js",
    dataUrl: "/build/Build/BAT.data",
    frameworkUrl: "build/Build/BAT.framework.js",
    codeUrl: "build/Build/BAT.wasm",
  });

  useEffect(() => {
    if (isLoaded) {
      console.log(result.accessToken);
      sendMessage("Login", "Authotization", result.accessToken);
    }
  }, [isLoaded]);

  const activeAccount = instance.getActiveAccount();
  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      scopes: protectedResources.apiTodoList.scopes.write,
      account: instance.getActiveAccount(),
      redirectUri: "/redirect",
    }
  );

  const handleLogoutRedirect = () => {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
  };
  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  return (
    <>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <>
            <button onClick={handleLogoutRedirect}>
              Sign out using Redirect
            </button>
            {result && (
              <button onClick={() => console.log(result.accessToken)}>
                logToken
              </button>
            )}
            <br />
            <Unity
              unityProvider={unityProvider}
              style={{
                width: "80vw",
                height: "40.25vw",
              }}
            />
          </>
        ) : (
          <button onClick={handleLoginRedirect}>Sign in using Redirect</button>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleLoginRedirect}>Sign in using Redirect</button>
      </UnauthenticatedTemplate>
    </>
  );
};
