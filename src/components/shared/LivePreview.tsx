import React from "react";

export function LivePreview() {
  return (
    <div className="sticky top-28 mx-auto w-full max-w-[320px] md:mx-0">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-white">
          Live Preview
        </h2>
        <span className="text-xs font-semibold tracking-widest text-[#00F5FF]/60 uppercase">
          Profile Live
        </span>
      </div>

      {/* Phone Frame */}
      <div className="relative mx-auto aspect-[9/19.5] w-full overflow-hidden rounded-[3rem] border-[8px] border-[#333538] bg-[#0c0e11] shadow-2xl ring-1 ring-white/5">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#333538]"></div>

        {/* Profile Content inside Preview */}
        <div className="relative flex h-full w-full flex-col items-center p-8 pt-16">
          <div className="mb-4 h-20 w-20 rounded-full p-1 ring-4 ring-[#00F5FF]/20">
            <img
              alt="Avatar"
              className="h-full w-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6qgJdYu7WRjCa7fcrsv_5U_b5tXGIxUUzCAd1D2tcTMJHulNIvIGKlwPE-ctAwincaAOPV7D11023543UK6DHgtuN8XJdIau2HxArd-VG-Tq1sHvMFBWwpCVRz7kVid48AYVw85vbx2L9DeIEwyL3NRvNWuk47cySiDPkAbDk78LqO7O5Ng_YGM0sfDj2NvJ0k4ZEG8cOrwSqFJ2SExMVFJms-kraIdE0hUq9qmbJ9uyVLw6SXVMqCIKCkdO3Pe2zScYxbp18hA"
            />
          </div>
          <h3 className="font-headline mb-1 text-xl font-extrabold text-white">
            Digital Curator
          </h3>
          <p className="mb-8 text-xs tracking-wide text-slate-400">
            @curator_studio
          </p>

          <div className="w-full space-y-3">
            <div className="w-full rounded-xl border border-white/5 bg-[#282a2d] px-4 py-3 text-center text-sm font-medium text-white">
              Portfolio Reel
            </div>
            <div className="w-full rounded-xl border border-white/5 bg-[#282a2d] px-4 py-3 text-center text-sm font-medium text-white">
              Read the Manifesto
            </div>
            <div className="w-full rounded-xl bg-[#00F5FF] px-4 py-3 text-center text-sm font-bold text-[#006c71] shadow-lg shadow-[#00F5FF]/20">
              Book a Consultation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
