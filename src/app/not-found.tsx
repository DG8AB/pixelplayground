import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">404</h1>
      <h2 className="text-2xl mt-4">Page Not Found</h2>
      <p className="text-lg mt-2 text-center">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300">
        Go Back Home
      </Link>
    </div>
  );
}
