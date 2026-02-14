# Admin Dashboard - Cosmetics E-Commerce

A comprehensive admin dashboard for managing a Clothing Wholesale e-commerce platform built with Next.js, ShadCN UI, and TailwindCSS.

## Features

### 🏠 Dashboard Overview
- **Stats Cards**: Total sales, orders, customers, and top products
- **Revenue Analytics**: Interactive charts showing sales trends
- **Recent Orders**: Quick overview of latest customer orders
- **Top Products**: Best performing products with ratings and sales data

### 📊 Analytics & Reporting
- **Revenue Charts**: Line charts for revenue over time
- **Category Performance**: Bar charts for product category sales
- **Payment Methods**: Pie charts showing payment distribution
- **Customer Segments**: Customer distribution and revenue contribution
- **Export Functionality**: Download reports and data

### 📦 Order Management
- **Order Table**: Comprehensive view of all orders
- **Status Updates**: Change order status (Pending, Shipped, Delivered, Cancelled)
- **Search & Filter**: Find orders by customer, ID, or status
- **Order Details**: View customer information, items, and payment details

### 👥 Customer Management
- **Customer Database**: Complete customer information
- **Customer Tiers**: Bronze, Silver, Gold, Platinum tiers
- **Status Management**: Activate, deactivate, or ban customers
- **Contact Information**: Email, phone, and location details
- **Purchase History**: Total orders and spending per customer

### 🛍️ Product Management
- **Product Catalog**: Manage all products in the store
- **Stock Management**: Track inventory levels with low stock alerts
- **Category Organization**: Organize products by categories
- **CRUD Operations**: Create, read, update, and delete products
- **Image Management**: Upload and manage product images

### 🔔 Notifications System
- **Real-time Alerts**: Low stock, new orders, payment issues
- **Priority Levels**: High, medium, and low priority notifications
- **Notification Types**: System alerts, customer reviews, sales alerts
- **Mark as Read**: Manage notification status

### ⚙️ Settings & Configuration
- **Profile Management**: Update admin profile information
- **Notification Preferences**: Configure alert settings
- **Appearance Settings**: Theme, language, and timezone
- **Security Settings**: Two-factor auth, password policies
- **System Information**: View system status and versions

### 🔐 Authentication & Security
- **Admin Login**: Secure authentication system
- **Session Management**: Configurable session timeouts
- **Access Protection**: Route protection for admin areas
- **Password Security**: Password expiry and strength requirements

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: ShadCN UI, Radix UI
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Access the application:
- Main Site: `http://localhost:3000`
- Login Page: `http://localhost:3000/login`
- Admin Dashboard: `http://localhost:3000/admin` (after admin login)

### Demo Credentials
- **Admin:** `admin@example.com` / `admin123`
- **Manager:** `manager@example.com` / `manager123` 
- **Regular User:** `user@example.com` / `user123`

## File Structure

```
src/
├── app/admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Main dashboard
│   ├── orders/page.tsx         # Order management
│   ├── customers/page.tsx      # Customer management
│   ├── products/page.tsx       # Product management
│   ├── analytics/page.tsx      # Analytics dashboard
│   ├── notifications/page.tsx  # Notifications center
│   └── settings/page.tsx       # Settings & configuration
├── components/admin/
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── AdminProtection.tsx     # Authentication guard
│   ├── charts/                 # Chart components
│   │   ├── RevenueChart.tsx
│   │   ├── CategoryChart.tsx
│   │   └── PaymentMethodChart.tsx
│   ├── RecentOrders.tsx        # Recent orders widget
│   └── TopProducts.tsx         # Top products widget
├── components/auth/
│   └── AuthProvider.tsx        # Authentication context
└── components/ui/              # ShadCN UI components
    ├── card.tsx
    ├── table.tsx
    ├── button.tsx
    ├── badge.tsx
    └── select.tsx
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Responsive tables and charts
- Touch-friendly interface

### Data Visualization
- Interactive charts with tooltips
- Real-time data updates
- Export functionality
- Customizable date ranges

### User Experience
- Intuitive navigation
- Quick actions and shortcuts
- Search and filter capabilities
- Loading states and error handling

### Security Features
- Protected admin routes
- Session management
- Password policies
- Two-factor authentication support

## Customization

### Themes
The dashboard supports light/dark themes and can be customized via the settings page.

### Charts
Charts are built with Recharts and can be easily customized:
- Colors and styling
- Data formats
- Chart types
- Interactive features

### Notifications
The notification system is extensible:
- Add new notification types
- Customize priority levels
- Configure delivery methods
- Set up automated alerts

## API Integration

The dashboard is designed to work with REST APIs:
- `/api/orders` - Order management
- `/api/products` - Product catalog
- `/api/customers` - Customer database
- `/api/analytics` - Analytics data
- `/api/notifications` - Notification system

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
