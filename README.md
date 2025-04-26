# 🌟 Movie App - TMDB Search and Explore

A React application for searching, viewing movie details, and managing personal profiles, utilizing the TMDB API and Firebase Authentication, Storage, and Firestore services.

![screencapture-movieapp-71dcd-web-app-2023-02-07-20_08_42](https://user-images.githubusercontent.com/57687331/217329799-1bfb0546-68e8-411c-b9ec-79556c757104.png)

---

## 📚 Key Features

- 🔍 **Movie search** with Debounce to avoid unnecessary API calls.
- 🔥 **Display popular / upcoming / top-rated movies** by category.
- 📅 **Single movie page** with trailer, cast, genres, and similar movies.
- 💼 **User management:** Sign up, login, Google authentication, personal profile page.
- 📷 **Profile image upload** (only for regular users, not Google accounts).
- ⚡ **Smart notifications** (Toastify) for important actions (loading, success, error).
- 📊 **Performance optimization:** useMemo, debounce, useImmerReducer, and Context for global state management.

---

## 🔧 Technologies Used

- React 17
- React Router DOM 5
- Axios
- Firebase Authentication
- Firebase Storage
- Firebase Firestore
- react-toastify
- react-paginate
- react-iframe
- react-router-scroll-top
- use-immer
- SCSS Modules

---

## 🛠 Installation & Run Instructions

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
REACT_APP_THEMOVIEDB_API_KEY=your-tmdb-api-key
```

4. Important Note about NodeJS 17+ Compatibility:

If you encounter an OpenSSL error (`digital envelope routines`), you must run the project with:

- On Windows:

```bash
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

- On Mac/Linux:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

This fixes compatibility issues between Webpack and NodeJS OpenSSL changes.

5. Start the project:

```bash
npm start
```

6. Open in your browser:

```
http://localhost:3000
```

---

## 🔒 Registration and Login

- Users can register with email/password or login via Google.
- Google-authenticated users cannot change their profile pictures (Firebase policy).

---

## 🔎 Performance Optimization

- Used `debounce` on the search field to minimize API requests during typing.
- Wrapped the search function with `useMemo` to stabilize between renders.
- Cleaned up timers when the component unmounts to avoid stale calls.
- Managed complex states with `useImmerReducer` for clean and safe updates.

---

## 🌟 Lessons Learned

- How to enhance user experience with smart search optimizations.
- Working with the full Firebase ecosystem (Auth, Storage, Firestore).
- Building scalable and maintainable global state management.
- Optimizing renders and network performance.

---

# 💖 Thank you for reviewing!

For any questions or suggestions, feel free to reach out!
