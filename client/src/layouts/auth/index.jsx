import Footer from "components/footer/FooterAuthDefault";
import { Link, Outlet } from "react-router-dom";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function Auth() {
  document.documentElement.dir = "ltr";

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-navy-900 dark:text-white">
      
      <FixedPlugin />

      {/* Center Auth Content */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">

          {/* Back Button */}
          <Link
            to="/admin"
            className="mb-6 inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
               
              />
            </svg>
           
          </Link>

          {/* Auth Pages */}
          <div className="w-full">
            <Outlet />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}