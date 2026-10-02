import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header, MenuPages } from "./components/Navbar";
import { AllRoutes } from "./components/Routes/AllRoutes";
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
            <AllRoutes />
            <Footer />
          </RecruiterProvider>
        </ApplicationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
