import { useState } from "react"
import { Heart, ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import Cookies from "js-cookie"
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("Home")
  const [searchQuery, setSearchQuery] = useState("")
  const [login, setLogin] = useState(() => Cookies.get("Jwt_token") !== undefined)
  const navItems = ["Home", "Shop", "About Us", "Contact"]
  const handleLogout = ()=>{
    Cookies.remove("Jwt_token")
    setLogin(false)
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // You can plug this into your search page / route
    console.log("Search for:", searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">

      <div className=" mx-10 px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20">
          <div className="flex w-[50%]">
              {/* Logo */}
              <div className="flex items-center gap-2  mr-10 shrink-0">
              <div className="w-9 h-9 bg-black rounded-xl bg-primary/10 flex items-center justify-center">
                <div><span className="text-lg  w-20 h-10 font-bold text-white">S</span></div>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                <span className="text-primary">Shop</span>
                <span className="text-foreground">Easy</span>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative flex shadow-sm rounded-xl overflow-hidden border border-border bg-muted/60">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full px-4 py-2.5 bg-transparent text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                </button>
              </form>
            </div>

          </div>
         
          <div className="flex gap-2">
               {/* Navigation Menu */}
            <nav className="flex gap-10 lg:gap-8 text-sm font-medium ml-5 mr-10">
                {navItems.map((item) => {
                  const path =
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <NavLink
                      key={item}
                      to={path}
                      onClick={() => setActiveNav(item)}
                      className={({isActive}) => `flex items-center justify-start px-2 py-1  text-[#000000] hover:bg-[#000000]  hover:text-white rounded ${isActive ? 'bg-[#000000] text-white' : ''}`}
                    >
                      {item}

                      {activeNav === item && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
                      )}
                    </NavLink>
                  );
                })}
            </nav>

            {/* Icons */}
            <div className="flex items-end gap-3 lg:gap-4 ml-10">
              <button
                className="relative p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
              </button>

              <button
                className="relative p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                  9+
                </span>
              </button>

              <div className="flex items-end gap-3 lg:gap-4 ml-10">

                  {login ? (
                    // LOGOUT BUTTON
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-full border border-border hover:bg-muted transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden lg:inline">Logout</span>
                      </button>
                    ) : (
                      // LOGIN LINK
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 cursor-pointer py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span className="hidden lg:inline">Login</span>
                      </Link>
                    )}

                  </div>

            </div>
          </div>
          
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-base font-bold text-primary">S</span>
            </div>
            <h1 className="text-lg font-bold text-primary">ShopEasy</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Cart Icon on mobile */}
            <button
              className="relative p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                2
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-2 mb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex rounded-xl overflow-hidden border border-border bg-muted/60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 bg-transparent text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-in slide-in-from-top duration-150">
            <nav className="flex flex-col gap-1 pt-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item)
                    setIsMenuOpen(false)
                  }}
                  className={`flex justify-between items-center px-1 py-2 text-sm rounded-lg transition-colors ${
                    activeNav === item
                      ? "text-primary bg-muted"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/60"
                  }`}
                >
                  <span>{item}</span>
                  {activeNav === item && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile actions */}
            <div className="flex items-center gap-4 mt-4">
              <button
                className="relative p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Account"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
