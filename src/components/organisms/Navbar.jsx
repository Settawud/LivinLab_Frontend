import Container from "../layout/Container";
import Input from "../atoms/Input";
import NavUserMenu from "./NavUserMenu"; // <— new
import { useContext, useEffect, useMemo, useState } from "react";
import { ValueContext } from "../../context/ValueContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const { cartCount, isAuth, user, logout } = useContext(ValueContext) || { cartCount: 0 };
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const isAuth = true; // now comes from context

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // close mobile menu on route change
    setOpen(false);
  }, [location.pathname, location.search]);

  const isActive = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    const base = cat ? String(cat).split("(")[0] : null;
    return (key) => location.pathname === "/products" && base === key;
  }, [location.pathname, location.search]);

  const mapCategoryAlias = (raw) => {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return null;
    // normalize spaces and dashes
    const n = q.replace(/\s+/g, " ").replace(/-/g, " ").trim();
    const inSet = (arr) => arr.some((w) => n === w || n.includes(w));
    if (inSet(["เก้าอี้", "เก้าอี้เพื่อสุขภาพ", "chair", "chairs", "ergonomic chair", "ergonomic chairs"])) return "Chairs(เก้าอี้)";
    if (inSet(["โต๊ะ", "โต๊ะยืน", "standing desk", "standing desks", "table", "tables", "desk", "desks"])) return "Tables(โต๊ะ)";
    if (inSet(["อุปกรณ์", "อุปกรณ์เสริม", "accessory", "accessories"])) return "Accessories(อุปกรณ์เสริม)";
    return null;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-stone-200 ${
        location.pathname === "/" && !scrolled ? "bg-transparent" : "bg-white/90 shadow-sm"
      } backdrop-blur font-ibm-thai`}
    >
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold"><img src="/images/logoCutBackground.webp" alt="logo image" width="56" height="56"/></Link>
          <Link to="/" className="font-semibold text-[#49453A]">Livin’ Lab</Link>
          <nav className="hidden md:flex gap-1 text-stone-700">
            <Link to="/products?category=Chairs(เก้าอี้)" className={`px-3 py-2 rounded-xl hover:bg-stone-900/5 ${isActive("Chairs") ? "text-stone-900 bg-stone-900/5" : ""}`}>Ergonomic Chairs</Link>
            <Link to="/products?category=Tables(โต๊ะ)" className={`px-3 py-2 rounded-xl hover:bg-stone-900/5 ${isActive("Tables") ? "text-stone-900 bg-stone-900/5" : ""}`}>Standing Desks</Link>
            <Link to="/products?category=Accessories(อุปกรณ์เสริม)" className={`px-3 py-2 rounded-xl hover:bg-stone-900/5 ${isActive("Accessories") ? "text-stone-900 bg-stone-900/5" : ""}`}>Accessories</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form
            className="hidden sm:block"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              const mapped = mapCategoryAlias(q);
              if (mapped) {
                navigate(`/products?category=${encodeURIComponent(mapped)}`);
              } else {
                navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
              }
            }}
          >
            <Input
              placeholder="Search products"
              className="w-64"
              left={<Search className="w-4 h-4 text-stone-400" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-stone-900/5"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {isAuth ? (
            <NavUserMenu
              user={user || { name: "User" }}
              onLogout={() => {
                logout?.();
                navigate("/");
              }}
            />
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-stone-900/5"
                aria-label="Sign in"
                title="Sign in"
              >
                <LogIn className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-stone-900/5"
                aria-label="Register"
                title="Register"
              >
                <UserPlus className="w-5 h-5" />
              </Link>
            </div>
          )}
          <button
            type="button"
            aria-label="cart"
            title="Cart"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-stone-900/5"
            onClick={() => navigate(isAuth ? "/cart" : "/login")}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs font-semibold flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </Container>
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white/90 backdrop-blur">
          <Container className="py-2">
            <nav className="grid gap-1 text-stone-700">
              <Link to="/products?category=Chairs(เก้าอี้)" className={`px-3 py-2 rounded-lg hover:bg-stone-900/5 ${isActive("Chairs") ? "text-stone-900 bg-stone-900/5" : ""}`}>Ergonomic Chairs</Link>
              <Link to="/products?category=Tables(โต๊ะ)" className={`px-3 py-2 rounded-lg hover:bg-stone-900/5 ${isActive("Tables") ? "text-stone-900 bg-stone-900/5" : ""}`}>Standing Desks</Link>
              <Link to="/products?category=Accessories(อุปกรณ์เสริม)" className={`px-3 py-2 rounded-lg hover:bg-stone-900/5 ${isActive("Accessories") ? "text-stone-900 bg-stone-900/5" : ""}`}>Accessories</Link>
              <form
                className="mt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = query.trim();
                  const mapped = mapCategoryAlias(q);
                  if (mapped) {
                    navigate(`/products?category=${encodeURIComponent(mapped)}`);
                  } else {
                    navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
                  }
                }}
              >
                <Input
                  placeholder="Search products"
                  className="w-full"
                  left={<Search className="w-4 h-4 text-stone-400" />}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
