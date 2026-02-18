import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import AuthCard from "../../components/organisms/AuthCard";
import FormField from "../../components/molecules/FormField";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { post } from "../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || ""; // e.g., http://localhost:4000/api/v1/mongo

  const emailError = useMemo(() => {
    if (!attempted) return "";
    return /.+@.+\..+/.test(email) ? "" : "Invalid email";
  }, [email, attempted]);

  // Allow submit to trigger validation feedback on first click
  const disabled = submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    const validEmail = /.+@.+\..+/.test(email);
    if (!validEmail) return;
    setMessage("");
    try {
      setSubmitting(true);
      // Try to call backend if available
      if (API_BASE) {
        try {
          await post("/auth/password/forgot", { email });
          toast.success("Reset link sent. Please check your email.");
          setMessage("We have sent a reset link to your email address.");
        } catch (err) {
          toast.error("Failed to submit request");
        }
      } else {
        // Graceful fallback if backend not available
        toast.success("Request submitted (mock).");
        setMessage("(Mock) Your request has been recorded. Please check your email.");
      }
    } catch (err) {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="py-16">
          <AuthCard title="Forgot Password">
            <form onSubmit={onSubmit} className="space-y-3">
              <FormField label="Enter your email" error={emailError}>
                <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" />
              </FormField>
              {message && <div className="text-sm text-green-600">{message}</div>}
              <Button className="w-full mt-2" type="submit" disabled={disabled}>{submitting ? "Sending..." : "Send reset link"}</Button>
            </form>
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
