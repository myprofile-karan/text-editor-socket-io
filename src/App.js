import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import {v4 as uuidV4} from "uuid";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to={`/documents/${uuidV4()}`}  />} exact>
          </Route>
          <Route path="/documents/:id" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
