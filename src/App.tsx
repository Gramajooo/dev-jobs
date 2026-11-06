import { BrowserRouter } from "react-router-dom";
import { Footer, Header, MenuPages } from "./components/layout";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import { RecruiterProvider } from "./context/RecruiterContext";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationsProvider>
          <RecruiterProvider>
            <Header>
              <MenuPages />
            </Header>
            <AppRoutes />
            <Footer />
          </RecruiterProvider>
        </ApplicationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
