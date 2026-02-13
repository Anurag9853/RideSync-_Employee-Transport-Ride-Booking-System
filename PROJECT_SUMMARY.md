# RideSync - Production-Level Full-Stack Project

## 🎯 Project Overview

RideSync is a complete, production-ready corporate ride management system with role-based access control, built with Spring Boot backend and React frontend.

## ✅ Completed Features

### Backend (Spring Boot)
- ✅ JWT Authentication & Authorization
- ✅ Role-based access control (ADMIN, EMPLOYEE)
- ✅ Complete CRUD for Rides
- ✅ Booking management with transaction safety
- ✅ Admin dashboard statistics
- ✅ User management (Admin only)
- ✅ Booking management (Admin can cancel any booking)
- ✅ CORS configuration for frontend
- ✅ Global exception handling
- ✅ Input validation
- ✅ Pessimistic locking for seat booking (prevents overbooking)

### Frontend (React + Vite)
- ✅ Separate Admin and Employee layouts
- ✅ Role-based routing with guards
- ✅ Toast notifications system
- ✅ Modal dialogs for confirmations
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Pagination components
- ✅ Status badges
- ✅ Responsive design
- ✅ Clean, professional UI

### Admin Features
- ✅ Dashboard with system statistics
- ✅ Manage Rides (Create, Edit, Cancel)
- ✅ Manage Users (View, Delete)
- ✅ Manage Bookings (View, Cancel any booking)
- ✅ Analytics overview

### Employee Features
- ✅ Dashboard with quick navigation
- ✅ Browse Rides (Search, Filter, Book)
- ✅ My Bookings (View, Cancel own bookings)
- ✅ Booking confirmation modals
- ✅ Real-time seat availability

## 📁 Project Structure

### Backend Structure
```
src/main/java/com/ridesync/backend/
├── config/
│   └── SecurityConfig.java          # Security & CORS config
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   ├── AdminController.java         # Admin endpoints
│   ├── AdminRideController.java     # Admin ride management
│   ├── RideController.java          # Employee ride endpoints
│   └── BookingController.java       # Booking endpoints
├── service/
│   ├── AuthService.java
│   ├── RideService.java
│   ├── BookingService.java
│   └── AdminService.java            # Admin operations
├── repository/
│   ├── UserRepository.java
│   ├── RideRepository.java
│   └── BookingRepository.java
├── entity/
│   ├── User.java
│   ├── Ride.java
│   ├── Booking.java
│   └── Enums (Role, RideStatus, BookingStatus)
├── dto/
│   ├── auth/
│   ├── ride/
│   ├── booking/
│   └── admin/                       # Admin DTOs
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationEntryPoint.java
└── exception/
    └── GlobalExceptionHandler.java
```

### Frontend Structure
```
ridesync-frontend/src/
├── api/
│   └── axiosInstance.js             # API client with interceptors
├── components/
│   ├── common/                      # Reusable components
│   │   ├── Toast.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Pagination.jsx
│   │   └── EmptyState.jsx
│   └── guards/
│       └── RoleGuard.jsx            # Role-based route protection
├── contexts/
│   └── AuthContext.jsx              # Authentication state
├── hooks/
│   ├── useToast.js                  # Toast notifications hook
│   └── useModal.js                  # Modal state hook
├── layouts/
│   ├── AdminLayout.jsx              # Admin navigation layout
│   └── EmployeeLayout.jsx           # Employee navigation layout
├── pages/
│   ├── Login.jsx                    # Login page
│   ├── Register.jsx                  # Registration page
│   ├── admin/
│   │   ├── AdminDashboard.jsx       # Admin dashboard with stats
│   │   ├── ManageRides.jsx          # CRUD for rides
│   │   ├── ManageUsers.jsx          # User management
│   │   └── ManageBookings.jsx       # Booking management
│   └── employee/
│       ├── EmployeeDashboard.jsx    # Employee dashboard
│       ├── BrowseRides.jsx          # Browse & book rides
│       └── MyBookings.jsx           # View & cancel bookings
├── styles/
│   ├── global.css                   # Global styles
│   ├── auth.css                     # Auth page styles
│   ├── layout.css                   # Layout styles
│   ├── toast.css                    # Toast styles
│   ├── modal.css                    # Modal styles
│   ├── skeleton.css                 # Loading skeleton styles
│   ├── badge.css                    # Status badge styles
│   ├── pagination.css               # Pagination styles
│   ├── empty-state.css              # Empty state styles
│   ├── admin-dashboard.css          # Admin dashboard styles
│   ├── manage-rides.css              # Manage rides styles
│   ├── manage-table.css              # Table styles
│   ├── browse-rides.css             # Browse rides styles
│   └── my-bookings.css              # My bookings styles
├── utils/
│   ├── dateUtils.js                 # Date formatting utilities
│   └── validation.js                # Validation utilities
├── constants/
│   └── roles.js                     # Role constants & routes
├── App.jsx                          # Main app with routing
└── main.jsx                         # Entry point
```

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Admin and Employee roles with separate routes
3. **Route Guards**: Frontend prevents unauthorized access
4. **CORS Configuration**: Properly configured for frontend-backend communication
5. **Password Encryption**: BCrypt password hashing
6. **Input Validation**: Server-side validation for all inputs
7. **Transaction Safety**: Pessimistic locking prevents race conditions

## 🚀 How to Run

### Backend
1. Update `application.properties` with your MySQL credentials
2. Run: `mvn spring-boot:run`
3. Backend runs on `http://localhost:8080`

### Frontend
1. Navigate to `ridesync-frontend/`
2. Install dependencies: `npm install`
3. Run: `npm run dev`
4. Frontend runs on `http://localhost:5173`

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register employee
- `POST /auth/login` - Login (returns JWT)

### Admin Endpoints
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/rides` - List all rides (paginated)
- `POST /admin/rides` - Create ride
- `PUT /admin/rides/{id}` - Update ride
- `DELETE /admin/rides/{id}` - Cancel ride
- `GET /admin/users` - List all users (paginated)
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/bookings` - List all bookings (paginated)
- `DELETE /admin/bookings/{id}` - Cancel booking

### Employee Endpoints
- `GET /rides` - Browse available rides (paginated, filterable)
- `POST /rides/{rideId}/book` - Book a ride
- `GET /bookings/my` - Get my bookings
- `DELETE /bookings/{bookingId}` - Cancel my booking

## 🎨 UI Features

- **Toast Notifications**: Success, error, warning, info messages
- **Confirmation Modals**: For destructive actions
- **Loading States**: Skeleton loaders during data fetch
- **Empty States**: Helpful messages when no data
- **Status Badges**: Visual status indicators
- **Pagination**: Navigate through paginated data
- **Responsive Design**: Works on mobile and desktop
- **Professional Styling**: Clean, modern UI

## 🔄 Business Logic

1. **Seat Management**: Automatically updates when booking/cancelling
2. **Ride Status**: Auto-updates to FULL when seats = 0
3. **Booking Restrictions**: 
   - Cannot book same ride twice
   - Cannot book cancelled/full rides
   - Cannot cancel others' bookings
4. **Ride Cancellation**: Admin cancelling ride auto-cancels all bookings
5. **Transaction Safety**: Pessimistic locking prevents overbooking

## 📝 Notes

- All API calls use axios interceptors for automatic JWT attachment
- Role-based routing ensures admins and employees see only their pages
- Toast notifications provide user feedback for all actions
- Loading states improve perceived performance
- Empty states guide users when no data is available
- Professional error handling throughout

This is a complete, production-ready full-stack application suitable for placement interviews and real-world use.
