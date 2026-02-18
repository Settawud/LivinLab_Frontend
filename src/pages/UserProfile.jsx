import ProfileData from "../components/organisms/ProfileData";
import UserAddress from "../components/organisms/UserAddress";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import UserCoupon from "../components/molecules/UserCoupon";
import CouponCreateForm from "../components/molecules/CouponCreateForm";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/organisms/Sidebar";
import { api } from "../lib/api";
import { ValueContext } from "../context/ValueContext";
import { useLocation } from "react-router-dom";

export default function UserProfile() {
  const [couponRefreshKey, setCouponRefreshKey] = useState(0);
  const {setIsAdmin, isAdmin} = useContext(ValueContext)

  const location = useLocation();

    useEffect(() => {
      if (location.hash) {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      }
    }, [location]);

    useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        const role = data?.user?.role || data?.role;
        setIsAdmin(role === "admin");
      } catch {
      }
    })();
    }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f1]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <ProfileData />
            <UserAddress />
            {isAdmin && <CouponCreateForm onCreated={() => setCouponRefreshKey((k)=>k+1)} />}
            
            <UserCoupon refreshKey={couponRefreshKey} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

