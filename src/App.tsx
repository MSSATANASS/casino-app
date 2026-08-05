import { useState } from "react";
import Shell from "./components/Shell";
import Splash from "./components/Splash";
import LoginModal from "./components/LoginModal";
import Home from "./components/Home";
import Crash from "./components/Crash";
import Mines from "./components/Mines";
import Plinko from "./components/Plinko";
import Towers from "./components/Towers";
import Deposit from "./components/Deposit";
import Profile from "./components/Profile";
import type { Screen } from "./lib/games";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [splash, setSplash] = useState(true);

  return (
    <>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <Shell screen={screen} setScreen={setScreen}>
        {screen === "home" && <Home setScreen={setScreen} />}
        {screen === "crash" && <Crash />}
        {screen === "mines" && <Mines />}
        {screen === "plinko" && <Plinko />}
        {screen === "towers" && <Towers />}
        {screen === "deposit" && <Deposit />}
        {screen === "profile" && <Profile />}
      </Shell>
      <LoginModal />
    </>
  );
}
