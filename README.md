# NUBAN Manager

A responsive, production-grade React application for generating, validating, and managing Nigerian NUBAN account numbers. Built with Vite, React, Redux Toolkit, and Tailwind CSS. Features advanced state management, mock API integration, TypeScript safety, and a polished user experience.

---

## 🚀 Features

- **NUBAN Generation:** Generate valid NUBAN account numbers using a real-world algorithm and mock API.
- **Validation:** Validate NUBANs with accurate check digit logic and get instant feedback.
- **History:** See all validated NUBANs with their status, filter by bank code, and sort results.
- **UI State Management:** Consistent global loading, error, and success feedback.
- **Advanced Architecture:** Modular, feature-first structure with Redux Toolkit, RTK Query, and custom middleware.
- **Persistence:** Optionally saves state to localStorage for session restore.
- **Responsive Design:** Works seamlessly across desktop and mobile devices.

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nuban-manager.git
cd nuban-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app (development)

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

---

## 🏗️ Project Structure

```
src/
  app/            # Redux store & middleware
  features/       # Feature modules (nuban, validation, filters, ui)
  shared/         # Shared components, hooks, services, types, utils
  styles/         # Tailwind CSS
  App.tsx         # Main app
  main.tsx        # Entry point
```

---

## ⚙️ Configuration & Customization

- **Bank Codes/Data:** Bank codes used for NUBAN validation are based on realistic Nigerian banking data, located in `src/shared/utils/constants.ts`.
- **Mock API:** All NUBAN generation/validation uses a mock API service, no backend required.
- **Persistence:** State is persisted to localStorage via Redux middleware (can be disabled in `src/app/store.ts`).

---

## 📝 Assumptions

- NUBAN validation strictly follows the official Nigerian Inter-Bank Settlement System (NIBSS) check digit algorithm.
- All bank codes in `constants.ts` are up-to-date as of 2024.
- Mock API simulates real-world latency and error scenarios for robust UI feedback.
- No real user authentication or backend integrations—only mock/demo data is used.
- The UI is optimized for modern browsers.

---

## 📦 Dependencies

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@faker-js/faker](https://fakerjs.dev/) (for mock data)
- [date-fns](https://date-fns.org/) (for date formatting)
- [Headless UI](https://headlessui.dev/) & [Lucide Icons](https://lucide.dev/) (for UI/UX)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

## 🔗 Demo

You can test the application locally or deploy it with Vercel, Netlify, or your preferred static hosting.

---

## 📬 Contact

Questions or feedback? Please open an issue or contact echuemmanuel918@gmail.com.
