import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import AdminBookings from "./components/AdminBookings";
import AdminBookingspage from "./pages/AdminBookingspage";
import SuperAdminPanel from "./pages/SuperAdminPanel";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ContactUs from "./components/Contact";
import AgreementTwoStep from "./pages/AgreementFrom";
import TermsAndConditions from "./pages/Terms&Conditions";

const App = () => {
  const { isLoggedIn, isAdmin } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="mx-auto">
              <Header />
              <Home />
              <Footer />
            </div>
          }
        />
        <Route
          path="/search"
          element={
            <div className=" mx-auto">
              <Header />
              <Search />
              <Footer />
            </div>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <>
              <Header />
              <TermsAndConditions />
              <Footer />
            </>
          }
        />
        <Route
          path="/agreement"
          element={
            <Layout>
              <AgreementTwoStep />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />
          </>
        )}

        {isLoggedIn && isAdmin && (
          <>
            <Route
              path="/admin-bookings"
              element={
                <Layout>
                  <AdminBookingspage />
                </Layout>
              }
            />
            <Route
              path="/super-admin-panel"
              element={
                <Layout>
                  <SuperAdminPanel />
                </Layout>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
