import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const openSidebarButtonRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        openSidebarButtonRef.current &&
        !openSidebarButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <div className="bg-gray-100 sticky top-0 z-10">
      <nav className="bg-white shadow px-16 md:px-40">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">JobWagon</h1>
            
            {/* Desktop menu */}
            <div className="hidden md:flex space-x-4">
              {menuItems.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-700 hover:text-indigo-600">
                  {item.name}
                </a>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <button
              ref={openSidebarButtonRef}
              className="md:hidden text-gray-500 hover:text-gray-600"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div
        ref={sidebarRef}
        className={`md:hidden fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <a href={item.href} className="block hover:text-indigo-400">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;