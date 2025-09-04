import "./globals.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata = {
  title: "FinBoard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen text-white 
          bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
