import {
  AuthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";
import Modal from "react-modal";
import { useMsal, useAccount } from "@azure/msal-react";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import ReactPlayer from "react-player";
import { UnauthenticatedTemplate } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import useAccesToken from "../hooks/useAccessToken";
import { protectedResources } from "../authConfig";
import { useCallback, useEffect, useState } from "react";
import { InteractionType } from "@azure/msal-browser";
import { Game } from "../components/Game";
import { Unity, useUnityContext } from "react-unity-webgl";
import me from "../services/me";
import { BarLoader, PulseLoader } from "react-spinners";
import { CButton, CProgress } from "@coreui/react";
import axios from "axios";
import { api } from "../services/API";
import markWatched from "../services/markWatched";
import ReactiveButton from "reactive-button";

export const Home = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [token, setToken] = useState(null);
  const [video, setVideo] = useState(null);
  const [watched, setWatched] = useState(null);
  console.log(instance)
  const handleSetVideo = useCallback(async (video) => {
    setCloseVideo(false);
    setWatched(false);
    setVideoTime(0);
    setVideo(video);
    const { watchedVideos } = await me();
    if (watchedVideos.find((watchedVideo) => watchedVideo === video)) {
      setCloseVideo(true);
      setWatched(true);
    }
    setIsOpen(true);
  }, []);
  const handleLogout = useCallback(async ()=>{
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
  },[])
  console.log("Active Account",instance.getActiveAccount())
  const customStyles = {
    content: {
      top: "50%",
      display: "flex",
      flexDirection: "column",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "auto",
      width: "55vw",
      backgroundColor: "unset",
      border: "unset",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
  };
  const [closeVideo, setCloseVideo] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const {
    unityProvider,
    sendMessage,
    isLoaded,
    requestFullscreen,
    loadingProgression,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "/build/Build/BAT.loader.js",
    dataUrl: "/build/Build/BAT.data",
    frameworkUrl: "build/Build/BAT.framework.js",
    codeUrl: "build/Build/BAT.wasm",
  });
  useEffect(() => {
    addEventListener("OpenVideo", handleSetVideo);
    addEventListener("Logout", handleLogout);
    
    return () => {
      removeEventListener("OpenVideo", handleSetVideo);
      removeEventListener("Logout", handleLogout);
    };
  }, [addEventListener, removeEventListener, handleSetVideo, handleLogout]);
  const handleFullScreen = () => {
    requestFullscreen(true);
  };
  useEffect(() => {
    if (isLoaded) {
      if (result){
        console.log("account", result.idToken);
        const params = {
          accessToken: result.idToken,
          baseURL: "https://bat-prod-api-bf12b0d555f9.herokuapp.com/api/",
        };
  
        api.defaults.headers.common["Authorization"] = `Bearer ${result.idToken}`;
  
        sendMessage("Login", "SetApiData", JSON.stringify(params));
      }
      else{
        //location.reload()
      }
    }
  }, [isLoaded]);
  useEffect(() => {}, []);
  const activeAccount = instance.getActiveAccount();
  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    {
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
  const handleVideoProgress = (played) => {
    setVideoTime(played * 100);
    if (played > 0.5) setCloseVideo(true);
  };

  return (
    <div className="homescreen">
      <AuthenticatedTemplate>
        <div className="centered-game">
          {activeAccount ? (
            <>
              <br />
              {!isLoaded && (
                <div className="centered-loading">
                  <h3>
                    Carregando Aplicação: {Math.round(loadingProgression * 100)}
                    %
                  </h3>
                  <BarLoader color="white" />
                </div>
              )}

              <Modal
                isOpen={modalIsOpen}
                onRequestClose={async () => {
                  if (!closeVideo) {
                    return;
                  }
                  if (watched) {
                    sendMessage("Video", "EndWatchingVideo");
                    setIsOpen(false);
                  } else {
                    try {
                      const response = await markWatched(
                        video,
                        instance.getActiveAccount().username
                      );
                      console.log(response);
                      sendMessage("Video", "EndWatchingVideo");
                      setIsOpen(false);
                    } catch (e) {
                      sendMessage("Video", "EndWatchingVideo");
                      console.log(e);
                    }
                  }
                }}
                style={customStyles}
                contentLabel="VideoPlayer"
              >
                <ReactPlayer
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={false}
                  pip={false}
                  onProgress={(played) => handleVideoProgress(played.played)}
                  url={`https://simuladorbat.s3.amazonaws.com/videos/${video}`}
                />

                <div
                  onClick={async () => {
                    if (!closeVideo) {
                      return;
                    }
                    if (watched) {
                      sendMessage("Video", "EndWatchingVideo");
                      setIsOpen(false);
                    } else {
                      try {
                        const response = await markWatched(
                          video,
                          instance.getActiveAccount().username
                        );
                        console.log(response);
                        sendMessage("Video", "EndWatchingVideo");
                        setIsOpen(false);
                      } catch (e) {
                        sendMessage("Video", "EndWatchingVideo");
                        console.log(e);
                      }
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CProgress
                    value={closeVideo || watched ? 100 : videoTime * 2}
                  >
                    {closeVideo || watched ? "Prosseguir" : "Aguarde..."}
                  </CProgress>
                </div>
              </Modal>

              <Unity
                unityProvider={unityProvider}
                style={{
                  width: "100vw",
                  height: "100vh",
                  visibility: isLoaded ? "visible" : "hidden",
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
          <img src="/bat_logo.png" />
          <PulseLoader color="white" />
          <h3>Redirecionando para o login azure...</h3>
          
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};
