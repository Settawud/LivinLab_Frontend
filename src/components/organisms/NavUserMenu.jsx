import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User, MapPin, ShoppingBag, CreditCard, LogOut, Wallet, Store } from "lucide-react";
import { ValueContext } from "../../context/ValueContext";

function Icon({ children }) {
  return <span className="inline-flex h-5 w-5 items-center justify-center">{children}</span>;
}

export default function NavUserMenu({
  user = { name: "Guest" },
  onLogout = () => {}
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const {isAdmin} = useContext(ValueContext)

  // ปิดเมื่อคลิกนอก/กด Esc
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* ปุ่มโปรไฟล์ */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 text-sm shadow-sm hover:bg-stone-50"
      >
        <span className="h-6 w-6 rounded-full bg-stone-300/80 grid place-items-center">
          <User className="h-4 w-4 text-stone-700" />
        </span>
        <span className="hidden sm:block max-w-[8rem] truncate text-stone-800">{user?.name}</span>
        <svg width="16" height="16" viewBox="0 0 20 20" className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {/* เมนูเด้งลง */}
      <div
        ref={menuRef}
        role="menu"
        className={`absolute right-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white/95 backdrop-blur shadow-xl
          ring-1 ring-black/5 p-2 origin-top-right transition
          ${open ? "scale-100 opacity-100 translate-y-0" : "pointer-events-none scale-95 opacity-0 -translate-y-1"}
        `}
      >
        <ul className="space-y-1 text-slate-700">
          <li>
            <Link to="/userprofile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100" role="menuitem">
              <Icon><User className="w-4 h-4" /></Icon> <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/orderhistory" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100" role="menuitem">
              <Icon><Wallet className="w-4 h-4" /></Icon> <span>Order History</span>
            </Link>
          </li>
          {isAdmin && <li>
            <Link to="/adminproductmanagement" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100" role="menuitem">
              <Icon><Store className="w-4 h-4" /></Icon> <span>Product Management</span>
            </Link>
          </li>}
          {/* <li>
            <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100" role="menuitem">
              <Icon><ShoppingBag className="w-4 h-4" /></Icon> <span>Cart</span>
            </Link>
          </li>
          <li>
            <Link to="/checkout" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100" role="menuitem">
              <Icon><CreditCard className="w-4 h-4" /></Icon> <span>Checkout</span>
            </Link>
          </li> */}

          <li className="my-1 border-t border-stone-200" />
          <li>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-stone-100"
              role="menuitem"
            >
              <Icon><LogOut className="w-4 h-4" /></Icon> <span>Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
