import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import AuthCard from "../../components/organisms/AuthCard";
import FormField from "../../components/molecules/FormField";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import { useContext, useMemo, useState } from "react";
import { ValueContext } from "../../context/ValueContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { post } from "../../lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { login } = useContext(ValueContext) || {};
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE || ""; // e.g., http://localhost:4000/api/v1/mongo

  const emailError = useMemo(() => {
    if (!attempted) return "";
    return /.+@.+\..+/.test(email) ? "" : "Invalid email";
  }, [email, attempted]);

  const passwordError = useMemo(() => {
    if (!attempted) return "";
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  }, [password, attempted]);

  const confirmError = useMemo(() => {
    if (!attempted) return "";
    return confirm === password ? "" : "Passwords do not match";
  }, [confirm, password, attempted]);

  const disabled = submitting; // allow attempt to trigger field errors

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    setGeneralError("");
    if (!firstName || !lastName || !email || !password || !confirm) return;
    if (emailError || passwordError || confirmError) return;
    const fullName = `${firstName} ${lastName}`.trim() || (email?.split("@")[0] ?? "User");
    try {
      setSubmitting(true);
      if (API_BASE) {
        try {
          // 1) Register on backend
          await post("/auth/register", { firstName, lastName, email, password });

          // 2) Auto login to obtain token/session
          const dataLogin = await post("/auth/login", { email, password });
          const name = dataLogin?.user?.name || fullName;
          login?.({ name, email, token: dataLogin?.token });
          toast.success("Registered successfully");
          navigate("/");
        } catch (err) {
          const msg = err?.response?.data?.message || "Register failed";
          setGeneralError(msg);
          return;
        }
      } else {
        // Frontend-only fallback
        login?.({ name: fullName, email });
        toast.success("Registered successfully (mock)");
        navigate("/");
      }
    } catch (err) {
      setGeneralError(err.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
      <div className="py-16">
        <AuthCard title="Register">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="First Name">
                <Input placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              </FormField>
              <FormField label="Last Name">
                <Input placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              </FormField>
            </div>
            <FormField label="Email" error={emailError}>
              <Input type="email" placeholder="you@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </FormField>
            <FormField label="Password" error={passwordError}>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                minLength={6}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-stone-500 hover:text-stone-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </FormField>
            <FormField label="Confirm Password" error={confirmError}>
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                minLength={6}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-stone-500 hover:text-stone-700"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    title={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </FormField>
            {generalError && <div className="text-sm text-red-600">{generalError}</div>}
            <Button className="w-full mt-2" type="submit" disabled={disabled}>{submitting ? "Registering..." : "Register"}</Button>
          </form>
        </AuthCard>
      </div>
      </main>
      <Footer />
    </div>
  );
}
