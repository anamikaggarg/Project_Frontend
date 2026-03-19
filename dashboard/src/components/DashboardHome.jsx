export default function DashboardHome() {
  return (
    <main className="p-6 bg-white min-h-screen space-y-6 font-sans">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px] rounded-lg shadow p-5 flex items-center gap-4 bg-[#e6ecfb] hover:shadow-lg transition">
          <span className="text-2xl">👨‍🎓</span>
          <div>
            <p className="text-sm font-medium text-blue-700 uppercase">Total Students</p>
            <h3 className="text-3xl font-bold text-blue-800">1,250</h3>
          </div>
        </div>

        <div className="flex-1 min-w-[150px] rounded-lg shadow p-5 flex items-center gap-4 bg-green-200 hover:shadow-lg transition">
          <span className="text-2xl">🧑‍🏫</span>
          <div>
            <p className="text-sm font-medium text-green-700 uppercase">Total Staff</p>
            <h3 className="text-3xl font-bold text-green-800">75</h3>
          </div>
        </div>

        <div className="flex-1 min-w-[150px] rounded-lg shadow p-5 flex items-center gap-4 bg-[#fdecdf] hover:shadow-lg transition">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-sm font-medium text-yellow-700 uppercase">Fees Collected</p>
            <h3 className="text-3xl font-bold text-yellow-800">$45,200</h3>
          </div>
        </div>

        <div className="flex-1 min-w-[150px] rounded-lg shadow p-5 flex items-center gap-4 bg-[#fef3d7] hover:shadow-lg transition">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-red-700 uppercase">Pending Fees</p>
            <h3 className="text-3xl font-bold text-red-800">$8,400</h3>
          </div>
        </div>

        <div className="flex-1 min-w-[150px] rounded-lg shadow p-5 flex items-center gap-4 bg-purple-100 hover:shadow-lg transition">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-medium text-purple-700 uppercase">New Applications</p>
            <h3 className="text-3xl font-bold text-purple-800">23</h3>
          </div>
        </div>

      </div>

      {/* ===== QUICK REPORTS + NOTICES ===== */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Quick Reports */}
      <div className="flex-1 bg-white rounded-lg shadow p-5">
  <h2 className="font-semibold text-xl mb-4 text-gray-800">Quick Reports</h2>

  <div className="flex flex-wrap gap-4">
    <div className="w-[45%] border rounded-lg p-4 hover:shadow cursor-pointer transition bg-gray-50 flex items-center gap-2">
      <span className="text-xl">👨‍🎓</span>
      <p className="font-medium text-gray-700">Student List</p>
    </div>
    <div className="w-[45%] border rounded-lg p-4 hover:shadow cursor-pointer transition bg-gray-50 flex items-center gap-2">
      <span className="text-xl">🧑‍🏫</span>
      <p className="font-medium text-gray-700">Staff List</p>
    </div>
    <div className="w-[45%] border rounded-lg p-4 hover:shadow cursor-pointer transition bg-gray-50 flex items-center gap-2">
      <span className="text-xl">📋</span>
      <p className="font-medium text-gray-700">Attendance Report</p>
    </div>
    <div className="w-[45%] border rounded-lg p-4 hover:shadow cursor-pointer transition bg-gray-50 flex items-center gap-2">
      <span className="text-xl">💰</span>
      <p className="font-medium text-gray-700">Finance Report</p>
    </div>
  </div>
</div>


        {/* Recent Notices */}
        <div className="w-full lg:w-1/3 rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-gray-800">Recent Notices</h2>
            <span className="text-sm text-blue-500 cursor-pointer font-medium">View All</span>
          </div>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Holidays Announcement</span>
              <span className="text-xs text-gray-400">April 22, 2024</span>
            </li>
            <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Reminder for Fee Payment</span>
              <span className="text-xs text-gray-400">April 22, 2024</span>
            </li>
            <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Semester Exam Schedule</span>
              <span className="text-xs text-gray-400">April 20, 2024</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== FEE SUMMARY + STAFF OVERVIEW ===== */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white">
        <div className="flex-1 bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-800">Fee Summary</h2>
            <span className="text-sm text-blue-500 cursor-pointer font-medium">View Details</span>
          </div>
          <ul className="space-y-4 text-sm text-gray-600 bg-[#fcfcfe]">
            <li className="p-2 rounded hover:bg-gray-50 font-medium text-gray-700">Fee Any Time</li>
             <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Holidays Announcement</span>
              <span className="text-xs text-gray-400">April 22, 2024</span>
            </li>
            <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Reminder for Fee Payment</span>
              <span className="text-xs text-gray-400">April 22, 2024</span>
            </li>
            <li className="flex justify-between p-2 rounded hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">Semester Exam Schedule</span>
              <span className="text-xs text-gray-400">April 20, 2024</span>
            </li>
          </ul>
        </div>

      
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <div className="flex justify-between w-full mb-4">
            <h2 className="font-bold text-xl text-gray-800">Staff Overview</h2>
            <span className="text-sm text-blue-500 cursor-pointer font-medium">Manage Staff</span>
          </div>

       
          <div className="relative w-40 h-40 mb-6">
            <div
              className="w-40 h-40 rounded-full"
              style={{
                background: `conic-gradient(
                  #3b82f6 0% 50%,
                  #facc15 50% 70%,
                  #ef4444 70% 100%
                )`,
              }}
            ></div>
            <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full flex flex-col items-center justify-center text-gray-800">
              <span className="text-xl font-extrabold">100%</span>
              <span className="text-sm text-gray-400 mt-1">Total Staff</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></span>
                  <span className="font-medium text-gray-700">Paid</span>
                </span>
                <span className="font-medium text-gray-700">$45,200</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: "50%", backgroundColor: "#3b82f6" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#facc15" }}></span>
                  <span className="font-medium text-gray-700">Pending</span>
                </span>
                <span className="font-medium text-gray-700">$8,400</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: "20%", backgroundColor: "#facc15" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }}></span>
                  <span className="font-medium text-gray-700">Other</span>
                </span>
                <span className="font-medium text-gray-700">$8,400</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: "30%", backgroundColor: "#ef4444" }}></div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
