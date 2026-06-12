import { NavLink, useNavigate } from "react-router";
import { BookOpen, LayoutDashboard, Library, LogOut, ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#0F2557";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  children?: { label: string; to: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, to: "/dashboard" },
  {
    label: "Books",
    icon: <Library className="w-4.5 h-4.5" />,
    children: [
      { label: "All Books", to: "/books" },
      { label: "Add New Book", to: "/books/add" },
    ],
  },
  { label: "Digital Library", icon: <GraduationCap className="w-4.5 h-4.5" />, to: "/digital-library" },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["Books"]));

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  return (
    <aside
      className="flex flex-col h-full"
      style={{ backgroundColor: NAVY, width: "260px", minWidth: "260px" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">MEC</p>
            <p className="text-white/60 text-xs tracking-widest" style={{ fontSize: "0.6rem" }}>ELECTRONIC LIBRARY</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="px-6 mb-2 text-white/40 uppercase tracking-widest" style={{ fontSize: "0.6rem", fontWeight: 600 }}>
          Navigation
        </p>
        {navItems.map((item) => (
          <div key={item.label}>
            {item.to ? (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2.5 mx-2 rounded-lg text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="flex items-center gap-3 px-6 py-2.5 mx-2 w-[calc(100%-16px)] rounded-lg text-sm transition-all text-white/70 hover:bg-white/8 hover:text-white"
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {expandedItems.has(item.label)
                    ? <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    : <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  }
                </button>
                {expandedItems.has(item.label) && item.children && (
                  <div className="ml-4 mb-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-6 py-2 mx-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? "text-white font-semibold bg-white/12"
                              : "text-white/60 hover:text-white hover:bg-white/8"
                          }`
                        }
                      >
                        <div className="w-1 h-1 rounded-full bg-current opacity-60" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName}</p>
            <p className="text-white/50 text-xs truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
