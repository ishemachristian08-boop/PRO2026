# NYABIHU CHRISTIAN ACADEMY (NCA) Website

A comprehensive, modern website for Nyabihu Christian Academy, built with Next.js and Node.js.

## Project Overview

**Motto:** "Generate a Child, Transform Generation"

**Location:** Nyabihu District, Rwanda  
**Type:** Christian-based Private School  
**Levels:** Nursery and Primary (P1–P6)

## Features

### 🏠 Homepage
- Hero section with school branding
- About section with mission, vision, and values
- Academics overview
- Why choose NCA section
- Admissions information
- News & events preview
- Testimonials
- Call-to-action sections

### 📚 Additional Pages
- **About Us** - School history and philosophy
- **Academics** - Nursery and Primary programs, CBC curriculum
- **Admissions** - Application process and requirements
- **Gallery** - Photo albums and school memories
- **News & Events** - Announcements and upcoming events
- **Contact Us** - Contact form and location
- **Student Portal** - Secure login for students
- **Staff Portal** - Secure login for teachers and administrators

### 👥 Admin Dashboard
- Student management
- Teacher management
- Announcement management
- Event management
- Gallery management
- System settings
- Reports and analytics

## Technical Stack

### Frontend
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React Context API
- **Animations:** Framer Motion
- **Icons:** Heroicons
- **Form Handling:** React Hook Form
- **HTTP Client:** Custom API client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcrypt
- **Validation:** Express Validator
- **File Upload:** Multer
- **Security:** Helmet, CORS, Rate Limiting

### Database Models
- **User** - Admin, teachers, and parents
- **Student** - Student records and academic progress
- **Announcement** - School announcements and news
- **Event** - School events and activities
- **Gallery** - Photo galleries and albums

## Project Structure

```
nca-website/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication and validation
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities and API client
│   ├── public/          # Static assets
│   ├── styles/          # Global styles
│   ├── package.json
│   └── README.md
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd nca-website/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nca
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd nca-website/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/parent/:parentId` - Get students by parent
- `POST /api/students/:id/academic` - Add academic record
- `POST /api/students/:id/attendance` - Add attendance record

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/active` - Get active announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement
- `PUT /api/announcements/:id/publish` - Publish announcement

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event

### Gallery
- `GET /api/gallery` - Get all galleries
- `GET /api/gallery/public` - Get public galleries
- `POST /api/gallery` - Create gallery
- `PUT /api/gallery/:id` - Update gallery
- `DELETE /api/gallery/:id` - Delete gallery
- `POST /api/gallery/:id/images` - Add images to gallery

## Styling and Design

### Color Scheme
- **Primary Blue:** `#0052cc`
- **Gold:** `#ffb800`
- **White:** `#ffffff`
- **Grays:** Various shades for text and backgrounds

### Typography
- **Headings:** Montserrat (Bold)
- **Body:** Poppins (Regular)
- **Fallback:** System fonts

### Responsive Design
- Mobile-first approach
- Responsive grid system
- Touch-friendly interactions
- Optimized for all screen sizes

## Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers
- Role-based access control

## Development Guidelines

### Code Style
- Use semantic HTML
- Follow component-based architecture
- Maintain consistent naming conventions
- Write accessible code
- Use TypeScript for type safety (optional)

### Git Workflow
- Use feature branches
- Write descriptive commit messages
- Create pull requests for code review
- Follow conventional commit standards

### Testing
- Unit tests for API endpoints
- Integration tests for critical flows
- E2E tests for user journeys
- Manual testing for UI/UX

## Deployment

### Backend Deployment
1. Set up a MongoDB instance (Atlas recommended)
2. Configure environment variables
3. Deploy to a cloud platform (Heroku, AWS, etc.)
4. Set up SSL/HTTPS
5. Configure domain and DNS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables
4. Set up custom domain
5. Enable SSL/HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: info@nca.rw
- Phone: +250 788 000 000
- Website: [www.nca.rw](http://www.nca.rw)

## Acknowledgments

- Thanks to the NCA community for their support
- Open source libraries and frameworks used
- Educational standards and guidelines followed

---

**Note:** This is a comprehensive school management website designed to meet the needs of modern educational institutions while maintaining a strong Christian foundation.