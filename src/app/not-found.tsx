import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f4efe6]">
      <div className="bg-[#fffdf9] border-4 border-[#2b2723] p-8 max-w-lg shadow-[6px_6px_0_0_#2b2723] text-center">
        <p className="font-pixel text-xs text-[#ea580c] uppercase mb-2">
          ERROR 404 // MAP BOUNDARY
        </p>
        <h1 className="font-pixel text-2xl text-[#2b2723] mb-4">
          SECTOR NOT FOUND
        </h1>
        <p className="text-sm text-[#6b635b] font-mono mb-6 leading-relaxed">
          The requested coordinate does not exist in Arthur&apos;s digital realm. Return to the main save point!
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-3 bg-[#10b981] text-white font-pixel text-xs border-2 border-[#2b2723] shadow-[3px_3px_0_0_#2b2723] hover:bg-[#059669] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
        >
          [ RETURN TO HOME BASE ]
        </Link>
      </div>
    </div>
  );
}

