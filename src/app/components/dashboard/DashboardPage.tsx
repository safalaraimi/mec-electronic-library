import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Users, Grid3X3, TrendingUp, Loader2, Clock } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalCategories: number;
  totalDownloads: number;
  recentBooks: number;
  topCategories: { name: string; count: number }[];
}

interface Activity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([api.stats.get(), api.activity.get()]);
        setStats(statsRes.stats);
        setActivity(actRes.activity || []);
      } catch {
        // silently fall back to empty stats on error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#1B3A8C" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, <span className="font-medium">{userName}</span></p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Total Books"
          value={stats?.totalBooks ?? 0}
          sub="In the library"
          color="#1B3A8C"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Registered Users"
          value={stats?.totalUsers ?? 0}
          sub="Active accounts"
          color="#2563EB"
        />
        <StatCard
          icon={<Grid3X3 className="w-5 h-5" />}
          label="Categories"
          value={stats?.totalCategories ?? 0}
          sub="Book genres"
          color="#0891B2"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Added This Week"
          value={stats?.recentBooks ?? 0}
          sub="New additions"
          color="#059669"
        />
      </div>

      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-3 bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Books by Category</h3>
          {stats?.topCategories && stats.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topCategories} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                  cursor={{ fill: "#F1F5F9" }}
                />
                <Bar dataKey="count" fill="#1B3A8C" radius={[4, 4, 0, 0]} name="Books" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <BookOpen className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No books in the library yet</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Clock className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-56">
              {activity.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium leading-tight">{item.action}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.details}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/books"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            View All Books
          </Link>
        </div>
      </div>
    </div>
  );
}
