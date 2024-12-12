import {
  Instagram,
} from "lucide-react";

const currentYear = new Date().getFullYear();

export const Footer = () => (
  <footer className="text-primary py-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-5">
        {/* <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 justify-end mb-3">
            <a href="/contact">Contact</a>
            <a href="/privacy-policy">Privacy Policy</a>
          </div> */}
        <a href="https://www.instagram.com/cambusaai/" className="gap-2 flex">
          <Instagram /> Cambusaai
        </a>

        <div className="text-sm text-right">
          made with ♥ by{" "}
          <a
            href="https://www.instagram.com/artscomi/"
            className=" hover:underline font-bold"
          >
            artscomi
          </a>
        </div>
      </div>
    </div>
  </footer>
);
