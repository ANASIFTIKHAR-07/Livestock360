# 🐄 Livestock360

> A Smart Livestock Health & Management System

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Livestock360 is a comprehensive mobile-based livestock management system that enables farmers to digitally manage animal profiles, health records, vaccinations, and treatment history. Built with React Native and a scalable Node.js backend, it provides farmers with an efficient tool to track their livestock's health and maintain detailed records.

## 📱 Demo

*[Add screenshots or demo GIF here]*

## ✨ Features

### 🐮 Animal Management
- **Digital Livestock Profiles**: Create and manage comprehensive profiles for each animal
- **Photo Documentation**: Capture and store animal photos for easy identification
- **Smart Organization**: Filter and sort animals by type, health status, and other criteria
- **Quick Search**: Find animals instantly by tag number or name
- **Detailed Information**: Track breed, age, gender, weight, and custom notes

### 💉 Health Records
- **Vaccination Tracking**: Schedule and record vaccinations with automatic reminders
- **Treatment History**: Maintain detailed medical records for each animal
- **Health Status Monitoring**: Visual indicators for animal health status (Healthy, Attention, Critical)
- **Veterinary Records**: Store vet visit details, prescriptions, and costs
- **Document Storage**: Attach photos of receipts and medical documents

### 📊 Dashboard & Analytics
- **At-a-Glance Overview**: View total animals and health status distribution
- **Upcoming Reminders**: Never miss a vaccination with smart notifications
- **Activity Feed**: Track recent additions and health record updates
- **Statistics**: Analyze herd composition and health trends

### 🔔 Smart Notifications
- **Local Push Notifications**: Receive alerts for upcoming vaccinations
- **Proactive Reminders**: Get notified 3 days before due dates
- **Overdue Alerts**: Track overdue vaccinations and checkups

### 🎨 User Experience
- **Farmer-First Design**: Large touch targets and readable text for field use
- **Offline-Ready**: Works even with poor network connectivity
- **Intuitive Navigation**: Bottom tab navigation for quick access
- **Clean Interface**: Modern, professional UI with accessibility in mind

## 🏗️ Architecture

### **Mobile App (Frontend)**
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Authentication**: Firebase Authentication
- **Styling**: Custom StyleSheet following design system
- **Image Handling**: Expo Image Picker
- **Notifications**: Expo Notifications

### **Backend API**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK / JWT
- **File Upload**: Multer
- **Validation**: express-validator
- **API Style**: RESTful

### **System Architecture**
```
┌─────────────────────┐
│   React Native App  │
│   (Mobile Client)   │
└──────────┬──────────┘
           │ HTTPS/REST API
           ▼
┌─────────────────────┐
│   Express.js API    │
│   (Node.js Server)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   MongoDB Database  │
│   (Data Storage)    │
└─────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Atlas account)
- **Expo CLI**: `npm install -g expo-cli`
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/livestock360.git
cd livestock360
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - MongoDB connection string
# - Firebase credentials (if using Firebase Auth)
# - JWT secret (if using custom auth)

# Start the server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

#### 3. Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# OR press 'a' for Android emulator
# OR press 'i' for iOS simulator
```

### Environment Variables

#### Backend `.env`
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/livestock360
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/livestock360

# Authentication (choose one)
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# OR JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Mobile App Configuration
Update `app.json` or create `firebase-config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Animals**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/animals` | Create new animal |
| GET | `/animals` | Get all animals (with filters) |
| GET | `/animals/:id` | Get animal by ID |
| PUT | `/animals/:id` | Update animal |
| DELETE | `/animals/:id` | Delete animal |
| GET | `/animals/stats` | Get animal statistics |

#### **Health Records**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/health-records` | Create health record |
| GET | `/health-records` | Get all health records |
| GET | `/health-records/:animalId` | Get records for animal |
| GET | `/health-records/upcoming` | Get upcoming vaccinations |
| PUT | `/health-records/:id` | Update health record |
| DELETE | `/health-records/:id` | Delete health record |

#### **Dashboard**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Get dashboard data |

### Example Request
```bash
# Create an animal
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tagNumber": "COW-127",
    "name": "Bella",
    "type": "Cow",
    "breed": "Holstein",
    "gender": "Female",
    "birthDate": "2021-05-15",
    "weight": 450
  }'
```

### Example Response
```json
{
  "success": true,
  "message": "Animal added successfully",
  "data": {
    "animal": {
      "_id": "507f1f77bcf86cd799439011",
      "tagNumber": "COW-127",
      "name": "Bella",
      "type": "Cow",
      "breed": "Holstein",
      "gender": "Female",
      "birthDate": "2021-05-15T00:00:00.000Z",
      "weight": 450,
      "status": "Healthy",
      "createdAt": "2024-12-28T10:30:00.000Z"
    }
  }
}
```

## 🗄️ Database Schema

### Animal Model
```javascript
{
  userId: ObjectId,          // Reference to user
  tagNumber: String,         // Unique identifier
  name: String,              // Animal name (optional)
  type: String,              // Cow, Buffalo, Goat, Sheep, etc.
  breed: String,             // Breed information
  gender: String,            // Male, Female
  birthDate: Date,           // Date of birth
  weight: Number,            // Weight in kg
  photo: String,             // Photo URL/path
  status: String,            // Healthy, Attention, Critical, Unknown
  notes: String,             // Additional notes
  lastCheckupDate: Date,     // Last health checkup
  timestamps: true           // createdAt, updatedAt
}
```

### Health Record Model
```javascript
{
  animalId: ObjectId,        // Reference to animal
  userId: ObjectId,          // Reference to user
  type: String,              // Vaccination, Treatment, Checkup, etc.
  title: String,             // Record title
  description: String,       // Detailed description
  date: Date,                // Date of record
  nextDueDate: Date,         // Next scheduled date
  veterinarian: String,      // Vet name
  cost: Number,              // Cost of treatment
  medicine: String,          // Medicine name
  dosage: String,            // Dosage information
  photo: String,             // Receipt/document photo
  status: String,            // Completed, Scheduled, Overdue
  timestamps: true           // createdAt, updatedAt
}
```

## 🎨 Design System

### Color Palette
```javascript
{
  primary: '#059669',        // Fresh Green
  secondary: '#F97316',      // Alert Orange
  success: '#10B981',        // Success Green
  warning: '#FBBF24',        // Warning Yellow
  error: '#EF4444',          // Error Red
  background: '#FFFFFF',     // Clean White
  surface: '#F3F4F6',        // Light Gray
  text: '#1F2937',           // Dark Gray
}
```

### Typography
- Headers: Bold, 20-24px
- Body: Regular, 16px
- Buttons: Bold, 18px

### Component Guidelines
- Minimum touch target: 48x48dp
- Border radius: 12px
- Card elevation: 2-3
- Button height: 56px

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Mobile App Tests
```bash
cd mobile
npm test
```

### Manual Testing
Use Postman collection provided in `/postman` directory:
```bash
# Import collection
postman/Livestock360_API.postman_collection.json
```

## 📦 Deployment

### Backend Deployment

**Option 1: Heroku**
```bash
heroku create livestock360-api
heroku addons:create mongolab
git push heroku main
```

**Option 2: Railway**
```bash
railway login
railway init
railway up
```

**Option 3: DigitalOcean / AWS / Azure**
- Setup Node.js server
- Configure MongoDB Atlas
- Setup PM2 for process management
- Configure Nginx as reverse proxy
- Setup SSL certificate

### Mobile App Deployment

**Android (Google Play Store)**
```bash
expo build:android
# Follow Expo's guide for Play Store submission
```

**iOS (Apple App Store)**
```bash
expo build:ios
# Follow Expo's guide for App Store submission
```

## 🛣️ Roadmap

### Phase 1 (Current) ✅
- [x] Animal profile management
- [x] Health record tracking
- [x] Vaccination reminders
- [x] Dashboard analytics
- [x] Local notifications

### Phase 2 (Planned) 🚧
- [ ] Data export (PDF/CSV)
- [ ] WhatsApp integration for reminders
- [ ] Multi-language support (Urdu, Punjabi)
- [ ] Offline mode with data sync
- [ ] Batch operations
- [ ] Advanced analytics and charts

### Phase 3 (Future) 💡
- [ ] AI-based health predictions
- [ ] Marketplace integration
- [ ] Community features
- [ ] Veterinarian collaboration tools
- [ ] IoT device integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Backend powered by [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Authentication: [Firebase](https://firebase.google.com/)
- Icons: [Lucide Icons](https://lucide.dev/)

## 📸 Screenshots

### Mobile App
| Home Screen | Animal List | Add Animal | Health Records |
|-------------|-------------|------------|----------------|
| ![Home](screenshots/home.png) | ![List](screenshots/list.png) | ![Add](screenshots/add.png) | ![Health](screenshots/health.png) |

### Features Showcase
| Dashboard | Notifications | Animal Detail | Calendar |
|-----------|---------------|---------------|----------|
| ![Dashboard](screenshots/dashboard.png) | ![Notifications](screenshots/notifications.png) | ![Detail](screenshots/detail.png) | ![Calendar](screenshots/calendar.png) |

## 📞 Support

For support, email anasiftikhar07@gmail.com or open an issue in this repository.

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ for farmers worldwide**
