# Dual-Purpose Website Structure

## Overview
The website now serves both **The Serenity Spa** (Makerere, Kampala) and **The Marina Stays** (Entebbe) in a unified platform.

## Site Structure

### Homepage (/)
- **DualHero Component**: Alternates between spa and hotel content every 5 seconds
- Features smooth transitions with:
  - Float-in animations for logos
  - Typewriter effect for business names
  - Fade-in/out transitions for all content
  - Dynamic background gradients (cyan for spa, brown for hotel)
- Two CTA buttons on each view:
  - Primary: "Book Spa Service" or "Book Your Stay"
  - Secondary: Link to the other business

### Spa Section (/spa/*)
**Routes:**
- `/spa` - Main spa page with all services, price list, gallery, and contact
- `/spa/services` - Detailed services page
- `/spa/gallery` - Photo gallery
- `/spa/branches` - Branch locations (Makerere)
- `/spa/booking` - Spa appointment booking

**Branding:**
- Logo: Circular spa logo
- Colors: Cyan/Teal (#00BCD4, #009688)
- Tagline: "Your Oasis of Relaxation"

### Hotel Section (/hotel/*)
**Routes:**
- `/hotel` - Main hotel page with rooms, amenities, and contact
- `/hotel/booking` - Hotel room booking

**Branding:**
- Logo: Marina Stays sailboat logo
- Colors: Warm brown/maroon (#8B4513, #654321)
- Tagline: "Entebbe's Premier Residences"

**Features:**
- 3 Room types: Deluxe, Executive Suite, Presidential Suite
- 6 Amenities showcased: Pool, Restaurant, Gym, Parking, WiFi, Concierge
- Contact information specific to Entebbe location

### Navigation
**Dynamic Navbar:**
- Changes logo and branding based on current section
- Shows contextual navigation links:
  - **Homepage**: Home, Spa, Hotel
  - **Spa Section**: Home, Spa, Services, Gallery, Book Service, Hotel
  - **Hotel Section**: Home, Hotel, Rooms, Book Stay, Spa
- Sidebar circular text changes:
  - Spa: "oasis of relaxation"
  - Hotel: "premier residences"

### Booking System
**Separation Strategy:**
- Each booking form includes `businessType` prop ('spa' or 'hotel')
- Payment references use prefixes:
  - Spa: `SPA-{timestamp}`
  - Hotel: `HTL-{timestamp}`
- Backend will store bookings separately to prevent collisions

## Key Features

### Animations
1. **Float-in**: Logo entrance animation
2. **Typewriter**: Business name typing effect
3. **Fade transitions**: Smooth content changes
4. **Hover effects**: Interactive buttons and cards

### Responsive Design
- Mobile-friendly sidebar navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactive elements

### Cross-Promotion
- Easy navigation between spa and hotel
- Unified footer crediting both businesses
- Seamless brand experience

## Next Steps
1. ✅ Dual homepage with alternating content
2. ✅ Separate spa and hotel pages
3. ✅ Dynamic navigation system
4. ⏳ Update booking system to handle both business types
5. ⏳ Add hotel-specific images and content
6. ⏳ Configure separate payment tracking

## File Structure
```
src/
├── components/
│   ├── DualHero.jsx          # Alternating homepage
│   ├── SpaPage.jsx           # Spa main page
│   ├── HotelPage.jsx         # Hotel main page
│   ├── Navbar.jsx            # Dynamic navigation
│   ├── Booking.jsx           # Booking form (needs update)
│   └── [other components]
├── App.jsx                   # Route configuration
└── index.css                 # Global styles

public/
└── assets/
    ├── logo.jpg              # Spa logo
    └── hotel-logo.png        # Hotel logo
```

## Testing
Visit http://localhost:5173/ to see:
1. Homepage alternating between spa and hotel every 5 seconds
2. Click "Book Spa Service" to go to spa section
3. Click "Book Your Stay" to go to hotel section
4. Notice navbar changes based on section
5. Test navigation between sections
