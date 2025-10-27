import React from "react";

export default function Story() {
  return (
    <section id="introduction-and-story" className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Heading + Intro */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Introduction & Story
            </h2>
            <div className="mt-4 h-1 w-24 bg-gray-900/80 rounded" />
            <p className="mt-6 text-base sm:text-lg leading-8 text-gray-700">
              We are a company established in 2015 in the rice sector within the
              Kingdom of Saudi Arabia, driven by a clear vision to provide
              high-quality rice products that meet the needs of the local market
              and exceed consumer expectations.
            </p>
          </div>

          {/* Content Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* top accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500" />

              <div className="p-6 sm:p-8">
                <ul className="space-y-5 sm:space-y-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-gray-900" />
                    <p className="text-gray-700 text-base sm:text-lg leading-7">
                      Our company was founded on the belief that food is a
                      fundamental pillar of community life, and on our
                      commitment to contributing to the enhancement of food
                      security in the Kingdom by offering reliable and premium
                      rice.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-gray-900" />
                    <p className="text-gray-700 text-base sm:text-lg leading-7">
                      Since our inception, we have focused on building strong
                      partnerships with the world’s best suppliers and
                      establishing an advanced distribution network that ensures
                      our products reach all regions of the Kingdom efficiently
                      and with superior quality.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-gray-900" />
                    <p className="text-gray-700 text-base sm:text-lg leading-7">
                      Today, we continue to grow confidently and consistently
                      within this sector, remaining dedicated to being a trusted
                      company that delivers only the finest rice to consumers
                      across Saudi Arabia.
                    </p>
                  </li>
                </ul>
              </div>

              {/* subtle bottom gradient */}
              <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
