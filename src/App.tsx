import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ContactSuccess from "./components/ContactSuccess";
import ContactPage from "./components/ContactPage";
import { AnimatePresence } from "framer-motion";
import AboutPage from "./components/AboutPage";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import AdminPage from "./components/AdminPage";
import { useEffect } from "react";
import gsap from "gsap";

const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline();

    gsap.set(".page-content", {
      opacity: 0,
      y: 50,
    });

    tl.to(".transition-overlay", {
      yPercent: 0,
      duration: 0.8,
      ease: "power4.inOut",
    })
      .to(".page-content", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      })
      .to(
        ".transition-overlay",
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        "-=0.6"
      );
  }, [location]);

  return (
    <>
      <div className="page-content w-full min-h-screen">{children}</div>
      <div
        className="transition-overlay fixed inset-0 bg-black transform -translate-y-full z-50"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full overflow-x-hidden bg-black text-white relative">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Homepage - Only Hero section with navigation links */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <Hero />
                </PageTransition>
              }
            />

            {/* Gallery Page */}
            <Route
              path="/gallery"
              element={
                <PageTransition>
                  <Gallery />
                </PageTransition>
              }
            />

            {/* About Page */}
            <Route
              path="/about"
              element={
                <PageTransition>
                  <AboutPage />
                </PageTransition>
              }
            />

            {/* Contact Page */}
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              }
            />
            <Route
              path="/contact/success"
              element={
                <PageTransition>
                  <ContactSuccess />
                </PageTransition>
              }
            />

            {/* Admin Page */}
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <AdminPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
