import { NavLink } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Fragments', to: '/fragments' },
    { name: 'Tags', to: '/tags' },
    { name: 'Info', to: '/info' },
  ];

  return (
    <nav className="bg-[#333333] pt-3">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-3xl font-bold bg-[#9A48D0] bg-clip-text text-transparent">
              CODE WALLET
            </span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-base text-white font-medium transition-colors ${
                      isActive 
                        ? 'bg-[#9A48D0] text-white ' 
                        : 'text-gray-300 hover:bg-[#9A48D0] hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Section Droite */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/fragment-form"
              className="hidden md:inline-flex items-center px-4 py-2 bg-[#9A48D0] text-white rounded-md text-base font-medium hover:bg-[#9A48D0] transition-colors" // Modification ici
            >
              New Fragments
            </NavLink>

            {/* Bouton Mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#9A48D0]" // Modification ici
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <Transition.Root show={isMenuOpen} as={Fragment}>
        <Dialog as="div" className="md:hidden relative z-50" onClose={setIsMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-end pt-4 pr-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-64 border border-gray-700">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#9A48D0]" // Modification ici
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 rounded-md text-sm font-medium ${
                            isActive
                              ? 'bg-[#9A48D0] text-white' // Modification ici
                              : 'text-gray-300 hover:bg-[#9A48D0] hover:text-white' // Modification ici
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                    <NavLink
                      to="/fragment-form"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mt-4 bg-[#9A48D0] text-white rounded-md text-sm font-medium hover:bg-[#9A48D0]" // Modification ici
                    >
                      New Fragments
                    </NavLink>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </nav>
  );
};

export default Navbar;