import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ToastType } from "./Toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import gsap from "gsap";
import ShinyText from "./TextAnimations/ShinyText/ShinyText";
import LiquidEther from "./Backgrounds/LiquidEther/LiquidEther";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from "./Toast";

interface Submission {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  guest_count: string | null;
  message: string | null;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [authToken, setAuthToken] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    // Check if already authenticated
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      fetchSubmissions(token);
    }

    // Entrance animations
    gsap.fromTo(
      ".admin-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const token = data.token;
        setAuthToken(token);
        sessionStorage.setItem("adminToken", token);
        setIsAuthenticated(true);
        fetchSubmissions(token);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.log("Login failed. Please try again: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async (token: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissions(data.submissions);
      } else {
        console.log("Failed to fetch submissions");
      }
    } catch (err) {
      console.log("Error loading submissions: ", err);
    }
  };

  const handleDelete = async (id: number) => {
    setSubmissionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });

      if (response.ok) {
        setSubmissions(submissions.filter((s) => s.id !== submissionToDelete));
        if (selectedSubmission?.id === submissionToDelete) {
          setSelectedSubmission(null);
        }
        setShowDeleteModal(false);
        setSubmissionToDelete(null);
        setToast({
          message: "Submission deleted successfully",
          type: "success",
          isVisible: true,
        });
      } else {
        setToast({
          message: "Failed to delete submission",
          type: "error",
          isVisible: true,
        });
      }
    } catch (err) {
      setToast({
        message: `Error deleting submission: ${err}`,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSubmissionToDelete(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAuthToken("");
    setSubmissions([]);
    setUsername("");
    setPassword("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-yellow-900/10">
        <motion.header
          className="py-10 bg-yellow-500/5 backdrop-blur-lg border-b border-yellow-500 relative overflow-hidden"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
            <LiquidEther
              colors={["#ca8a04", "#eab308", "#fbbf24", "#fde047"]}
              mouseForce={20}
              cursorSize={100}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
              className="w-full h-full"
            />
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-yellow-200 no-underline font-normal ml-8 mb-10 py-3 px-6 rounded-md border border-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:-translate-x-1 hover:shadow-lg hover:shadow-yellow-500/20"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h1 className="text-5xl md:text-6xl font-light mb-4 text-yellow-500 text-center font-serif tracking-tight">
              <ShinyText
                text="Admin Login"
                disabled={false}
                speed={3}
                className="inline-block"
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto">
              Secure access to contact submissions
            </p>
          </div>
        </motion.header>

        <div className="flex items-center justify-center py-24 px-4">
          <motion.div
            className="admin-container w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/20 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-yellow-500 mb-6 text-center font-serif">
              Admin Access
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-white mb-2 text-sm font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-white mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-medium tracking-wide transition-all hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-yellow-900/10">
      <motion.header
        className="py-10 bg-yellow-500/5 backdrop-blur-lg border-b border-yellow-500 relative overflow-hidden top-0 z-40"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <LiquidEther
            colors={["#ca8a04", "#eab308", "#fbbf24", "#fde047"]}
            mouseForce={10}
            cursorSize={80}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.5}
            className="w-full h-full"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-yellow-500 font-serif tracking-tight">
              <ShinyText
                text="Admin Dashboard"
                disabled={false}
                speed={3}
                className="inline-block"
              />
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {submissions.length} total submission
              {submissions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 sm:flex-row sm:gap-8">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-yellow-200 py-3 px-6 rounded-md border border-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
            >
              <LogOut size={18} />
              Logout
            </button>
            <Link
              type="button"
              to={"/"}
              className="inline-flex items-center gap-2 text-yellow-200 py-3 px-6 rounded-md border border-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
            >
              <LogOut size={18} />
              Homepage
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-4">
            {submissions.length === 0 ? (
              <div className="p-12 bg-zinc-900/50 backdrop-blur-xl border border-yellow-500/10 rounded-xl text-center">
                <p className="text-gray-400 text-lg">No submissions yet</p>
              </div>
            ) : (
              submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  className={`p-6 bg-zinc-900/80 backdrop-blur-xl border rounded-xl cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id
                      ? "border-yellow-500/50 bg-zinc-900/90"
                      : "border-yellow-500/10 hover:border-yellow-500/30"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl text-yellow-400 font-medium mb-1">
                        {submission.full_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(submission.created_at)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full capitalize">
                      {submission.event_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={16} className="text-yellow-500" />
                      {submission.email}
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone size={16} className="text-yellow-500" />
                        {submission.phone}
                      </div>
                    )}
                    {submission.event_date && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar size={16} className="text-yellow-500" />
                        {new Date(submission.event_date).toLocaleDateString()}
                      </div>
                    )}
                    {submission.guest_count && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users size={16} className="text-yellow-500" />
                        {submission.guest_count} guests
                      </div>
                    )}
                  </div>

                  {submission.message && (
                    <div className="mt-4 pt-4 border-t border-yellow-500/10">
                      <div className="flex items-start gap-2">
                        <MessageSquare
                          size={16}
                          className="text-yellow-500 mt-1 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {submission.message}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {selectedSubmission ? (
                <motion.div
                  className="p-6 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/20 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl text-yellow-500 font-light mb-6 font-serif">
                    Submission Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <p className="text-white mt-1">
                        {selectedSubmission.full_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <p className="text-white mt-1">
                        {selectedSubmission.email}
                      </p>
                    </div>

                    {selectedSubmission.phone && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="text-white mt-1">
                          {selectedSubmission.phone}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Event Type
                      </label>
                      <p className="text-white mt-1 capitalize">
                        {selectedSubmission.event_type}
                      </p>
                    </div>

                    {selectedSubmission.event_date && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                          Event Date
                        </label>
                        <p className="text-white mt-1">
                          {new Date(
                            selectedSubmission.event_date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}

                    {selectedSubmission.guest_count && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                          Expected Guests
                        </label>
                        <p className="text-white mt-1">
                          {selectedSubmission.guest_count}
                        </p>
                      </div>
                    )}

                    {selectedSubmission.message && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                          Message
                        </label>
                        <p className="text-white mt-1 leading-relaxed">
                          {selectedSubmission.message}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Submitted On
                      </label>
                      <p className="text-white mt-1">
                        {formatDate(selectedSubmission.created_at)}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="w-full mt-8 py-3 px-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all hover:bg-red-500/20 hover:border-red-500/50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={18} />
                    Delete Submission
                  </motion.button>
                </motion.div>
              ) : (
                <div className="p-12 bg-zinc-900/50 backdrop-blur-xl border border-yellow-500/10 rounded-xl text-center">
                  <p className="text-gray-400">
                    Select a submission to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? All information including contact details and messages will be permanently removed."
        itemName={
          submissionToDelete
            ? submissions.find((s) => s.id === submissionToDelete)?.full_name
            : undefined
        }
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminPage;
