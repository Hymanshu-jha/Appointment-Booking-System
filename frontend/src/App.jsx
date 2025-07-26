import { BrowserRouter, Routes, Route } from "react-router-dom";



import Navbar from "./components/Navbar";
import Signup from "./pages/auth/Signup";
import { Login } from "./pages/auth/Login";
import Stores from "./pages/general/Stores";
import { Home } from "./pages/general/Home";
import Booking from "./pages/general/Booking";
import Services from "./pages/general/Services";
import Chatpage from "./pages/general/Chatpage";
import { Mystore } from "./pages/seller/Mystore";
import AuthProvider from "./provider/AuthProvider";
import { Analytics } from "./pages/seller/Analytics";
import { MyServices } from "./pages/seller/MyServices";
import Appointments from "./pages/general/Appointments";
import ServiceLayout from "./pages/general/ServiceLayout";
import { ProtectedRoute } from "./protected/ProtectedRoute";
import ServiceDetails from "./pages/general/ServiceDetails";
import { ShowStores } from "./pages/seller/ShowStores";
import { AddStore } from "./pages/seller/AddStore";
import { MyServicePage } from "./pages/seller/MyServicePage";
import { AddService } from "./pages/seller/AddService";
import { AppointmentStatus } from "./pages/general/AppointmentStatus";
import { AppointmentLayout } from "./pages/general/AppointmentLayout";
import PaymentNotProcessed from "./pages/general/PaymentNotProcessed";




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* protected routes */}

          {/* services/:serviceId routes */}
          <Route
            path="/services/:serviceId/:serviceName"
            element={
              <ProtectedRoute>
                <ServiceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ServiceDetails />} />
            <Route path="booking" element={<Booking />} />
          </Route>

          {/* appointments routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:appointmentId"
            element={
              <ProtectedRoute>
                <AppointmentLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="status"
              element={<AppointmentStatus />}
            >
              <Route
                path="chatpage"
                element={<Chatpage />}
              />
            </Route>
          </Route>

          {/* seller protected routes */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mystore"
            element={
              <ProtectedRoute>
                <Mystore />
              </ProtectedRoute>
            }
          > 
            <Route index element={<ShowStores/>} />
            <Route path="addstore" element={<AddStore/>} />
          </Route>


       <Route
       path="/mystore/:storeId/:storeName/myservices"
       element={
        < ProtectedRoute>
          <MyServices/>
        </ProtectedRoute>
       }
       >
          <Route index element={<MyServicePage/>}/>
          <Route path='addservices' element={<AddService/>}/>
       </Route>

          <Route
            path="/appointmentsreceived"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          
          <Route 
          path="/cancel"
          element={
            <ProtectedRoute>
          <PaymentNotProcessed />
          </ProtectedRoute>
          }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;