# OrangeGuard AI – Smart Orange Orchard Monitoring and Automation System

## Overview
OrangeGuard AI is a software prototype designed to help orange farmers in Nagpur and Vidarbha monitor orchard health, review potential crop problems, and manage farm activities efficiently.

## Features Included
1. **Dashboard:** Overview of total zones, active alerts, healthy zones, and visual charts.
2. **Image Analysis:** A simulated AI workflow to analyze photos of orange leaves and trees, reporting health statuses like Citrus Canker or Nutrient Deficiency.
3. **Orchard Zones:** A management view to add, edit, or delete orchard zones with persistent local storage.
4. **Alerts:** A prioritized list of issues with action buttons to mark them as reviewed or resolved.
5. **Farm Tasks:** A Kanban-like view for pending, in-progress, and completed farming activities. 
6. **Reports:** Trend charts and exportable CSV reports for demonstration data.

## Technologies Used
- React (Vite)
- Tailwind CSS (v4)
- Recharts (for Dashboard & Reports)
- Lucide React (for UI Icons)
- LocalStorage API (for data persistence)

## How to Start the Application Locally

1. **Prerequisites:** Ensure you have Node.js installed on your machine.
2. **Navigate to the directory:**
   ```bash
   cd path/to/jhulelal
   ```
3. **Install Dependencies** (if you haven't already):
   ```bash
   npm install
   ```
4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
5. **View the Application:**
   Open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173`).

## Data Storage
This is a fully functional frontend prototype. Since no backend API is integrated, all data (Zones, Alerts, Tasks) is saved to your browser's **Local Storage**. You can refresh the page without losing your newly added tasks or zones.

## Disclaimer
The image analysis feature is a simulated demonstration. It randomly assigns health statuses and confidence metrics for UI demonstration purposes and does not process images using an actual machine learning model. Do not use for real diagnostic purposes without physical verification by an agronomist.
