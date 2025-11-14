# SkyFly Component Library & Design System

## 🎨 Design System Overview

### Color Palette
```jsx
// Primary Colors (Sky Blue)
from-primary-50 to primary-900
primary-600: #0ea5e9 (main)

// Secondary Colors (Purple)
from-secondary-50 to secondary-900
secondary-600: #8b5cf6 (accent)

// Accent Colors (Red)
from-accent-50 to accent-900
accent-600: #ef4444 (alerts/errors)
```

### Spacing System
- **xs**: 0.25rem (1px)
- **sm**: 0.5rem (2px)
- **md**: 1rem (4px)
- **lg**: 1.5rem (6px)
- **xl**: 2rem (8px)
- **2xl**: 3rem (12px)

### Typography Scale
- **h1**: 2.25rem (36px), font-bold
- **h2**: 1.875rem (30px), font-bold
- **h3**: 1.5rem (24px), font-semibold
- **body-lg**: 1.125rem (18px), font-medium
- **body**: 1rem (16px), font-normal
- **body-sm**: 0.875rem (14px), font-normal
- **caption**: 0.75rem (12px), font-medium

### Shadows
- **soft**: `0 2px 8px rgba(0, 0, 0, 0.08)` - subtle backgrounds
- **medium**: `0 4px 16px rgba(0, 0, 0, 0.1)` - cards, dropdowns
- **large**: `0 8px 32px rgba(0, 0, 0, 0.12)` - modals, prominent elements
- **xl**: `0 20px 40px rgba(0, 0, 0, 0.15)` - hero sections

### Border Radius
- **sm**: 0.5rem (8px) - slight rounding
- **md**: 0.75rem (12px) - input fields
- **lg**: 1rem (16px) - cards
- **xl**: 1.5rem (24px) - large cards
- **full**: 9999px - pills, circles

### Animations
- **fade-in**: opacity 0 → 1 (0.3s, ease-in)
- **slide-up**: translateY(10px) → 0 (0.4s, ease-out)
- **bounce-slow**: translateY(±5px) (2s, infinite)

---

## 🧩 Reusable Components

### 1. Primary Button
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-medium hover:shadow-large transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
  Button Text
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</button>
```

### 2. Secondary Button
```jsx
<button className="px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200">
  Button Text
</button>
```

### 3. Outline Button
```jsx
<button className="px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-colors">
  Button Text
</button>
```

### 4. Input Field
```jsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Label Text
  </label>
  <div className="relative">
    <input
      type="text"
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
      placeholder="Placeholder"
    />
    <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
    </svg>
  </div>
</div>
```

### 5. Card Component
```jsx
<div className="bg-white rounded-2xl shadow-medium border border-white/50 p-6 hover:shadow-large transition-shadow">
  {/* Card content */}
</div>
```

### 6. Badge/Chip
```jsx
// Success Badge
<span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
  Confirmed
</span>

// Danger Badge
<span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
  Cancelled
</span>

// Info Badge
<span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
  Pending
</span>
```

### 7. Alert/Error Message
```jsx
<div className="p-4 bg-accent-50 border border-accent-200 rounded-xl flex items-start gap-3">
  <svg className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
  <div>
    <h3 className="font-semibold text-accent-900">Error Title</h3>
    <p className="text-sm text-accent-800 mt-1">Error description</p>
  </div>
</div>
```

### 8. Success Message
```jsx
<div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
  <span className="text-sm font-medium text-green-800">Success message</span>
</div>
```

### 9. Modal Dialog
```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Modal Title</h2>
      {/* Modal content */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
          Cancel
        </button>
        <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
          Confirm
        </button>
      </div>
    </div>
  </div>
</div>
```

### 10. Loading Spinner
```jsx
<svg className="animate-spin h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

### 11. Form Field with Validation
```jsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Email Address
    <span className="text-accent-600">*</span>
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-primary-500 rounded-xl focus:outline-none transition-all"
    placeholder="user@example.com"
  />
  <p className="text-xs text-accent-600">Email is invalid</p>
</div>
```

### 12. Filter/Search Section
```jsx
<div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
  <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
  <div className="space-y-4">
    {/* Filter options */}
  </div>
</div>
```

---

## 📄 Page Templates

### Flight Search Page
**Structure:**
- Top search bar with date, location inputs
- Left sidebar with filters (price, stops, airlines, times)
- Main content with flight cards
- Sorting options (price, duration, etc.)

**Key Elements:**
- Flight cards showing: airline logo, departure/arrival times, price, stops, duration
- Status badges (on-time, delayed, cancelled)
- Quick view / book button on hover

### Flight Details Page
**Structure:**
- Flight information header (route, date)
- Flight details section (airline, aircraft, duration)
- Seat selection interactive map
- Passenger information form
- Price breakdown summary
- Payment section

### MyBookings Page
**Structure:**
- Booking cards with status
- Expandable details
- Quick actions (view, modify, cancel)
- Download ticket option
- Empty state for no bookings

### Profile Page
**Structure:**
- Avatar upload area
- Personal information form
- Contact information section
- Change password section
- Account settings

### Admin Dashboard
**Structure:**
- Top stats cards (total bookings, revenue, users)
- Charts section (bookings over time, revenue)
- Data tables (flights, bookings, users)
- Quick actions sidebar

---

## 🎯 Implementation Checklist

### High Priority (Core UX)
- [x] Login page
- [x] Register page
- [x] Navbar
- [ ] Flight search page
- [ ] Flight details page

### Medium Priority (User Features)
- [ ] MyBookings page
- [ ] Profile page
- [ ] Payment page

### Lower Priority (Admin)
- [ ] Admin dashboard
- [ ] Admin tables
- [ ] Analytics page

---

## 💡 Best Practices

1. **Consistency**: Always use the design system colors, spacing, and typography
2. **Accessibility**: 
   - Use semantic HTML
   - Include ARIA labels
   - Ensure color contrast meets WCAG standards
   - Make interactive elements keyboard accessible
3. **Performance**:
   - Use CSS animations instead of JS animations
   - Optimize images
   - Lazy load components
4. **Responsiveness**:
   - Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
   - Test on mobile, tablet, desktop
   - Use mobile-first approach
5. **User Feedback**:
   - Show loading states
   - Provide success/error messages
   - Animate transitions smoothly
   - Give visual feedback on interactions

---

## 🚀 Quick Start for New Components

1. Copy relevant component from the component library
2. Customize colors (primary/secondary/accent)
3. Adjust spacing and sizing as needed
4. Add required icons from Heroicons
5. Test on different screen sizes
6. Ensure keyboard navigation works
7. Add loading/error states

---

## 📱 Responsive Design Pattern

```jsx
// Example: Responsive layout
<div className="
  grid 
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
  gap-4 md:gap-6
  px-4 md:px-8
">
  {/* Content */}
</div>
```

All components should be tested on:
- Mobile (320px - 640px)
- Tablet (641px - 1024px)
- Desktop (1025px+)
