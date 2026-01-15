import { Toaster } from "sonner";
import { EventsPage } from "./pages/EventsPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={2500} />
      <EventsPage />
    </>
  );
}
