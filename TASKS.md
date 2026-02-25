# Task List

## Task 1 — Backend Initialization & Health Check
Description:
Initialize Node.js + Express server with CORS and JSON middleware. Add /api/health route.

Expected Output:
- Express server running
- Middleware configured
- GET /api/health endpoint

Validation Method:
- npm start runs without errors
- GET /api/health returns 200 OK

---

## Task 2 — Setup File Upload Middleware (Multer)
Description:
Configure Multer for local storage in /uploads directory with file type validation (.jpg, .png).

Expected Output:
- Multer config file
- uploads/ directory usage
- File filter logic

Validation Method:
- Reject .txt / .gif
- Accept .jpg / .png

---

## Task 3 — Implement POST /api/upload
Description:
Create upload endpoint using Multer to save image and return image URL/path.

Expected Output:
- POST /api/upload route
- File saved on server
- JSON response with file path

Validation Method:
- Upload via Postman works
- File appears in uploads/

---

## Task 4 — Implement GET /api/images
Description:
Create endpoint returning list of uploaded images. Serve uploads/ statically.

Expected Output:
- GET /api/images route
- Static file serving

Validation Method:
- Returns JSON array
- URLs open in browser

---

## Task 5 — Frontend Initialization & Router Setup
Description:
Initialize React app with Tailwind CSS and React Router.

Expected Output:
- React project
- Tailwind configured
- Routes: /, /upload, /gallery

Validation Method:
- Routes load correctly

---

## Task 6 — Build Home Page (Screen 0)
Description:
Create landing page with navigation buttons.

Expected Output:
- Two buttons
- Route navigation

Validation Method:
- Buttons navigate correctly

---

## Task 7 — Build Upload Screen UI
Description:
Create upload UI with file input and button.

Expected Output:
- File input
- Upload button

Validation Method:
- File picker opens
- Accepts jpg/png

---

## Task 8 — Integrate Upload Logic
Description:
Send selected image to backend using FormData.

Expected Output:
- API call
- Success handling

Validation Method:
- Upload succeeds
- UI feedback visible

---

## Task 9 — Build Gallery Screen
Description:
Fetch images and render grid.

Expected Output:
- GET /api/images call
- Grid UI

Validation Method:
- Images displayed

---

## Task 10 — Implement Preview Modal
Description:
Create modal to preview selected image.

Expected Output:
- Modal component
- View button opens modal

Validation Method:
- Modal opens/closes
- Correct image displayed