import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/books": "All Books",
  "/books/add": "Add New Book",
  "/digital-library": "Digital Library",
};

function getBreadcrumb(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.match(/^\/books\/[^/]+\/edit$/)) return "Edit Book";
  if (pathname.match(/^\/books\/[^/]+$/)) return "Book Details";
  if (pathname.match(/^\/digital-library\/[^/]+$/)) return "Book Details";
  return "MEC Library";
}

export function AppLayout() {
  const { pathname } = useLocation();
  const title = getBreadcrumb(pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F1F5F9" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center px-8 border-b flex-shrink-0"
          style={{ height: "60px", background: "#ffffff", borderColor: "rgba(15,37,87,0.1)" }}
        >
          <h1 className="text-base font-semibold text-slate-800">{title}</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
