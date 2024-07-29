import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EnterRoom from "./pages/EnterRoom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App bg-[beige]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/join" />}></Route>
          <Route path="join" element={<EnterRoom />} />
          <Route path="/editor/:id/:name" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  );
}

export default App;
