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
import { BarLoader, PulseLoader } from "react-spinners";


export const Home = () => {
  const { instance } = useMsal();
 

  const { unityProvider, sendMessage, isLoaded, requestFullscreen, loadingProgression } = useUnityContext({
    loaderUrl: "/build/Build/BAT.loader.js",
    dataUrl: "/build/Build/BAT.data",
    frameworkUrl: "build/Build/BAT.framework.js",
    codeUrl: "build/Build/BAT.wasm",
  });

  const handleFullScreen = () => {
    requestFullscreen(true);
  }



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
            {isLoaded&&<button className="button" onClick={handleFullScreen}>
              FullScreen
            </button>}
            
            <br />
            {!isLoaded&&<div className="centered-loading">
              <h3>Carregando Aplicação: {Math.round(loadingProgression*100)}%</h3>
              <BarLoader color="white"/>
              </div>
           }
            
            <Unity
              unityProvider={unityProvider}
              style={{
                width: "80vw",
                height: "40.25vw",
                visibility: isLoaded ? "visible" : "hidden" 
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
          <PulseLoader color="white"/>
          <h3>Redirecionando para o login azure...</h3>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};
