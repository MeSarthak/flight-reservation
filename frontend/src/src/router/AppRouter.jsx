// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/user/Home";
import FlightDetails from "../pages/user/FlightDetails";
import MyBookings from "../pages/user/MyBookings";
import PaymentPage from "../pages/user/PaymentPage";
import Dashboard from "../pages/Admin/Dashboard";
import ManageFlights from "../pages/admin/ManageFlights";
import ManageAircrafts from "../pages/admin/ManageAircrafts";
import ManageAirports from "../pages/admin/ManageAirports";
import AddFlight from "../pages/admin/AddFlight";
import Analytics from "../pages/admin/Analytics";
import Payment from "../pages/user/Payment";

const AppRouter = () => (
    <AuthProvider>
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/flights/:id" element={<FlightDetails />} />

                {/* User protected routes */}
                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    }
                />

                {/* Admin protected routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute adminOnly>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/manage-flights"
                    element={
                        <ProtectedRoute adminOnly>
                            <ManageFlights />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/manage-aircrafts"
                    element={
                        <ProtectedRoute adminOnly>
                            <ManageAircrafts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/manage-airports"
                    element={
                        <ProtectedRoute adminOnly>
                            <ManageAirports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/add-flight"
                    element={
                        <ProtectedRoute adminOnly>
                            <AddFlight />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute adminOnly>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    </AuthProvider>
);

export default AppRouter;
