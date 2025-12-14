# Design Guidelines: Internship Preparation Tracker

## Design Approach

**Selected Approach:** Design System + Reference-Based Hybrid

**Primary References:**
- Linear (clean dashboard aesthetics, modern typography)
- Material Design (data-dense components, tables)
- Stripe Dashboard (minimalist, functional clarity)

**Rationale:** This is a utility-focused productivity tool requiring efficient data display, clear hierarchy, and consistent patterns for daily use across multiple feature-dense sections.

## Core Design Principles

1. **Data Clarity First** - Information must be scannable and actionable
2. **Profile Context Awareness** - Clear visual indication of active profile
3. **Compact Information Density** - Maximize screen real estate without clutter
4. **Consistent Patterns** - Repeated UI elements for faster learning

## Typography System

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - for UI, data, and body text
- Accent: 'JetBrains Mono' (Google Fonts) - for numeric data, stats, counts

**Hierarchy:**
- Page Title: 2xl, semibold (profile name, section headers)
- Card Headers: lg, semibold
- Subheadings: base, medium
- Body/Data: sm, regular
- Labels: xs, medium, uppercase with letter-spacing
- Numeric Stats: xl-3xl, bold (in accent font)

## Layout System

**Tailwind Spacing Primitives:** Consistent use of 2, 4, 6, 8, 12, 16 units
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: space-y-4
- Margins: m-4, m-6, m-8

**Dashboard Grid:**
- Max container width: max-w-7xl mx-auto
- Main content padding: px-4 md:px-6 lg:px-8
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for cards
- Full-width tables: w-full with horizontal scroll on mobile

## Component Library

### 1. Profile Toggle (Top Navigation)
**Structure:**
- Fixed top bar with container max-w-7xl
- Toggle switch component (left): Pill-style segmented control
- Profile indicator (right): Active profile name with small avatar/initials badge
- Height: h-16
- Backdrop blur for subtle depth

### 2. Dashboard Cards
**Standard Card Pattern:**
- Rounded corners: rounded-lg
- Border: border with subtle treatment
- Padding: p-6
- Header section with title + optional action button
- Content area with appropriate spacing
- Footer for summary stats (when applicable)

**Card Types:**
- **Stat Cards:** Large numeric display with label and trend indicator
- **List Cards:** Compact rows with hover states
- **Form Cards:** Input groups with clear labels
- **Progress Cards:** Visual progress bars with percentages

### 3. TODO List Component
**Layout:**
- Sticky card near top of dashboard
- Compact list items: py-2 px-3
- Checkbox (left) + text (center) + delete icon (right)
- Add button at bottom: full-width, subtle
- Max height with scroll: max-h-96 overflow-y-auto

### 4. Habit Tracker (10-Day Grid)
**Grid Structure:**
- Table layout: sticky header row with dates
- First column: Habit names (editable inline)
- Remaining 10 columns: Date headers + checkboxes
- Final column: Streak count + completion %
- Responsive: horizontal scroll on mobile, keep habit names sticky

**Visual Treatment:**
- Compact cells: p-2
- Checkbox centered in each cell
- Striped rows for readability
- Highlight current day column

### 5. Daily Logs
**Form Interface:**
- Date picker at top
- Numeric input fields with +/- steppers
- Large text area for notes (optional)
- Save button: prominent, right-aligned
- Past entries: Collapsible list below form showing last 7-14 days

**Summary Display:**
- Weekly summary card: Total count + average per day
- All-time total: Large stat display
- Mini chart/sparkline showing 7-day trend (optional)

### 6. Contest Schedule (Piyush)
**Static Display:**
- List-style layout, not table
- Each contest: Platform icon/logo + name + day + time
- Grouped by platform
- Subtle separators between items
- Compact spacing: py-3

### 7. Rating Tracker (Piyush)
**Display:**
- 3-column grid on desktop, stack on mobile
- Each platform: Platform name + editable numeric field + edit icon
- Last updated timestamp below each rating

### 8. Contest Performance Log
**Table Design:**
- Sortable columns: Platform, Name, Date, Solved
- Problems solved: "X / Y" format in accent font
- Notes column: Truncated with expand on hover/click
- Add entry button: floating action button style (bottom-right) or top-right of card

### 9. Progress Trackers (A2Z Striver, Blind 75)
**A2Z Sheet:**
- 3 rows (Easy/Medium/Hard)
- Columns: Difficulty | Total (editable) | Solved (editable) | Progress Bar | Percentage
- Overall progress: Large stat card above table
- Progress bars: Full-width, segmented by difficulty

**Blind 75:**
- Simple list view with checkboxes
- Question name + solution link field
- Compact rows: py-2
- Search/filter at top

### 10. Resume Builder
**Section Layout:**
- Tab/accordion interface for Work/Skills/Projects/Achievements
- Rich text editing areas (or structured forms)
- Add/remove item buttons for list sections
- Preview mode toggle (optional)

### 11. Courses Tracker
**Card Grid:**
- 2-column grid on desktop
- Each course card: Name + Platform + Progress circle + Edit action
- Progress circle: Circular progress indicator (auto-calculated)
- Total/Completed shown inside circle or below

### 12. Certificates Upload
**Upload Interface:**
- Drag-and-drop zone: dashed border, centered icon + text
- File list below: Thumbnail (if image) + Title + Issuer + Date + Delete
- Compact list view: space-y-2

### 13. Shruti-Specific Sections
**Projects/Case Studies/Guesstimates/Competitions:**
- Consistent card pattern across all
- Each entry: Title/Name (large) + Description/Notes (text area) + Date + Action buttons
- List view with add button at top
- Search/filter for longer lists

## Navigation Structure

**Sidebar/Top Navigation:**
- Profile toggle always visible at top
- Section navigation: Vertical sidebar (desktop) or collapsible menu (mobile)
- Grouped by category:
  - **Global:** TODO, Habits, Daily Logs
  - **Piyush:** CP Dashboard, Ratings, Contests, DSA Progress, Resume, Courses, Certificates
  - **Shruti:** Case Studies, Guesstimates, Competitions, Certificates, Skills, Projects, Courses

**Active State:** Bold text + subtle indicator bar

## Forms & Inputs

**Input Fields:**
- Consistent height: h-10
- Clear labels above or inline
- Rounded corners: rounded-md
- Focus states: ring treatment
- Error states: Red border + error message below

**Buttons:**
- Primary: Solid fill, rounded-md, px-4 py-2
- Secondary: Outlined, same sizing
- Icon buttons: Square, p-2, icon-only for actions

**Icons:** Heroicons (CDN) for all interface icons

## Responsive Behavior

**Breakpoints:**
- Mobile: Single column layouts, stack all grids
- Tablet (md): 2-column grids, sidebar becomes top menu
- Desktop (lg): 3-column grids where appropriate, permanent sidebar

**Mobile Optimizations:**
- Sticky profile toggle
- Collapsible sections with expand/collapse
- Horizontal scroll for wide tables (with scroll indicators)
- Bottom sheet modals for forms

## Images

**No hero images required** - This is a functional dashboard application focused on data display and utility rather than visual marketing. All interface elements should be UI components, icons, and data visualizations.