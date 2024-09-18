export const Footer = () => (
  <footer className="text-white py-4">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-end items-center">
        <div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 justify-end mb-3">
            <a href="/contact">Contact</a>
            <a href="/privacy-policy">Privacy Policy</a>
          </div>

          <div className="text-sm text-right">
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
        </div>
      </div>
    </div>
  </footer>
);
