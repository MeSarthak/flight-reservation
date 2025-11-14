# SkyFly - Visual Improvements Guide

This document outlines the comprehensive visual polish being applied to the Flight Reservation System.

## Color Scheme
- **Primary**: Sky Blue (`#0ea5e9` to `#075985`)
- **Secondary**: Purple (`#8b5cf6` to `#4c1d95`)  
- **Accent**: Red (`#ef4444` to `#7f1d1d`)
- **Neutral**: Gray (`#f9fafb` to `#111827`)

## Key Styling Features

### Typography
- Font: Inter, system-ui, sans-serif
- Headings: Bold weights (600-700)
- Body: Regular (400-500)

### Spacing & Shadows
- Soft shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Medium shadow: `0 4px 16px rgba(0, 0, 0, 0.1)`
- Large shadow: `0 8px 32px rgba(0, 0, 0, 0.12)`

### Animations
- Fade In: 0.3s ease-in
- Slide Up: 0.4s ease-out
- Bounce: 2s infinite

### Border Radius
- Small: 0.75rem (xl)
- Medium: 1rem (2xl)
- Large: 1.5rem (3xl)

## Pages to Update

### 1. Auth Pages (Login/Register)
✅ DONE:
- Modern card design with gradient headers
- Smooth animations and transitions
- Icon inputs with visual feedback
- Show/hide password toggle
- Remember me checkbox
- Gradient buttons with hover effects

TODO:
- Finalize Register page with same design system
- Add form validation indicators
- Success/error animations

### 2. Navigation/Navbar
TODO:
- Brand logo with SkyFly branding
- Main navigation links
- User profile dropdown menu
- Responsive mobile menu
- Search functionality
- Dark mode toggle

### 3. Flight Search Page
TODO:
- Advanced filter sidebar (date, price, airlines, stops)
- Flight cards with airline logo, times, price, amenities
- Sort options (price, duration, departure time)
- Loading skeleton states
- No results empty state with illustration

### 4. Flight Details & Seat Selection
TODO:
- Interactive seat map with visual feedback
- Passenger information form with validation
- Price breakdown summary
- Booking confirmation modal
- Payment method selection

### 5. MyBookings Page
TODO:
- Booking cards with status badge
- Quick actions (view details, cancel, modify)
- Booking details modal/expansion
- Download ticket feature
- Empty state for no bookings

### 6. Profile Page
TODO:
- Avatar upload with preview
- Form sections (Personal Info, Contact, Security)
- Edit mode with save/cancel
- Password change section
- Account settings

### 7. Admin Dashboard
TODO:
- Dashboard cards with stats (total bookings, revenue, passengers)
- Data tables with sorting, filtering, pagination
- Form modals for create/edit operations
- Charts for analytics
- Responsive admin layout

## Component Library

### Buttons
```jsx
// Primary Button
<button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-medium hover:shadow-large transform hover:scale-105 active:scale-95 transition-all duration-200">
  Button Label
</button>

// Secondary Button
<button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200">
  Button Label
</button>
```

### Input Fields
```jsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">Label</label>
  <input
    type="text"
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
    placeholder="Placeholder"
  />
</div>
```

### Cards
```jsx
<div className="bg-white rounded-2xl shadow-medium border border-white/50 p-6">
  {/* Card content */}
</div>
```

### Badges
```jsx
<span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
  Badge
</span>
```

## Implementation Priority

1. **High Priority** (Core UX):
   - [ ] Auth pages (Login/Register)
   - [ ] Navbar
   - [ ] Flight search

2. **Medium Priority** (User Features):
   - [ ] Flight details & seat selection
   - [ ] MyBookings
   - [ ] Profile

3. **Lower Priority** (Admin):
   - [ ] Admin dashboard
   - [ ] Admin tables

## Design Principles

1. **Consistency**: Use defined color palette, spacing, and typography throughout
2. **Clarity**: Clear hierarchy, readable text, obvious CTAs
3. **Feedback**: Visual feedback for all interactions (hover, active, disabled states)
4. **Performance**: Use CSS animations instead of JS where possible
5. **Accessibility**: Proper contrast ratios, ARIA labels, keyboard navigation
6. **Responsiveness**: Mobile-first design that works on all screen sizes

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Tailwind Configuration
Extended config includes:
- Custom color palette (primary, secondary, accent)
- Custom shadows (soft, medium, large, xl)
- Custom animations (fade-in, slide-up)
- Custom spacing and border-radius

## Next Steps
1. Complete Login page styling ✓
2. Create Register page with same design
3. Build modern navbar component
4. Design flight search interface
5. Polish booking flow
6. Update admin dashboard
7. Test responsiveness across devices
8. Performance optimization
