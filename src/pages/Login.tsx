import React, { useState } from "react";
import {
  Github,
  Chrome,
  Code2,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Login() {
  const { setView, loginState } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau password salah. Coba periksa kembali.";
      case "auth/email-already-in-use":
        return "Email ini sudah terdaftar. Silakan login.";
      case "auth/weak-password":
        return "Password terlalu pendek. Gunakan minimal 6 karakter.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/popup-closed-by-user":
        return "Login popup ditutup sebelum selesai.";
      default:
        return "Terjadi kesalahan saat otentikasi. Coba lagi.";
    }
  };

  const handleError = (err: any) => {
    setError(err.code ? getFriendlyErrorMessage(err.code) : err.message);
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      setView("home");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithub = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, githubProvider);
      setView("home");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setView("home");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Masukkan email kamu dulu untuk reset password.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
      alert("Email reset password telah dikirim. Cek inbox kamu.");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    loginState(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate p-8 rounded-3xl shadow-xl shadow-navy/5 dark:shadow-primary-blue/5 border border-gray-100 dark:border-gray-800 transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-purple rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-blue/30">
            <Code2 className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">
            Mulai perjalanan belajar coding kamu.
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Masuk untuk menyimpan progress dan melanjutkan misi harian.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 leading-snug">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-3.5 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 dark:bg-gray-800/50 rounded-xl transition-all text-navy dark:text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <Chrome className="w-5 h-5 mr-3 text-red-500" />
            )}
            Lanjutkan dengan Google
          </button>
          <button
            onClick={handleGithub}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-3.5 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 dark:bg-gray-800/50 rounded-xl transition-all text-navy dark:text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <Github className="w-5 h-5 mr-3" />
            )}
            Lanjutkan dengan GitHub
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 md:px-4 bg-white dark:bg-slate text-gray-500 font-medium tracking-wide">
              ATAU DENGAN EMAIL
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Masukkan email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-primary-blue dark:focus:border-primary-blue text-navy dark:text-white transition-colors"
          />
          <input
            type="password"
            placeholder="Silakan buat atau masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-primary-blue dark:focus:border-primary-blue text-navy dark:text-white transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-navy dark:bg-primary-blue text-white font-bold p-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-center flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              "Daftar Sekarang"
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0 mb-6">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-gray-500 hover:text-navy dark:hover:text-white font-medium transition-colors"
          >
            {isRegister
              ? "Sudah punya akun? Masuk"
              : "Belum punya akun? Daftar"}
          </button>
          {!isRegister && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary-blue hover:underline font-medium"
            >
              Lupa Password?
            </button>
          )}
        </div>

        <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={handleGuest}
            className="text-gray-500 dark:text-gray-400 font-bold text-sm hover:text-navy dark:hover:text-white hover:underline flex items-center justify-center w-full transition-colors"
          >
            Mulai Mode Guest <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Mode guest tidak akan menyimpan progress belajar kamu lama-lama.
          </p>
        </div>
      </div>
    </div>
  );
}
