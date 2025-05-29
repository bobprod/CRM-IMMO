import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/Login";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {/* For the tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route
            path="/properties"
            element={<Home initialTab="properties" />}
          />
          <Route path="/prospects" element={<Home initialTab="prospects" />} />
          <Route path="/matching" element={<Home initialTab="matching" />} />
          <Route
            path="/marketing/*"
            element={<Home initialTab="marketing" />}
          />
          <Route
            path="/prospecting/*"
            element={<Home initialTab="prospecting" />}
          />
          <Route path="/settings" element={<Home initialTab="settings" />} />

          {/* Add this before the catchall route to allow tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
