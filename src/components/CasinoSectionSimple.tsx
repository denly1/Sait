export default function CasinoSectionSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-16 border-4 border-amber-500/30 shadow-2xl">
          <div className="text-9xl mb-8 animate-pulse">🎰</div>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 mb-6">
            В РАЗРАБОТКЕ
          </h2>
          <p className="text-2xl text-slate-300 mb-8">
            Казино игры скоро будут доступны
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
