import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export function Game() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/build/Build/BAT.loader.js",
    dataUrl: "/build/Build/BAT.data",
    frameworkUrl: "build/Build/BAT.framework.js",
    codeUrl: "build/Build/BAT.wasm",
  });

  return (
    <Unity
      style={{
        width: "80vw",
        height: "40.25vw",
      }}
      unityProvider={unityProvider}
    />
  );
}
