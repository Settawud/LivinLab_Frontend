import { useState, useEffect, useContext } from "react";
import { Menu, LogOut, User, MapPin, Wallet, TicketPercent, PlusCircle, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { ValueContext } from "../../context/ValueContext";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showContent, setShowContent] = useState(true);
 
  const navigate = useNavigate();
  const {isAdmin} = useContext(ValueContext)

  const handleNavigateAndScroll = (id, path = "/userprofile") => {
    if (location.pathname === path) {

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setIsMobileOpen(false);
    } else {
      navigate(`${path}#${id}`);
      setIsMobileOpen(false);
    }
  };

  // Handle ESC key to close sidebar on mobile
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);


  // Delay rendering content until collapse animation is done
  useEffect(() => {
    let timeoutId;

    if (isCollapsed) {
      setShowContent(false); // Hide immediately
    } else {
      timeoutId = setTimeout(() => {
        setShowContent(true); // Show after animation
      }, 300); // 300ms = same as transition duration
    }

    return () => clearTimeout(timeoutId);
  }, [isCollapsed]);

  // Sidebar class
  const sidebarClass = `
    top-16 left-0 z-40 h-[calc(100vh-64px)] p-6 bg-[#B29675] transition-all duration-300 fixed
    ${isMobileOpen ? "translate-x-0" : "translate-x-[-100%]"}
    ${isCollapsed ? "w-20" : "w-64"}
    flex flex-col
    lg:translate-x-0 lg:sticky lg:top-16
  `;

  // Label visibility
  const sidebarLabelClass = `${isCollapsed || !showContent ? "hidden" : ""} sidebar-label`;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 text-[#B29675]"
        >
          <Menu className="h-6 w-6" />
          <span className="font-semibold">My Account</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={sidebarClass}>
        <div className={`flex flex-col h-full w-full ${isCollapsed ? "items-center" : "items-start"}`}>
          
          {/* Header */}
          <div className={`mb-6 flex ${isCollapsed ? "justify-center" : "justify-between"} items-center w-full text-base font-bold text-white`}>
            {!isCollapsed && showContent && (
              <span className="flex items-center gap-2">
                My Account
              </span>
            )}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex items-center">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mb-6 flex flex-col gap-4 text-sm text-white w-full">
            {[
              { label: "Profile", icon: <User className="w-4 h-4" />, onClick: () => handleNavigateAndScroll("profile") },
              { label: "Address", icon: <MapPin className="w-4 h-4" />, onClick: () => handleNavigateAndScroll("address") },
              { label: "Coupons", icon: <TicketPercent className="w-4 h-4" />, onClick: () => handleNavigateAndScroll("coupons") },
              ...(isAdmin ? [
                { label: "Product Management", icon: <Store className="w-4 h-4" />, onClick: () => navigate("/adminproductmanagement") },
                { label: "Add Coupon", icon: <TicketPercent className="w-4 h-4" />, onClick: () => handleNavigateAndScroll("create-coupon") },
              ] : []),
              { label: "Order History", icon: <Wallet className="w-4 h-4" />, onClick: () => navigate("/orderhistory") },
            ].map(({ label, icon, onClick }) => (
              <button
                type="button"
                key={label}
                onClick={onClick}
                className={`
                  flex items-center rounded py-2 hover:bg-[#A8A8A880] cursor-pointer w-full text-left
                  ${isCollapsed ? "justify-center" : "justify-start gap-2 indent-4"}
                `}
              >
                {icon}
                {!isCollapsed && showContent && <span className="sidebar-label">{label}</span>}
              </button>
            ))}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;