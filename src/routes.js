import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
const Dashboard = React.lazy(() => import('./views/DashBoard'));
const User = React.lazy(() => import('./views/User'));
const Driver = React.lazy(() => import('./views/DriverDetails/DriverTable'));
const DriverForm = React.lazy(() => import('./views/DriverDetails/DriverForm'));
const Edit = React.lazy(() => import('./views/Edit/Edit'));
const Ambulance = React.lazy(() => import('./views/Ambulances/Ambulance'));
const AmbulanceAdd = React.lazy(() => import('./views/Ambulances/AmbulanceAdd'));
const DetailPage = React.lazy(() => import('./views/DriverDetails/DriverDetails'));
const Profile = React.lazy(() => import('./views/Profile/Profile'));
const Cards = React.lazy(() => import('./component/Card'));
const bloodBank = React.lazy(() => import('./views/BloodBank/BloodBank'));
const BloodBankAdd = React.lazy(() => import('./views/BloodBank/BloodBankAdd'));
const BloodBankCards = React.lazy(() => import('./component/BloodBankCards'));
const routes = [
  { path: '/home', exact: true, name: 'Home', component: DefaultLayout },
  {
    path: '/home/dashboard',
    exact: true,
    name: 'Dashboard',
    component: Dashboard
  },
  { path: '/home/user', exact: true, name: 'User', component: User },
  { path: '/home/user/edit/:id', exact: true, name: 'Edit', component: Edit },
  { path: '/home/driver', exact: true, name: 'Driver', component: Driver },
  {
    path: '/home/driver/add',
    exact: true,
    name: 'Add',
    component: DriverForm
  },
  {
    path: '/home/driver/edit/:id',
    exact: true,
    name: 'Edit',
    component: Edit
  },
  {
    path: '/home/driver/detail/:id',
    exact: true,
    name: 'Detail',
    component: DetailPage
  },
  {
    path: '/home/ambulance',
    exact: true,
    name: 'Ambulance',
    component: Ambulance
  },
  {
    path: '/home/bloodbank',
    exact: true,
    name: 'Blood Bank',
    component: bloodBank
  },
  {
    path: '/home/bloodbank/add',
    exact: true,
    name: 'Add',
    component: BloodBankAdd
  },
  {
    path: '/home/ambulance/add',
    exact: true,
    name: 'Add',
    component: AmbulanceAdd
  },
  {
    path: '/home/ambulance/detail/:id',
    exact: true,
    name: 'Edit Ambulance',
    component: AmbulanceAdd
  },

  {
    path: '/home/profile',
    exact: true,
    name: 'Profile',
    component: Profile
  },
  {
    path: '/home/ambulance/edit/:id',
    exact: true,
    name: 'Edit',
    component: Cards
  },
  {
    path: '/home/bloodbank/edit/:id',
    exact: true,
    name: 'Edit',
    component: BloodBankCards
  },
  {
    path: '/home/ambulance/add/driver/:id',
    exact: true,
    name: 'Add Driver',
    component: Cards
  }
  // {
  //   path: '/home/*',
  //   exact: true,
  //   name: 'Home',
  //   component: Dashboard
  // }
];

export default routes;
