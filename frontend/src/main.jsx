import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import "./index.css";
import { store } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </Provider>
);
