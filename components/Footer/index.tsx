export const Footer = () => (
  <footer className="text-white py-4">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Logo Section */}
        <div className="mb-4 md:mb-0">
          <a href="/" className="text-xl hover:text-gray-400">
            Cambusa Ai
          </a>
        </div>

        <div className="text-center text-sm">
          Made with{" "}
          <span
            aria-label="love"
            role="img"
            className="text-white hover:underline"
          >
            ♡
          </span>{" "}
          by{" "}
          <a
            href="https://www.instagram.com/artscomi/"
            className="text-white hover:underline"
          >
            artscomi
          </a>{" "}
          &copy; 2024. All rights reserved.
        </div>

        {/* Links Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <a href="/contact" className="hover:text-gray-400">
            Contact
          </a>
          <a href="/privacy-policy" className="hover:text-gray-400">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);
