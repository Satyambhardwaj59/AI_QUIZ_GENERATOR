import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left Text */}
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          © 2025 Satyam Kumar. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300 text-2xl">

          {/* GitHub */}
          <a
            href="https://github.com/satyambhardwaj59"
            target="_blank"
            className="hover:text-black dark:hover:text-white transition"
          >
            <FaGithub />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/satyam-kumar-297a3b27b/"
            target="_blank"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>

          {/* Email */}
          <a
            href="mailto:satyambhardwaj59@gmail.com"
            className="hover:text-red-600 dark:hover:text-red-400 transition"
          >
            <FaEnvelope />
          </a>

          {/* Phone Number */}
          <a
            href="tel:+917488499849"
            className="hover:text-green-600 dark:hover:text-green-400 transition"
          >
            <FaPhone />
          </a>

        </div>
      </div>
    </footer>
  );
}
