import { Shield, FileText, Cookie } from "lucide-react";
import Link from "next/link";

export const LegalLinks = () => {
  return (
    <div className="text-center md:text-left">
      <h4 className="font-semibold text-gray-900 mb-4">Informazioni</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/privacy-policy"
            className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
          >
            <FileText className="w-4 h-4" />
            Termini di Servizio
          </Link>
        </li>
        <li>
          <Link
            href="/cookies"
            className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
          >
            <Cookie className="w-4 h-4" />
            Cookie Policy
          </Link>
        </li>
      </ul>
    </div>
  );
};
