# Digital Twin Sustainability Platform - Mobile App Design

## Design Philosophy

The Digital Twin Sustainability Platform mobile app embodies professional sustainability consulting aesthetics combined with cutting-edge technology visualization. The design assumes **mobile portrait orientation (9:16)** and **one-handed usage** patterns, following **Apple Human Interface Guidelines (HIG)** to feel exactly like a first-party iOS app aligned with mainstream iOS mobile app design standards.

## Color Palette

The app employs a **dark theme** optimized for professional use and extended viewing sessions, with emerald and teal accents that reinforce the sustainability and technology focus.

**Primary Colors:**
- Background: `#1A1A1A` (Deep charcoal - primary screen background)
- Surface: `#2A2A2A` (Elevated charcoal - cards and elevated surfaces)
- Foreground: `#FFFFFF` (White - primary text)
- Muted: `#E0E0E0` (Light gray - secondary text)

**Accent Colors:**
- Primary: `#00C896` (Emerald - sustainability actions, success states)
- Secondary: `#007ACC` (Teal - technology features, information)
- Border: `#3A3A3A` (Subtle borders and dividers)

**Status Colors:**
- Success: `#00C896` (Emerald - carbon reduction achieved)
- Warning: `#FFA500` (Orange - attention needed)
- Error: `#FF4444` (Red - critical issues)

## Typography

**Font Family:** SF Pro (iOS system font) / Inter (fallback)

**Type Scale:**
- Headline Large: 34px, Bold - Screen titles
- Headline Medium: 28px, Bold - Section headers
- Title: 22px, Semibold - Card titles
- Body Large: 17px, Regular - Primary content
- Body: 15px, Regular - Secondary content
- Caption: 13px, Regular - Metadata and labels
- Small: 11px, Regular - Fine print

## Screen List and Layout

### 1. Onboarding Flow (First Launch)

**Screen 1.1: Welcome**
- Full-screen hero image showing digital twin visualization
- App logo and tagline
- "Get Started" primary button
- "Sign In" text link for returning users

**Screen 1.2: Feature Introduction (Swipeable Carousel)**
- Slide 1: Digital Twin Creation - Upload building sketches, automated 3D conversion
- Slide 2: Simulation Engine - Test sustainability scenarios before investment
- Slide 3: AI Forecasting - Predictive analytics for carbon and cost
- Slide 4: Blockchain Tracking - Transparent supply chain emissions
- Progress indicators (dots)
- "Next" / "Skip" / "Get Started" buttons

**Screen 1.3: Company Profile Setup**
- Company name input
- Industry sector dropdown (Manufacturing, Commercial Real Estate, Institutional, etc.)
- Number of buildings input
- Current sustainability goals (optional textarea)
- "Create Profile" button

### 2. Home Screen (Main Dashboard)

**Layout:** Vertical scroll with sections

**Top Section: Header**
- Company logo/name
- Profile icon (top right)
- Notification bell icon (top right)

**Section 1: Quick Stats Cards (Horizontal Scroll)**
- Total Buildings: Number with icon
- Total Carbon Footprint: CO₂ metric with trend indicator
- Active Simulations: Count with status
- Blockchain Transactions: Count with verification badge

**Section 2: Active Projects**
- List of buildings with digital twins
- Each item shows: Building thumbnail, name, location, last updated
- Tap to view building detail
- "+" FAB button to add new building

**Section 3: Recent Simulations**
- List of recent simulation runs
- Each item shows: Building name, scenario type, carbon reduction %, date
- Tap to view simulation details

**Section 4: Insights & Recommendations**
- AI-generated recommendations card
- "View All Insights" link

**Bottom: Tab Bar Navigation**
- Home (house icon)
- Buildings (building icon)
- Simulations (flask icon)
- Blockchain (link icon)
- Profile (person icon)

### 3. Buildings Tab

**Layout:** Vertical scroll list

**Header:**
- "My Buildings" title
- Search bar
- Filter icon (by location, type, status)
- "+" button to add building

**Building List:**
- Card for each building
- Building image/3D preview thumbnail
- Building name and location
- Key metrics: Size (sq ft), Carbon footprint, Last simulation date
- Status badge (Active, Needs Attention, Optimized)
- Tap to view building detail

### 4. Building Detail Screen

**Layout:** Vertical scroll with tabs

**Header:**
- Back button
- Building name
- Edit icon
- Share icon

**Hero Section:**
- Large 3D digital twin visualization (interactive if possible, static otherwise)
- Rotate/zoom controls (if interactive)

**Tab Navigation:**
- Overview
- Systems
- Simulations
- Analytics

**Tab 1: Overview**
- Building information: Address, size, floors, year built
- Current systems: HVAC, lighting, water, renewable energy
- Carbon metrics: Current emissions, reduction target, progress bar
- "Run New Simulation" button

**Tab 2: Systems**
- List of building systems with status indicators
- HVAC system details and efficiency rating
- Lighting system details
- Water system details
- Renewable energy installations (if any)
- Each system expandable for more details

**Tab 3: Simulations**
- List of all simulations run for this building
- Filters: By scenario type, date range
- Each simulation card shows: Scenario name, date, carbon reduction %, ROI
- Tap to view simulation details

**Tab 4: Analytics**
- Energy consumption chart (line graph, monthly)
- Carbon emissions trend (line graph, monthly)
- Cost analysis (bar chart, by category)
- IoT data integration status

### 5. Add Building Screen

**Layout:** Vertical scroll form

**Option 1: Upload Existing Building**
- "Upload Building Sketch" section
- File picker button (supports images, CAD files)
- Uploaded file preview
- Building details form:
  - Building name
  - Location (address with map picker)
  - Size (sq ft)
  - Number of floors
  - Year built
  - Current systems checkboxes (HVAC, lighting, water, etc.)
- "Convert to 3D Digital Twin" button

**Option 2: Design New Building**
- "Design from Scratch" section
- Land area input
- Desired facilities checkboxes (offices, manufacturing, storage, etc.)
- Number of floors input
- Building orientation (compass selector)
- Sustainability goals textarea
- "Generate Building Design" button

**Progress Indicator:**
- Shows conversion/generation progress
- Estimated time remaining
- Cancel button

### 6. Simulations Tab

**Layout:** Vertical scroll

**Header:**
- "Simulations" title
- Filter icon (by building, scenario type, date)
- "New Simulation" button

**Simulation List:**
- Card for each simulation
- Building name and thumbnail
- Scenario type badge (Solar, Wind, HVAC, Water, Envelope, Combined)
- Key results: Carbon reduction %, cost, ROI, payback period
- Status indicator (Running, Completed, Failed)
- Date
- Tap to view simulation details

### 7. New Simulation Screen

**Layout:** Multi-step wizard

**Step 1: Select Building**
- List of buildings with radio buttons
- Search bar
- "Next" button

**Step 2: Choose Scenario Type**
- Grid of scenario cards:
  - Solar Panels: Icon, brief description
  - Wind Turbines: Icon, brief description
  - HVAC Optimization: Icon, brief description
  - Water Conservation: Icon, brief description
  - Building Envelope: Icon, brief description
  - Custom Combination: Icon, brief description
- Select one or multiple
- "Next" button

**Step 3: Configure Parameters**
(Dynamic based on selected scenarios)

**For Solar Panels:**
- Panel type dropdown
- Coverage area slider (% of roof)
- Orientation selector
- Tilt angle slider

**For Wind Turbines:**
- Turbine model dropdown
- Number of turbines input
- Height input
- Location on property (map picker)

**For HVAC Optimization:**
- System type dropdown
- Efficiency target slider
- Upgrade components checkboxes

**For Water Conservation:**
- Rainwater harvesting checkbox
- Greywater recycling checkbox
- Low-flow fixtures checkbox
- Target reduction % slider

**For Building Envelope:**
- Insulation upgrade level dropdown
- Window replacement type dropdown
- Roof improvements checkboxes

**Step 4: Review & Run**
- Summary of selected scenarios and parameters
- Estimated simulation time
- "Run Simulation" button

**Progress Screen:**
- Animated progress indicator
- Current step description (Analyzing building, Calculating energy, Forecasting costs, etc.)
- "View Results" button appears when complete

### 8. Simulation Results Screen

**Layout:** Vertical scroll with sections

**Header:**
- Back button
- Simulation name (editable)
- Save/bookmark icon
- Share icon

**Summary Cards (Horizontal Scroll):**
- Carbon Reduction: % and absolute value (tons CO₂/year)
- Cost Estimate: Total implementation cost breakdown
- Energy Savings: kWh/year and $ savings
- ROI: Percentage and payback period
- Incentives: Available rebates and tax credits

**Section 1: Carbon Impact Analysis**
- Before/after comparison chart (bar chart)
- Operational carbon vs embodied carbon breakdown (pie chart)
- Timeline to net-zero projection (line graph)

**Section 2: Financial Analysis**
- Implementation cost breakdown (pie chart: Materials, Labor, Equipment, Permits)
- Cash flow projection (line graph over 10 years)
- ROI calculation details
- Available incentives list with amounts

**Section 3: Energy Analysis**
- Monthly energy consumption forecast (line graph)
- Peak demand analysis (bar chart by month)
- Renewable energy generation (if applicable, line graph)
- Grid independence % (gauge chart)

**Section 4: Comparison**
- "Compare with Other Scenarios" button
- If multiple simulations exist, side-by-side comparison table

**Bottom Actions:**
- "Save Scenario" button
- "Request Detailed Report" button (generates PDF)
- "Proceed to Implementation" button (future feature)

### 9. Blockchain Tab

**Layout:** Vertical scroll

**Header:**
- "Supply Chain Carbon Tracking" title
- Info icon (explains blockchain verification)
- Filter icon (by date, supplier, transaction type)

**Summary Section:**
- Total Scope 3 Emissions: CO₂ metric
- Verified Transactions: Count with blockchain icon
- Supply Chain Partners: Count
- Carbon Credits: Balance

**Transaction List:**
- Card for each blockchain transaction
- Supplier/partner name and logo
- Transaction type (Material shipment, Energy purchase, Carbon credit, etc.)
- CO₂ value
- Verification status badge (Verified, Pending)
- Timestamp
- Blockchain transaction ID (truncated, expandable)
- Tap to view transaction details

**Bottom Action:**
- "Add Supply Chain Partner" button

### 10. Transaction Detail Screen

**Layout:** Vertical scroll

**Header:**
- Back button
- "Transaction Details" title
- Verification badge

**Transaction Information:**
- Transaction ID (full, copyable)
- Block number
- Timestamp
- Verification status

**Parties Involved:**
- Supplier/Partner name, logo, verified badge
- Your company name and logo

**Carbon Data:**
- Emissions value (CO₂)
- Calculation method
- Supporting documents (links to PDFs, images)

**Blockchain Verification:**
- Network: Energy Web Chain
- Smart contract address (copyable)
- Transaction hash (copyable)
- "View on Blockchain Explorer" link

**Audit Trail:**
- Timeline of verification steps
- Each step with timestamp and verifier

### 11. Profile Tab

**Layout:** Vertical scroll

**Header:**
- Company logo/avatar (editable)
- Company name
- Edit profile button

**Profile Information:**
- Company details: Name, industry, location
- Contact information
- Sustainability goals
- "Edit" button

**Account Settings:**
- Notification preferences
- Data sync settings
- Units preference (metric/imperial)
- Language

**Subscription & Billing:**
- Current plan (Free, Pro, Enterprise)
- Usage statistics
- "Upgrade Plan" button
- Billing history

**Support & Resources:**
- Help Center link
- Contact Support
- Tutorial videos
- API Documentation (for developers)

**About:**
- App version
- Terms of Service
- Privacy Policy
- Licenses

**Sign Out Button**

### 12. Settings Screen

**Layout:** Grouped list

**Sections:**
- Account: Email, password change
- Notifications: Push, email, in-app preferences
- Data & Privacy: Data export, delete account
- Appearance: Theme (dark/light), color accent
- Units: Metric/Imperial toggle
- Language: Language selector
- About: Version, terms, privacy

## Key User Flows

### Flow 1: Create Digital Twin from Existing Building
1. User taps "+" FAB on Home or Buildings tab
2. Selects "Upload Existing Building"
3. Uploads building sketch/CAD file via file picker
4. Fills in building details form (name, location, size, floors, systems)
5. Taps "Convert to 3D Digital Twin"
6. Progress screen shows conversion status
7. Upon completion, user is taken to Building Detail screen
8. 3D digital twin is displayed with all systems mapped

### Flow 2: Run Solar Panel Simulation
1. User navigates to Building Detail screen
2. Taps "Run New Simulation" button
3. Simulation wizard opens at Step 1 (building already selected)
4. Proceeds to Step 2, selects "Solar Panels" scenario
5. Taps "Next" to Step 3
6. Configures solar panel parameters (type, coverage, orientation, tilt)
7. Taps "Next" to Step 4 (Review)
8. Reviews summary and taps "Run Simulation"
9. Progress screen shows simulation running
10. Upon completion, taps "View Results"
11. Simulation Results screen displays carbon reduction, cost, ROI, energy savings
12. User reviews charts and analysis
13. Taps "Save Scenario" to bookmark for later comparison

### Flow 3: Track Supply Chain Emissions via Blockchain
1. User navigates to Blockchain tab
2. Views list of verified transactions
3. Taps on a specific transaction (e.g., "Steel shipment from Supplier X")
4. Transaction Detail screen opens
5. Reviews carbon emissions data, verification status, blockchain details
6. Taps "View on Blockchain Explorer" to see immutable record
7. Returns to Blockchain tab
8. Taps "Add Supply Chain Partner" to onboard new supplier
9. Fills in partner details and blockchain wallet address
10. System creates smart contract for automated emissions tracking

## Design Patterns and Components

### Navigation
- **Tab Bar:** Primary navigation with 5 tabs (Home, Buildings, Simulations, Blockchain, Profile)
- **Stack Navigation:** For drill-down flows (Building List → Building Detail → Simulation Results)
- **Modal Sheets:** For quick actions (filters, settings, confirmations)

### Cards
- **Elevated Cards:** Surface color (#2A2A2A) with subtle shadow
- **Metric Cards:** Large number with label and trend indicator
- **List Cards:** Horizontal layout with thumbnail, title, metadata, and action icon

### Buttons
- **Primary Button:** Emerald background (#00C896), white text, full width, 48px height
- **Secondary Button:** Transparent with emerald border, emerald text
- **Text Button:** No background, emerald text
- **Icon Button:** Circular, 44px diameter, transparent with icon

### Forms
- **Text Input:** Dark surface with light border, white text, emerald focus border
- **Dropdown:** Native picker on iOS, custom dropdown on Android
- **Slider:** Emerald track and thumb
- **Checkbox/Radio:** Emerald when selected
- **File Picker:** Card with dashed border, upload icon, "Tap to upload" text

### Charts and Visualizations
- **Line Charts:** For trends over time (energy consumption, carbon emissions)
- **Bar Charts:** For comparisons (monthly costs, scenario comparison)
- **Pie Charts:** For breakdowns (cost categories, emissions sources)
- **Gauge Charts:** For progress toward goals (net-zero progress, grid independence)
- **3D Visualizations:** For building digital twins (interactive or static)

### Feedback and States
- **Loading:** Spinner with "Loading..." text or skeleton screens
- **Empty State:** Icon, message, and action button
- **Error State:** Error icon, message, and "Retry" button
- **Success Toast:** Emerald background, white text, checkmark icon, auto-dismiss
- **Error Toast:** Red background, white text, error icon, auto-dismiss

### Accessibility
- **Minimum Touch Target:** 44x44px for all interactive elements
- **Color Contrast:** WCAG AA compliant (4.5:1 for normal text, 3:1 for large text)
- **Dynamic Type:** Support iOS Dynamic Type for text scaling
- **VoiceOver:** All elements properly labeled for screen readers

## Technical Considerations

### 3D Digital Twin Rendering
- Use **Three.js** or **React Native WebGL** for 3D visualization
- Fallback to static 3D renders if device doesn't support WebGL
- Optimize model complexity for mobile performance (low-poly models)
- Implement level-of-detail (LOD) for distant objects

### IoT Integration
- WebSocket connection for real-time sensor data
- Polling fallback if WebSocket unavailable
- Data caching for offline viewing
- Push notifications for threshold alerts

### Blockchain Integration
- Use **Web3.js** or **Ethers.js** for blockchain interaction
- Connect to Energy Web Chain via RPC endpoint
- Display transaction status (pending, confirmed, failed)
- QR code scanner for wallet addresses

### Offline Support
- Cache building data and recent simulations
- Queue blockchain transactions for later submission
- Sync when connection restored
- "Offline Mode" indicator in header

### Performance Optimization
- Lazy load images and 3D models
- Virtualized lists for long scrolling (FlatList)
- Debounce search inputs
- Optimize chart rendering (use react-native-chart-kit or Victory Native)

## Animation and Transitions

### Screen Transitions
- **Push/Pop:** Slide from right (iOS standard)
- **Modal:** Slide up from bottom
- **Tab Switch:** Crossfade

### Micro-interactions
- **Button Press:** Scale to 0.97, subtle haptic feedback
- **Card Tap:** Opacity to 0.7
- **Toggle Switch:** Smooth slide animation
- **Progress Indicators:** Smooth fill animation

### Data Visualization Animations
- **Chart Entry:** Animate from zero to value (300ms ease-out)
- **Value Updates:** Smooth transition between values
- **Loading Skeleton:** Shimmer effect

## Responsive Design

### Portrait Orientation (Primary)
- Optimized for one-handed use
- Important actions within thumb reach
- Vertical scrolling for content

### Landscape Orientation (Secondary)
- Horizontal layout for charts and 3D views
- Side-by-side comparison views
- Tab bar remains at bottom

### Tablet Support
- Two-column layout where appropriate
- Larger charts and visualizations
- Side panel navigation option

## Branding

### App Icon
- Custom-generated icon featuring a building silhouette with digital twin overlay
- Emerald and teal gradient background
- Simple, recognizable at small sizes

### Splash Screen
- App icon centered
- Dark background (#1A1A1A)
- Subtle animation (fade in or scale)

### Empty States
- Consistent illustration style (line art, emerald/teal colors)
- Friendly, encouraging copy
- Clear call-to-action

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Buildings added per user
- Simulations run per building
- Time spent in app

### Feature Adoption
- % users who complete onboarding
- % users who upload a building
- % users who run a simulation
- % users who view blockchain transactions

### Performance
- App load time < 2 seconds
- 3D model load time < 3 seconds
- Simulation completion time < 30 seconds (for simple scenarios)
- Crash-free rate > 99.5%
