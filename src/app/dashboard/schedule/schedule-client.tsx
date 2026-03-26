"use client";

import { useState } from "react";
import { Plus, X, Trash2, Save, ChevronLeft, ChevronRight } from "lucide-react";
import {
  saveBusinessHours,
  createShift,
  deleteShift,
  setStaffShift,
  addAbsence,
  removeAbsence,
  getMonthlyReport,
} from "@/lib/actions/schedule";

type Hour = { id?: string; day_of_week: number; is_open: boolean; open_time: string; close_time: string };
type Shift = { id: string; name: string; start_time: string; end_time: string; color: string };
type StaffMember = { id: string; name: string; color: string; role: string };
type Schedule = { id: string; staff_id: string; day_of_week: number; shift_id: string };
type Absence = { id: string; staff_id: string; date: string; type: string; notes: string | null; staff?: { name: string } };
type Report = { id: string; name: string; scheduledDays: number; worked: number; leave: number; sick: number; absent: number };

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleClient({
  initialHours,
  initialShifts,
  staffList,
  initialSchedules,
  initialAbsences,
}: {
  initialHours: Hour[];
  initialShifts: Shift[];
  staffList: StaffMember[];
  initialSchedules: Schedule[];
  initialAbsences: Absence[];
}) {
  const [tab, setTabState] = useState<"hours" | "shifts" | "schedule" | "absences" | "report">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("tab");
      if (t === "schedule" || t === "absences" || t === "report" || t === "hours") return t;
    }
    return "hours";
  });

  function setTab(t: typeof tab) {
    setTabState(t);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState({}, "", url.toString());
  }

  function reloadWithTab() {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.location.href = url.toString();
  }
  const [hours, setHours] = useState<Hour[]>(() => {
    if (initialHours.length === 7) return initialHours;
    return Array.from({ length: 7 }, (_, i) => {
      const existing = initialHours.find((h) => h.day_of_week === i);
      return existing || { day_of_week: i, is_open: i > 0 && i < 6, open_time: "09:00", close_time: "18:00" };
    });
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [reportData, setReportData] = useState<Report[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);

  // ─── Spa Timings Tab ───
  function renderHours() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Opening Hours</h2>
            <p className="text-sm text-gray-500">Set your spa&apos;s operating hours for each day</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {hours.map((h, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <span className="w-24 text-sm font-medium">{dayNames[h.day_of_week]}</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={h.is_open}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[i] = { ...updated[i], is_open: e.target.checked };
                    setHours(updated);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600"
                />
                <span className="text-sm text-gray-600">{h.is_open ? "Open" : "Closed"}</span>
              </label>
              {h.is_open && (
                <>
                  <input
                    type="time"
                    value={h.open_time}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[i] = { ...updated[i], open_time: e.target.value };
                      setHours(updated);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={h.close_time}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[i] = { ...updated[i], close_time: e.target.value };
                      setHours(updated);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={async () => {
            setSaving(true);
            await saveBusinessHours(hours);
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="mt-4 flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Hours"}
        </button>

        {/* Shifts section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Shift Definitions</h2>
              <p className="text-sm text-gray-500">Define the shifts your staff can work</p>
            </div>
            <button onClick={() => setShowShiftModal(true)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">
              <Plus className="h-4 w-4" /> Add Shift
            </button>
          </div>
          {initialShifts.length === 0 ? (
            <p className="text-sm text-gray-400">No shifts defined yet. Add your first shift above.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {initialShifts.map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.start_time.slice(0, 5)} — {s.end_time.slice(0, 5)}</p>
                  </div>
                  <button onClick={async () => { await deleteShift(s.id); reloadWithTab(); }} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Staff Schedule Tab ───
  function renderSchedule() {
    return (
      <div>
        <h2 className="text-lg font-bold mb-1">Staff Schedule</h2>
        <p className="text-sm text-gray-500 mb-4">Assign shifts to each staff member per day of the week</p>
        {initialShifts.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            Please define shifts in the &quot;Spa Timings&quot; tab first.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 sticky left-0 bg-gray-50">Staff</th>
                  {dayNamesShort.map((d) => (
                    <th key={d} className="text-center px-2 py-3 font-medium text-gray-600 min-w-[100px]">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {staffList.filter((s) => ["therapist", "manager", "owner"].includes(s.role)).map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white">{staff.name}</td>
                    {Array.from({ length: 7 }, (_, dow) => {
                      const current = initialSchedules.find(
                        (s) => s.staff_id === staff.id && s.day_of_week === dow
                      );
                      return (
                        <td key={dow} className="px-2 py-2">
                          <select
                            value={current?.shift_id || ""}
                            onChange={async (e) => {
                              await setStaffShift(staff.id, dow, e.target.value || null);
                              reloadWithTab();
                            }}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                          >
                            <option value="">Off</option>
                            {initialShifts.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ─── Absences Tab ───
  function renderAbsences() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Leave & Absences</h2>
            <p className="text-sm text-gray-500">Block days for leave, sickness, or other absences</p>
          </div>
          <button onClick={() => setShowAbsenceModal(true)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">
            <Plus className="h-4 w-4" /> Add Absence
          </button>
        </div>
        {initialAbsences.length === 0 ? (
          <p className="text-sm text-gray-400">No absences recorded.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Staff</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Notes</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {initialAbsences.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{(a.staff as unknown as { name: string })?.name || "-"}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(a.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        a.type === "leave" ? "bg-blue-100 text-blue-700" :
                        a.type === "sick" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{a.type}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{a.notes || "-"}</td>
                    <td className="px-3 py-3">
                      <button onClick={async () => { await removeAbsence(a.id); reloadWithTab(); }} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ─── Report Tab ───
  function renderReport() {
    return (
      <div>
        <h2 className="text-lg font-bold mb-1">Monthly Report</h2>
        <p className="text-sm text-gray-500 mb-4">Overview of days worked, leave, sick, and absences per staff member</p>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => {
              const [y, m] = reportMonth.split("-").map(Number);
              const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
              setReportMonth(prev);
            }}
            className="p-1.5 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={() => {
              const [y, m] = reportMonth.split("-").map(Number);
              const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
              setReportMonth(next);
            }}
            className="p-1.5 rounded hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={async () => {
              setLoadingReport(true);
              const data = await getMonthlyReport(reportMonth);
              setReportData(data);
              setLoadingReport(false);
            }}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700"
          >
            {loadingReport ? "Loading..." : "Generate Report"}
          </button>
        </div>
        {reportData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Staff</th>
                  <th className="text-center px-5 py-3 font-medium text-gray-600">Scheduled</th>
                  <th className="text-center px-5 py-3 font-medium text-green-600">Worked</th>
                  <th className="text-center px-5 py-3 font-medium text-blue-600">Leave</th>
                  <th className="text-center px-5 py-3 font-medium text-red-600">Sick</th>
                  <th className="text-center px-5 py-3 font-medium text-amber-600">Absent</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reportData.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 font-medium">{r.name}</td>
                    <td className="px-5 py-3 text-center">{r.scheduledDays}</td>
                    <td className="px-5 py-3 text-center font-semibold text-green-700">{r.worked}</td>
                    <td className="px-5 py-3 text-center">
                      {r.leave > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{r.leave}</span>}
                      {r.leave === 0 && <span className="text-gray-300">0</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {r.sick > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">{r.sick}</span>}
                      {r.sick === 0 && <span className="text-gray-300">0</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {r.absent > 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">{r.absent}</span>}
                      {r.absent === 0 && <span className="text-gray-300">0</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const tabs = [
    { key: "hours", label: "Spa Timings" },
    { key: "schedule", label: "Staff Schedule" },
    { key: "absences", label: "Absences" },
    { key: "report", label: "Report" },
  ] as const;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">Manage timings, shifts, and staff availability</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${
              tab === t.key ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}

      {tab === "hours" && renderHours()}
      {tab === "schedule" && renderSchedule()}
      {tab === "absences" && renderAbsences()}
      {tab === "report" && renderReport()}

      {/* Add Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add Shift</h2>
              <button onClick={() => setShowShiftModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form action={async (formData) => {
              setError(null);
              const result = await createShift(formData);
              if (result?.error) { setError(result.error); }
              else { setShowShiftModal(false); reloadWithTab(); }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
                <input name="name" type="text" required placeholder="e.g. Morning" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <input name="start_time" type="time" required defaultValue="09:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <input name="end_time" type="time" required defaultValue="14:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <input type="hidden" name="color" value="#7c3aed" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowShiftModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">Add Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Absence Modal */}
      {showAbsenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add Absence</h2>
              <button onClick={() => setShowAbsenceModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form action={async (formData) => {
              setError(null);
              const result = await addAbsence(
                formData.get("staff_id") as string,
                formData.get("date") as string,
                formData.get("type") as string,
                formData.get("notes") as string,
              );
              if (result?.error) { setError(result.error); }
              else { setShowAbsenceModal(false); reloadWithTab(); }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                <select name="staff_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">Select staff...</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input name="date" type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="leave">Leave</option>
                  <option value="sick">Sick</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input name="notes" type="text" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAbsenceModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">Add Absence</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
