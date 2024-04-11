import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import { ParallaxProvider } from 'react-scroll-parallax';

import Container from 'react-bootstrap/Container';

import Loader from './components/Loader.jsx';
import Footer from './components/Footer.jsx';

import GuestAuth from './auths/GuestAuth.jsx';
import ParamsAuth from './auths/ParamsAuth.jsx';
import UserAuth from './auths/UserAuth.jsx';

import {
  RegistrationPage, LoginPage,
  VerifyEmailPage,
  ForgetPasswordPage, ResetPasswordPage
} from './pages/auth';

import { AddNewEvent, ModifyEvent } from './pages/events';
import { Home } from './pages/landing';
import { NetErrorPage } from './pages/misc';

import ProfilePage from './pages/ProfilePage.jsx';
//import EditProfile from './pages/EditProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';
// ==============================================
import './App.css';

import { store, persistor } from './store.jsx';
import { sessionTokenStorageName, updateDeviceID, callServerAPI, updateSessionToken } from './apis/apiAxiosFetch.jsx';

import { AuthProvider } from './contexts/AuthProvider.jsx';

import { onLoadingStart, onLoadingEnd } from './data/loaders.js';
import { errorNoAuthEventName, errorServerEventName } from './data/error-loggers.js';
// =========================================
export function Layout() {
  return (
    <>
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

    if (accessToken && accessToken !== "null") {
      updateSessionToken(accessToken);

      onLoadingStart("Global");
      callServerAPI("whoami", "GET", null,
        // On Successful Callback
        (result) => {
          onLoadingEnd("Global");

          // Debug
          //console.log("[Who Am I Verification Successful - Start of App Lifespan] Result.", result);

          // NOTE: We're using event dispatch instead of directly calling redux's dispatch action
          // Because "App.jsx" is not part of the Redux Provider's scope.
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
        <ParallaxProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Routes>
                {/* Append "Layout" component on top of all the following pages */}
                <Route path="/" element={<Layout />}>
                  {/* ------------------------- */}
                  {/* Dashboard (Main Page Redirect after Logged In) */}
                  <Route element={
                    <UserAuth>
                      <Dashboard />
                    </UserAuth>
                  } path="/dashboard" />
                  {/* ------------------------- */}
                  {/* User Profile Page(s) */}
                  <Route element={
                    <UserAuth>
                      <ProfilePage />
                    </UserAuth>
                  } path="/profile" />

                  {
                    /*
                    <Route element={
                      <UserAuth>
                        <EditProfile />
                      </UserAuth>
                    } path="/profile/edit" />
                    */
                  }
                  {/* ------------------------- */}
                  {/* Event Page(s) */}
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
                  {/* ------------------------- */}
                  {/* Authentication Pages */}
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
                    <GuestAuth>
                      <VerifyEmailPage />
                    </GuestAuth>
                  } path="/verify/:token" />

                  <Route element={
                    <GuestAuth>
                      <ForgetPasswordPage />
                    </GuestAuth>
                  } path="/password/forget" />

                  <Route element={
                    <GuestAuth>
                      <ResetPasswordPage />
                    </GuestAuth>
                  } path="/password/reset/:token" />
                  {/* ------------------------- */}
                  {/* Error Page (Codebase will explicitly send user to this page
                  * when server responds with a "500" code from API requests) 
                  */}
                  <Route element={
                    <NetErrorPage />
                  } path="/error" />
                  {/* ------------------------- */}
                  {/* Default Landing Pages -> Home */}
                  <Route index element={<Home />} />

                  <Route element={
                    <Home />
                  } path="/home" />

                  <Route element={
                    <Home />
                  } path="/*" />
                  {/* ------------------------- */}
                </Route>
              </Routes>
            </PersistGate>
          </Provider>
        </ParallaxProvider>
      </AuthProvider>
    </Container>
  );
}

export default App
// =========================================
