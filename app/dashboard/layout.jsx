import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

// Tell Next.js that this route is dynamic.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  // If you need to enforce authentication, uncomment the redirect:
  if (!session) redirect("/login");

  return (
    <div className=" dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sticky Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center text-red-600 hover:text-red-800 transition duration-300"
            >
              <FaSignOutAlt className="mr-2 text-lg" />
              <span className="font-medium cursor-pointer">Logout</span>
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content with Padding to Avoid Navbar Overlap */}
      <main className="max-w-7xl  ">{children}</main>
    </div>
  );
}
