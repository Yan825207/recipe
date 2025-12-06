import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChefHat, Disc, MapPin, Refrigerator, Share2 } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '智能冰箱', icon: Refrigerator },
    { path: '/explore', label: '美食地图', icon: MapPin },
    { path: '/spinner', label: '今天吃什么', icon: Disc },
  ];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('链接已复制！您可以发送给朋友或在浏览器中打开。');
    }).catch(() => {
      alert('复制失败，请手动复制浏览器地址栏链接。');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row max-w-7xl mx-auto shadow-2xl overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
             <ChefHat size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-none">神厨小当家</h1>
            <span className="text-xs text-gray-400 mt-1">AI 智能厨房</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="mb-6">
            <button 
                onClick={handleShare}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-orange-500 w-full transition-colors"
            >
                <Share2 size={20} />
                分享应用
            </button>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">© 2024 神厨小当家<br/>Powered by Gemini</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 flex items-center justify-between gap-3 border-b sticky top-0 z-10">
           <div className="flex items-center gap-2">
             <div className="bg-orange-500 p-1.5 rounded-lg text-white">
               <ChefHat size={20} />
            </div>
            <h1 className="text-lg font-bold text-gray-800">神厨小当家</h1>
           </div>
           <button onClick={handleShare} className="p-2 text-gray-500 hover:text-orange-500 active:bg-gray-50 rounded-full transition-colors">
             <Share2 size={20} />
           </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive(item.path) ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;