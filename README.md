# FinBoard – Customizable Finance Dashboard

FinBoard is a real-time finance monitoring dashboard where users can build their own personalized finance dashboard by connecting to different financial APIs.  
It supports tables, charts, and cards as widgets, enabling users to fetch stock or crypto data and visualize them in real time.

**Live Demo:** [FinBoard on Vercel](https://groww-assignment-mauve.vercel.app/)

---

## Features

### Widget Management
- Add widgets dynamically (Table, Chart, Finance Cards)
- Remove unwanted widgets easily
- Configure widgets with API endpoints, refresh intervals, and field selection
- Planned: drag-and-drop widget rearrangement

### Data Integration
- Connect to financial APIs such as Finnhub, Alpha Vantage, and others
- Real-time updates with configurable refresh intervals
- Caching mechanism to reduce redundant API calls

### Custom Visualizations
- Line and Candle charts with interval selection (Daily, Weekly, Monthly)
- Paginated and searchable tables
- Finance cards for watchlists, market movers, and performance data

### User Experience
- Intuitive dashboard builder
- Responsive design for multiple screen sizes
- Graceful handling of loading, error, and empty states

### Persistence and Sharing
- Auto-save widget configurations in browser storage
- Import and export dashboard configuration as JSON
- Dashboard state recovery on page refresh

---

## Tech Stack

- **Framework:** Next.js  
- **Styling:** Tailwind CSS, Styled Components  
- **State Management:** Redux Toolkit, Zustand  
- **Data Visualization:** Recharts / Chart.js  
- **Deployment:** Vercel  

---

## Screenshots

### Dashboard – Empty State
![Dashboard Empty](./screenshots/Screenshot-2025-09-04-185759.png)

### Add Widget (API Integration)
![Add Widget](./screenshots/Screenshot-2025-09-04-185829.png)

### Table Widget Example
![Table Widget](./screenshots/Screenshot-2025-09-04-180137.png)

### Chart Widget Example
![Chart Widget](./screenshots/Screenshot-2025-09-04-195255.png)

---

## Getting Started

### 1. Clone the Repository

git clone https://github.com/riddhiJainSDE/Groww_Assignment.git
cd Groww_Assignment
2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_FINNHUB_API_KEY=your_api_key_here

4. Run the Development Server
npm run dev


The application will be available at http://localhost:3000.

Requirements (from assignment)

Real-time dashboard with customizable widgets

Integration with multiple financial APIs

State management using Redux/Zustand

Data persistence and dashboard recovery

Clean, maintainable, and scalable code

Future Enhancements

Light/Dark mode toggle

Real-time updates via WebSockets

Pre-built dashboard templates

Drag-and-drop widget positioning
