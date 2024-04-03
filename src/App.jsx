import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';

import Loader from './components/Loader.jsx';
import NavigationPanel from './components/NavigationPanel.jsx';
import Footer from './components/Footer.jsx';

import GuestAuth from './auths/GuestAuth.jsx';
import ParamsAuth from './auths/ParamsAuth.jsx';
import UserAuth from './auths/UserAuth.jsx';

import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

import Dashboard from './pages/Dashboard.jsx';
import EditProfile from './pages/EditProfile.jsx';
import NetErrorPage from './pages/NetErrorPage.jsx';

import AddNewEvent from './pages/AddNewEvent.jsx';
import ModifyEvent from './pages/ModifyEvent.jsx';
// ==============================================

import './App.css';

import { store, persistor } from './store.jsx';
import { sessionTokenStorageName, updateDeviceID, callServerAPI, updateSessionToken } from './apis/authApi.jsx';

import { AuthProvider } from './contexts/AuthProvider.jsx';

import { onLoadingStart, onLoadingEnd } from './data/loaders.js';
import { errorNoAuthEventName, errorServerEventName } from './data/error-loggers.js';
// =========================================
export function Layout() {
  return (
    <>
      <NavigationPanel />
      <Loader />
      <Outlet />
      <Footer />
    </>
  );
}
// =========================================
function App() {
  // ================
  const navigate = useNavigate();
  // ================
  const [deviceID, setDeviceID] = useLocalStorage("device-id", null);
  if (!deviceID) {
    const userAgentData = window.navigator.userAgentData;
    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);

    const deviceID = `${userAgentData.platform}-${userAgentData.brands[0].brand}-${randomString}`;
    setDeviceID(deviceID);
  }
  updateDeviceID(deviceID);
  // ================
  // Verify Access Token at the beginning of the app.
  useEffect(() => {
    const accessToken = localStorage.getItem(sessionTokenStorageName, null);

    const onUnauthorizationDetectedCallback = () => {
      updateSessionToken(null);
      navigate("/login");
    };

    const onServerErrorDetectedCallback = () => navigate("/error");

    window.addEventListener(errorNoAuthEventName, onUnauthorizationDetectedCallback);
    window.addEventListener(errorServerEventName, onServerErrorDetectedCallback);

    if (accessToken) {
      updateSessionToken(accessToken);

      onLoadingStart("Global");
      callServerAPI("whoami", "GET", null,
        // On Successful Callback
        (result) => {
          onLoadingEnd("Global");

          // Debug
          //console.log("[Who Am I Verification Successful - Start of App Lifespan] Result.", result);

          window.dispatchEvent(new CustomEvent("User Identified", {
            detail: {
              client_data: {
                user: result.user
              }
            }
          }));
        },
        // On Failed Callback
        (error) => {
          onLoadingEnd("Global");

          // Debug
          //console.log("[Who Am I Verification Failed - Start of App Lifespan] Error.", error);
        }
      );
    }

    return (() => {
      window.removeEventListener(errorNoAuthEventName, onUnauthorizationDetectedCallback);
      window.removeEventListener(errorServerEventName, onServerErrorDetectedCallback);
    });
  }, [navigate]);
  // ================
  return (
    <Container fluid className="main-container m-0 p-0">
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* ------------------------- */}
                {/* Modify User Info Page */}
                <Route element={
                  <UserAuth>
                    <EditProfile />
                  </UserAuth>
                } path="/profile/edit" />
                {/* ------------------------- */}
                {/* View Events Page */}
                {/* ------------------------- */}
                {/* Create Events Page */}
                {/* ------------------------- */}
                {/* Default Landing Pages */}
                <Route index element={<Home />} />

                <Route element={
                  <UserAuth>
                    <Dashboard />
                  </UserAuth>
                } path="/dashboard" />

                <Route element={
                  <UserAuth>
                    <AddNewEvent />
                  </UserAuth>
                } path="/event/add" />

                <Route element={
                  <UserAuth>
                    <ParamsAuth>
                      <ModifyEvent />
                    </ParamsAuth>
                  </UserAuth>
                } path="/event/modify" />

                <Route element={
                  <GuestAuth>
                    <LoginPage />
                  </GuestAuth>
                } path="/login" />

                <Route element={
                  <GuestAuth>
                    <RegistrationPage />
                  </GuestAuth>
                } path="/register" />

                <Route element={
                  <NetErrorPage />
                } path="/error" />
                {/* ------------------------- */}
                <Route path="/*" element={<AuthPage />} />
              </Route>
            </Routes>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </Container>
  );
}

export default App
// =========================================
