import React from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { useChartData } from "@/Utils/Hooks/useChart";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

const Dashboard = () => {
  const { data = {}, isLoading } = useChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 text-lg animate-pulse">Memuat data dashboard...</div>
    </div>
  );

  const totalMahasiswa = students.reduce((a, b) => a + b.count, 0);
  const totalDosen = lecturerRanks.reduce((a, b) => a + b.count, 0);
  const lastRegistration = registrations[registrations.length - 1]?.total || 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Ringkasan data akademik universitas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-500">Total Mahasiswa</p>
          <p className="text-3xl font-bold text-indigo-600">{totalMahasiswa.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Dosen</p>
          <p className="text-3xl font-bold text-green-600">{totalDosen.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <p className="text-sm text-gray-500">Pendaftar Terakhir</p>
          <p className="text-3xl font-bold text-amber-600">{lastRegistration.toLocaleString()}</p>
        </div>
      </div>

      {/* Row 1: Bar + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BarChart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Mahasiswa per Fakultas</h2>
          <p className="text-xs text-gray-400 mb-4">Distribusi jumlah mahasiswa aktif</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={students} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="faculty" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                cursor={{ fill: "#f3f4f6" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {students.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Rasio Gender Mahasiswa</h2>
          <p className="text-xs text-gray-400 mb-4">Perbandingan mahasiswa laki-laki dan perempuan</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={genderRatio}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={4}
                label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {genderRatio.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Row 2: Line + Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LineChart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Tren Pendaftaran Mahasiswa</h2>
          <p className="text-xs text-gray-400 mb-4">Jumlah pendaftar baru per tahun</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#22c55e" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AreaChart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Pangkat Dosen</h2>
          <p className="text-xs text-gray-400 mb-4">Jumlah dosen berdasarkan jenjang akademik</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={lecturerRanks}>
              <defs>
                <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="rank" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorLecturer)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Row 3: Radar full width */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Distribusi Nilai per Jurusan</h2>
        <p className="text-xs text-gray-400 mb-4">Sebaran nilai A, B, dan C untuk setiap program studi</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={gradeDistribution}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Radar name="Nilai A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            <Radar name="Nilai B" dataKey="B" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
            <Radar name="Nilai C" dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            <Legend />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;