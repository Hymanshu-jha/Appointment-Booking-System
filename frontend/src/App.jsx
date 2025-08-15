import { BrowserRouter, Routes, Route } from "react-router-dom";



import Navbar from "./components/Navbar";
import Signup from "./pages/auth/Signup";
import { Login } from "./pages/auth/Login";
import Stores from "./pages/general/Stores";
import { Home } from "./pages/general/Home";
import Booking from "./pages/general/Booking";
import Services from "./pages/general/Services";
import Chatpage from "./pages/general/Chatpage";
import AuthProvider from "./provider/AuthProvider";
import { Analytics } from "./pages/seller/Analytics";
import { MyServices } from "./pages/seller/MyServices";
import Appointments from "./pages/general/Appointments";
import BoughtAppointments from "./pages/general/BoughtAppointments";
import SoldAppointments from "./pages/general/SoldAppointments";
import ServiceLayout from "./pages/general/ServiceLayout";
import { ProtectedRoute } from "./protected/ProtectedRoute";
import ServiceDetails from "./pages/general/ServiceDetails";
import { ShowStores } from "./pages/seller/ShowStores";
import { AddStore } from "./pages/seller/AddStore";
import { Mystore } from "./pages/seller/MyStore";
import { MyServicePage } from "./pages/seller/MyServicePage";
import { AddService } from "./pages/seller/AddService";
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
      <Appointments /> {/* This will be the layout */}
    </ProtectedRoute>
  }
>
  {/* Default index = bought */}
  <Route index element={<BoughtAppointments />} />
  {/* Sold */}
  <Route path="sold" element={<SoldAppointments />} />
</Route>

     

              <Route
                path="/appointments/:id/chatpage"
                element={<Chatpage />}
              />



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