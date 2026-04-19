import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <p>© 2026 Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}