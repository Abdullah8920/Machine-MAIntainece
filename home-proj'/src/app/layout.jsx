import "./globals.css";

export const metadata = {
  title: "Machine Maintenance",
  description: "Track repairs, costs, and service history for every client machine.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#16202A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
