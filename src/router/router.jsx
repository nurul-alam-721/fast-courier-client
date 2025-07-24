import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import PrivateRoute from "../Routes/PrivateRoute";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackPercel from "../Pages/Dashboard/TrackPercel/TrackPercel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "coverage", Component: Coverage },
      { path: "beARider", Component: BeARider },
      { path: "sendParcel", Component: SendParcel },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        element: (
          <PrivateRoute>
            <MyParcels />
          </PrivateRoute>
        ),
      },
      {
        path: "activeRiders",
        Component: ActiveRiders,
        loader: () =>
          fetch("http://localhost:5000/riders/approved").then((res) =>
            res.json()
          ),
      },
      {
        path: "pendingRiders",
        Component: PendingRiders,
        loader: () =>
          fetch("http://localhost:5000/riders/pending").then((res) =>
            res.json()
          ),
      },
      {
        path: "payment/:id",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackPercel,
      },
    ],
  },
]);
