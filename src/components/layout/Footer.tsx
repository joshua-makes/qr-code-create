import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with ❤️ using Next.js and qr-code-styling &mdash; QR Logo Lab
          </p>
          <Link
            href="https://github.com/bestacles/qr-code-create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            View on GitHub
          </Link>
        </div>
      </Container>
    </footer>
  );
}
