import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../Auth";
import { PageLoader } from "../Loading";

const Home = lazy(() => import("../../pages/Home"));
const Jobs = lazy(() => import("../../pages/Jobs"));
const JobDetail = lazy(() => import("../../pages/JobDetail"));
const Companies = lazy(() => import("../../pages/Companies"));
const CompanyDetail = lazy(() => import("../../pages/CompanyDetail"));
const Login = lazy(() => import("../../pages/Login"));
const Profile = lazy(() => import("../../pages/Profile"));
const Applications = lazy(() => import("../../pages/Applications"));
const NotFound = lazy(() => import("../../pages/NotFound"));

export const AllRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/companies/:id/:tab" element={<CompanyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/candidaturas"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

