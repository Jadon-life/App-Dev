"use client";

import { X } from "lucide-react";

export default function DemoAnimation({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-lg aspect-[4/3] mx-4 rounded-[20px] overflow-hidden bg-[#0a0a1a] border border-[#00b4d8]/10" onClick={(e) => e.stopPropagation()}>
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6C3AE0]/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#00b4d8]/15 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Desk line */}
        <div className="absolute bottom-[15%] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-transparent via-[#90e0ef]/30 to-transparent rounded-full" />

        {/* Monitor */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[55%] aspect-[16/10]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[15%] h-[12%] bg-gradient-to-t from-[#90e0ef]/20 to-[#90e0ef]/10 rounded-t" />
          <div className="absolute inset-0 bottom-[12%] rounded-lg border border-[#00b4d8]/20 bg-[#0d0d25] overflow-hidden shadow-[0_0_30px_rgba(0,180,216,0.1)]">
            <div className="p-3 space-y-2">
              <div className="h-2 w-[80%] bg-[#90e0ef]/20 rounded-full animate-pulse" />
              <div className="h-2 w-[60%] bg-[#90e0ef]/15 rounded-full animate-pulse" />
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-[#00b4d8]/40" />
                  <div className="h-1.5 w-[70%] bg-[#90e0ef]/10 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-[#00b4d8]/40 bg-[#00b4d8]/30" />
                  <div className="h-1.5 w-[55%] bg-[#00b4d8]/20 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-[#00b4d8]/40" />
                  <div className="h-1.5 w-[65%] bg-[#90e0ef]/10 rounded-full" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00b4d8]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6C3AE0]/40 to-transparent" />
          </div>
        </div>

        {/* Character */}
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2">
          <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-b from-[#2a2a4a] to-[#1a1a35] border border-[#90e0ef]/10 relative">
            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 bg-[#00b4d8]/30 rounded-full blur-[3px]" />
            <div className="absolute -top-[1px] -left-[1px] w-2 h-2 bg-[#6C3AE0]/30 rounded-full blur-[2px]" />
          </div>
          <div className="w-14 h-10 mx-auto -mt-1 rounded-t-xl bg-gradient-to-b from-[#1e1e3a] to-[#141430] relative">
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#6C3AE0]/40 to-transparent" />
            <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#00b4d8]/40 to-transparent" />
          </div>
          <div className="flex justify-center gap-8 -mt-3">
            <div className="w-3 h-3 rounded-full bg-[#2a2a4a] animate-bounce" style={{ animationDuration: "0.8s" }} />
            <div className="w-3 h-3 rounded-full bg-[#2a2a4a] animate-bounce" style={{ animationDuration: "0.8s", animationDelay: "0.4s" }} />
          </div>
        </div>

        {/* Floating particles */}
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full animate-bounce opacity-30" style={{ left: `${15+i*12}%`, top: `${20+i*8}%`, backgroundColor: i%2===0 ? "#00b4d8" : "#6C3AE0", animationDelay: `${i*0.5}s`, animationDuration: "3s" }} />
        ))}

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-[11px] text-[#90e0ef]/40">CrysLearn — Timed mock exams that feel like the real thing</p>
        </div>
      </div>
    </div>
  );
}
