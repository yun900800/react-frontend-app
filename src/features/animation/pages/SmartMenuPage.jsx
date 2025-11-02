import React, { useState} from "react";
import SmartMenuCSS from "../components/smart-menu/SmartMenuCSS";
import SmartMenuKeyframes from "../components/smart-menu/SmartMenuKeyframes";
import SmartMenuMotion from "../components/smart-menu/SmartMenuMotion";

export function SmartMenu({ mode }) {
  switch (mode) {
    case "css":
      return <SmartMenuCSS />;
    case "keyframes":
      return <SmartMenuKeyframes />;
    case "motion":
      return <SmartMenuMotion />;
    default:
      return null;
  }
}

export default function SmartMenuPage() {
   const [mode, setMode] = useState("css");

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>🎨 Animated Smart Menu (React Motion Lab)</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setMode("css")}>CSS Transition</button>
        <button onClick={() => setMode("keyframes")}>Keyframes</button>
        <button onClick={() => setMode("motion")}>Framer Motion</button>
      </div>
      <SmartMenu mode={mode} />
    </div>
  );
}
