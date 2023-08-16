import {
  AuthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";

import { UnauthenticatedTemplate } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import useAccesToken from "../hooks/useAccessToken";
import { protectedResources } from "../authConfig";
import { useEffect, useState } from "react";
import { InteractionType } from "@azure/msal-browser";
import { Game } from "../components/Game";
import { Unity, useUnityContext } from "react-unity-webgl";
import useFetchWithMsal from '../hooks/useFetchWithMsal';


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
      const params = {
        accessToken: result.accessToken,
        baseURL: "https://tiny-puce-cobra-wrap.cyclic.app/api/"
      }
      console.log(result.accessToken);
      sendMessage("Login", "SetApiData", JSON.stringify(params));
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

  const handleMe = async () => {
    const res = await execute("GET", "https://tiny-puce-cobra-wrap.cyclic.app/api/me")
    console.log(res)
  }




  const handleLogoutRedirect = () => {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
  };
  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  return (
    <div className="homescreen">
      <AuthenticatedTemplate>
        <div className="centered-game">
        {activeAccount ? (
          <>
            <button className="button" onClick={handleLogoutRedirect}>
              Deslogar
            </button>
            
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
          <button onClick={handleLoginRedirect}>Sign in</button>
        )}
        </div>
        
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="centered-buttons">
          <img src="/bat_logo.png"/>
          <button className="button" onClick={handleLoginRedirect}>Login</button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};
