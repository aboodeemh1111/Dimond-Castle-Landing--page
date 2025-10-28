export default function Footer() {
  return (
    <footer id="footer" className="relative mt-20">
      {/* Background gradient + subtle pattern */}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-100 via-white to-white" aria-hidden>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-morphism bg-white/60 border border-white/40 shadow-xl rounded-3xl px-6 sm:px-10 py-8 sm:py-10">
            {/* Top content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3">
                  <svg className="h-7 w-7 text-gray-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L22 9L12 22L2 9L12 2Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M12 2L22 9L12 22L2 9L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 2V22M2 9H22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  </svg>
                  <p className="text-lg font-semibold tracking-tight text-gray-900">Diamond Castle</p>
                </div>
                <p className="mt-3 text-sm text-gray-600 max-w-xs">
                  Premium “White Diamond” rice — sourced, processed, and delivered with perfection across KSA.
                </p>
              </div>

              {/* Reach us directly */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reach us directly</h3>
                <p className="text-sm text-gray-600 mt-1">Prefer not to use the form? Use any option below.</p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="mailto:info@alsanadgroup.com"
                      className="group inline-flex items-center gap-3 text-gray-800 hover:text-gray-900"
                      aria-label="Email info@alsanadgroup.com"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 border border-gray-200 shadow-sm group-hover:shadow transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                          <path strokeWidth="1.5" d="M4 6h16v12H4z" />
                          <path strokeWidth="1.5" d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">info@alsanadgroup.com</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+966503992995"
                      className="group inline-flex items-center gap-3 text-gray-800 hover:text-gray-900"
                      aria-label="Call +966503992995"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 border border-gray-200 shadow-sm group-hover:shadow transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                          <path strokeWidth="1.5" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C10.85 22 2 13.15 2 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium">+966503992995</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Social</h3>
                <p className="text-sm text-gray-600 mt-1">Follow “White Diamond” for updates.</p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://x.com/wh_1diamond"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter) @wh_1diamond"
                    className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-200 shadow-sm hover:shadow transition-all text-gray-800 hover:text-gray-900"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                      <path d="M18.244 2H21l-6.56 7.49L22 22h-6.828l-5.34-6.992L3.6 22H1l7.09-8.088L2 2h6.828l4.82 6.42L18.244 2zm-2.392 18h1.763L8.24 4h-1.8l9.412 16z" />
                    </svg>
                    <span className="text-sm font-medium">@wh_1diamond</span>
                  </a>
                  <a
                    href="https://instagram.com/wh_1diamond"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram @wh_1diamond"
                    className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-200 shadow-sm hover:shadow transition-all text-gray-800 hover:text-gray-900"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.8a1 1 0 110 2 1 1 0 010-2z" />
                    </svg>
                    <span className="text-sm font-medium">@wh_1diamond</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-white/60" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
              <p>© {new Date().getFullYear()} Diamond Castle Trading Company. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#home" className="hover:text-gray-900">Back to top</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}


