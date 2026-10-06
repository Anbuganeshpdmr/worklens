import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import { EntryProvider } from "./context/EntryContext";

function App() {
  return (
    <UserProvider>
      <EntryProvider>
        <AppRoutes />
      </EntryProvider>
    </UserProvider>
  );
}

export default App;
