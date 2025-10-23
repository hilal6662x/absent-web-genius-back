# Design Guidelines: Web Attendance System

## Design Approach: Hybrid - Linear/Notion-Inspired Utility Design

**Rationale:** This is a productivity/utility-focused application requiring clean, efficient interfaces for daily check-ins. Drawing inspiration from Linear's precision and Notion's approachable functionality, with emphasis on status clarity and quick actions.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 240 5% 96% (soft gray)
- Border: 240 6% 90%
- Text Primary: 240 10% 10%
- Text Secondary: 240 5% 45%
- Primary: 215 90% 55% (professional blue)
- Success: 145 70% 45% (check-in green)
- Warning: 25 95% 55% (check-out amber)

**Dark Mode:**
- Background: 240 10% 8%
- Surface: 240 8% 12%
- Border: 240 6% 20%
- Text Primary: 240 5% 96%
- Text Secondary: 240 5% 65%
- Primary: 215 85% 60%
- Success: 145 65% 50%
- Warning: 25 90% 60%

### B. Typography

- **Headings:** Inter (600-700 weight)
  - H1: 2.25rem (36px) - Dashboard titles
  - H2: 1.5rem (24px) - Section headers
  - H3: 1.125rem (18px) - Card titles
- **Body:** Inter (400-500 weight)
  - Base: 0.875rem (14px)
  - Large: 1rem (16px) - Primary content
  - Small: 0.75rem (12px) - Timestamps, labels

### C. Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 exclusively
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Element gaps: gap-4 to gap-6
- Max container width: max-w-6xl for main content

### D. Component Library

**Authentication Pages (Login/Register):**
- Centered card layout (max-w-md)
- Split-screen option: Left side brand/image, right side form
- Floating label inputs with subtle animations
- Primary CTA button (full-width)
- Link to alternate auth action below

**Dashboard:**
- Sidebar navigation (collapsed on mobile)
- Top bar: User profile, current date/time, status indicator
- Main content area: Current status card + attendance history
- Quick action floating button (mobile)

**Status Card (Hero Component):**
- Large card with current check-in status
- Prominent check-in/check-out button
- Last action timestamp
- Current session duration (if checked in)
- Visual status indicator (colored dot or badge)

**Attendance History:**
- Table view (desktop) with columns: Date, Check-in, Check-out, Duration, Status
- Card list (mobile) - each entry as compact card
- Pagination or infinite scroll
- Date range filter
- Export functionality (subtle button)

**Navigation:**
- Fixed sidebar (desktop): Logo, Dashboard, History, Profile, Logout
- Bottom tab bar (mobile): Dashboard, History, Profile
- Breadcrumb for context (desktop only)

**Forms & Inputs:**
- Clean, minimal borders
- Focus state: primary color ring
- Error states: red-500 with message below
- Labels: Small, uppercase, text-secondary
- Input backgrounds match surface color in dark mode

### E. Unique Design Elements

**Status Visualization:**
- Checked-in: Green pulse animation on status dot
- Checked-out: Neutral gray indicator
- Session timer: Live updating duration display

**Quick Actions:**
- Large, single-purpose button for check-in/check-out
- Confirmation modal for check-out actions
- Success toast notifications after actions

**Data Display:**
- Weekly summary cards showing total hours
- Month-to-date statistics
- Visual calendar heatmap (optional enhancement)

---

## Page Specifications

### Login/Register Pages
- Clean, centered form (400px max-width)
- Subtle gradient background (primary color, 5% opacity)
- Minimal branding (logo + tagline)
- Toggle between login/register views
- "Remember me" checkbox for login

### Dashboard
- Two-column layout (desktop): Main content (66%) + Stats sidebar (33%)
- Current status prominently displayed
- Recent attendance entries (last 7 days)
- Weekly hours summary card
- Quick access to check-in/out

### Attendance History
- Filterable table/list
- Date range picker
- Search by date
- Monthly grouping with subtotals
- Empty state with illustration if no data

---

## Images

**Not Required** - This is a utility application where functionality takes precedence. Use:
- Iconography for status indicators and actions (Heroicons)
- Minimal decorative elements
- Focus on data clarity and interaction efficiency

---

## Interaction Patterns

- Instant feedback on all actions (loading states, success confirmations)
- Toast notifications for check-in/check-out confirmation
- Smooth transitions between states (200-300ms)
- Hover states: subtle background color change
- Disabled states: 50% opacity
- Loading states: Spinner or skeleton screens, never blocking UI

**Mobile Considerations:**
- Touch-friendly button sizes (min 44px)
- Swipe-to-refresh on attendance list
- Bottom sheet modals instead of centered
- Sticky headers for context

---

## Accessibility & Quality

- High contrast ratios (WCAG AA minimum)
- Keyboard navigation throughout
- Screen reader labels on all interactive elements
- Focus indicators on all focusable elements
- Consistent dark mode across all surfaces including inputs
- Error messages clear and actionable