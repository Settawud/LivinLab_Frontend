import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import AuthCard from "../../components/organisms/AuthCard";
import FormField from "../../components/molecules/FormField";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { ValueContext } from "../../context/ValueContext";
import { toast } from "sonner";
import { post } from "../../lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(ValueContext) || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const emailError = useMemo(() => {
    if (!attempted) return "";
    const ok = /.+@.+\..+/.test(email);
    return ok ? "" : "Invalid email";
  }, [email, attempted]);

  const passwordError = useMemo(() => {
    if (!attempted) return "";
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  }, [password, attempted]);

  const disabled = submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    setGeneralError("");

    const validEmail = /.+@.+\..+/.test(email);
    const validPass = password.length >= 6;
    if (!validEmail || !validPass) return;

    try {
      setSubmitting(true);
      const data = await post("/auth/login", { email, password });
      const name = data?.user?.name || email?.split("@")[0] || "User";
      login?.({ name, email, token: data?.token, role: data?.user?.role });
      toast.success("Signed in successfully");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password";
      setGeneralError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="py-16">
          <AuthCard title="Log In" footer={<p>Don’t have an account? <Link to="/register" className="underline">Register</Link></p>}>
            <form onSubmit={onSubmit} className="space-y-3">
              <FormField label="Email" error={emailError}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </FormField>
              <FormField label="Password" error={passwordError}>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" /> Remember me</label>
                <Link to="/forgot" className="underline">Forgot password?</Link>
              </div>
              {generalError && <div className="text-sm text-red-600">{generalError}</div>}
              <Button className="w-full mt-2" type="submit" disabled={disabled}>{submitting ? "Signing in..." : "Log In"}</Button>
            </form>
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
