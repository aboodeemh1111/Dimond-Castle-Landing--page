export default function Vision() {
  return (
    <section
      id="vision-mission-strategic-objectives"
      className="relative py-16 sm:py-24 bg-white"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[-10%] h-160 w-160 -translate-x-1/2 rounded-full bg-linear-to-tr from-gray-100 via-gray-50 to-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Vision, Mission & Strategic Objectives
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Since its establishment, Diamond Castle Trading Company has built
            its foundation on a clear purpose, strong values, and guiding
            principles that define its unique corporate culture. Throughout our
            history, our business has evolved and diversified, yet our core
            mission and values have remained constant — passed down and upheld
            by every new generation of our employees.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v5a1 1 0 00.553.894l3 1.5a1 1 0 10.894-1.788L13 11.382V7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Vision & Values
              </h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We operate strategically to enhance the lives of more consumers
              every day, uniting our efforts to achieve this goal in meaningful
              and practical ways. Our employees are driven to make a positive
              contribution daily, reflecting the company’s values and the
              behaviors that shape how we work together and with our partners.
              These principles guide the continuous evolution of how we conduct
              our business.
            </p>
          </article>

          {/* Card 2 */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a2 2 0 01-2 2h-1l-3 7H9L6 10H5a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                How We Operate
              </h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We operate strategically to enhance the lives of more consumers
              every day, uniting our efforts to achieve this goal in meaningful
              and practical ways. Our employees are driven to make a positive
              contribution daily, reflecting the company’s values and the
              behaviors that shape how we work together and with our partners.
              These principles guide the continuous evolution of how we conduct
              our business.
            </p>
          </article>

          {/* Card 3 */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Our Goal — Today and for the Future
              </h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To deliver high-quality, high-value products and services that
              improve the lives of consumers across the Kingdom of Saudi Arabia.
              Our success is reflected not only in strong sales and
              profitability but also in the value we create for our customers,
              shareholders, and local communities. Through this commitment, we
              ensure the continuity of our culture and values for generations to
              come.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
