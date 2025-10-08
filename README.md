
# React Native Task – Dashboard & MultiColor Gauge

## Project Overview

This React Native project demonstrates a **dashboard app** featuring:  

- **Bottom Tab Navigation** with multiple screens.  
- **Drawer Navigation** integrated with bottom tabs.  
- **Custom MultiColor Gauge** component displaying proportional segments.  
- **Coming Soon placeholders** for incomplete features.  
- **Legends and Add buttons** in a card-style UI for gauges.  

The app is built using **React Native, React Navigation, and Tabler Icons**.

---

## Features

1. **Bottom Tabs**  
   - Dashboard, Assests, Incidents, Requests, Users  
   - Custom icons for each tab  

2. **Drawer Navigation**  
   - Single entry point to Bottom Tabs  
   - Clicking a drawer item navigates to the corresponding bottom tab  

3. **MultiColor Gauge Component**  
   - Displays multiple segments on a single ring  
   - Segment lengths are proportional to their values  
   - Legends displayed as rows  
   - Add New button for future actions  

4. **Coming Soon Screen**  
   - Placeholder for incomplete features  
   - Icon and text centered with a clean UI  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/nitish0844/Vajra_Task-React-Native.git
cd react-native-dashboard

# Install dependencies
npm install
# or
yarn install

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

---

## Usage

- **Navigate using Bottom Tabs** to switch between screens.  
- **Open the Drawer** to jump directly to a specific tab.  
- **Gauge Component** shows values as colored arcs with legends.  

---

## Navigation Diagram

```
Drawer
 ├─ Dashboard  ──> BottomTabs ──> Dashboard Tab
 ├─ Assests    ──> BottomTabs ──> Assests Tab
 ├─ Incidents  ──> BottomTabs ──> Incidents Tab
 ├─ Requests   ──> BottomTabs ──> Requests Tab
 └─ Users      ──> BottomTabs ──> Users Tab
```

**Explanation:**  
- Drawer has a single main screen: `BottomTabs`.  
- Each drawer item navigates to a specific tab inside `BottomTabs`.  
- BottomTabs handles the actual screen content.  

---

## Code Structure

```
/components
  /home
    /Incidents
      MultiColorGauge.jsx
/screens
  /Home
    HomeScreen.jsx
  /CommingSoon
    CommingZoon.jsx
/navigation
  BottomTabs.jsx
  DrawerNavigator.jsx
/constants
  theme.js
App.js
```

---

## Questions / Self-Assessment

1. How does the MultiColorGauge calculate the segment angles for a given dataset?  
2. How does the Drawer interact with Bottom Tabs to navigate to a specific tab?  
3. How would you add animation to the gauge arcs when values update?  
4. If you wanted to make the gauge interactive (tap a segment to see details), how would you implement it?  
5. How can you improve performance if the dataset grows to 100+ segments?  
6. How would you extend the “Coming Soon” screen with an animation or countdown?  
7. How would you refactor the drawer and tabs to support dynamic data (new tabs added at runtime)?  

---

## Future Improvements

- Animated gauge arcs with smooth transitions.  
- Interactive segment clicks to show details or actions.  
- Real data fetching for each tab.  
- Dark mode support.  
- Unit tests for MultiColorGauge component.
