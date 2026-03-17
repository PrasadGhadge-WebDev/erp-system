const Footer = () => {
  return (
    <footer className="w-full px-6 pb-8 pt-4">
      <div className="flex flex-col items-center justify-between gap-4 text-gray-600 dark:text-gray-400 xl:flex-row">
        
        <p className="text-sm">
          © {new Date().getFullYear()} Horizon UI. All Rights Reserved.
        </p>

        <ul className="flex flex-wrap items-center gap-6 text-sm">
          <li>
            <a href="mailto:hello@simmmple.com" className="hover:text-gray-900 dark:hover:text-white">
              Support
            </a>
          </li>

          <li>
            <a href="https://simmmple.com/licenses" className="hover:text-gray-900 dark:hover:text-white">
              License
            </a>
          </li>

          <li>
            <a href="https://simmmple.com/terms-of-service" className="hover:text-gray-900 dark:hover:text-white">
              Terms of Use
            </a>
          </li>

          <li>
            <a href="https://blog.horizon-ui.com/" className="hover:text-gray-900 dark:hover:text-white">
              Blog
            </a>
          </li>
        </ul>

      </div>
    </footer>
  );
};

export default Footer;