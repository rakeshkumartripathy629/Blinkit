// import React, { useMemo, useState } from "react";
// import logo from "../assets/logo.png";
// import Search from "./Search";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaRegCircleUser } from "react-icons/fa6";
// import useMobile from "../hooks/useMobile";
// import { BsCart4 } from "react-icons/bs";
// import { useSelector } from "react-redux";
// import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
// import UserMenu from "./UserMenu";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import DisplayCartItem from "./DisplayCartItem";

// const Header = () => {
//   const [isMobile] = useMobile();
//   const location = useLocation();
//   const isSearchPage = location.pathname === "/search";
//   const navigate = useNavigate();
//   const user = useSelector((state) => state?.user);
//   const [openUserMenu, setOpenUserMenu] = useState(false);
//   const cartItem = useSelector((state) => state?.cartItem?.cart) || [];
//   const [openCartSection, setOpenCartSection] = useState(false);

//   // safe context usage with fallback
//   let totalPrice = 0;
//   let totalQty = 0;
//   try {
//     const ctx = useGlobalContext();
//     totalPrice = ctx.totalPrice ?? 0;
//     totalQty = ctx.totalQty ?? 0;
//   } catch (e) {
//     console.warn("GlobalContext missing:", e.message);
//   }

//   // fallback derived from redux cart if context gives zeros
//   const derived = useMemo(() => {
//     const qty = cartItem.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
//     const price = cartItem.reduce((prev, curr) => {
//       const p = curr?.productId?.price || 0;
//       return prev + p * (curr.quantity || 0);
//     }, 0);
//     return { qty, price };
//   }, [cartItem]);

//   if (totalQty === 0 && derived.qty > 0) totalQty = derived.qty;
//   if (totalPrice === 0 && derived.price > 0) totalPrice = derived.price;

//   const redirectToLoginPage = () => navigate("/login");

//   const handleCloseUserMenu = () => setOpenUserMenu(false);

//   const handleMobileUser = () => {
//     if (!user?._id) {
//       navigate("/login");
//       return;
//     }
//     navigate("/user");
//   };

//   return (
//     <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
//       {!(isSearchPage && isMobile) && (
//         <div className="container mx-auto flex items-center px-2 justify-between">
//           <div className="h-full">
//             <Link to={"/"} className="h-full flex justify-center items-center">
//               <img
//                 src={logo}
//                 width={170}
//                 height={60}
//                 alt="logo"
//                 className="hidden lg:block"
//               />
//               <img
//                 src={logo}
//                 width={120}
//                 height={60}
//                 alt="logo"
//                 className="lg:hidden"
//               />
//             </Link>
//           </div>

//           <div className="hidden lg:block">
//             <Search />
//           </div>

//           <div>
//             <button
//               className="text-neutral-600 lg:hidden"
//               onClick={handleMobileUser}
//             >
//               <FaRegCircleUser size={26} />
//             </button>

//             <div className="hidden lg:flex items-center gap-10">
//               {user?._id ? (
//                 <div className="relative">
//                   <div
//                     onClick={() => setOpenUserMenu((prev) => !prev)}
//                     className="flex select-none items-center gap-1 cursor-pointer"
//                   >
//                     <p>Account</p>
//                     {openUserMenu ? (
//                       <GoTriangleUp size={25} />
//                     ) : (
//                       <GoTriangleDown size={25} />
//                     )}
//                   </div>
//                   {openUserMenu && (
//                     <div className="absolute right-0 top-12">
//                       <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
//                         <UserMenu close={handleCloseUserMenu} />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={redirectToLoginPage}
//                   className="text-lg px-2"
//                 >
//                   Login
//                 </button>
//               )}
//               <button
//                 onClick={() => setOpenCartSection(true)}
//                 className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
//               >
//                 <div className="animate-bounce">
//                   <BsCart4 size={26} />
//                 </div>
//                 <div className="font-semibold text-sm">
//                   {cartItem.length ? (
//                     <div>
//                       <p>{totalQty} Items</p>
//                       <p>{DisplayPriceInRupees(totalPrice)}</p>
//                     </div>
//                   ) : (
//                     <p>My Cart</p>
//                   )}
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-2 lg:hidden">
//         <Search />
//       </div>

//       {openCartSection && (
//         <DisplayCartItem close={() => setOpenCartSection(false)} />
//       )}
//     </header>
//   );
// };

// export default Header;






import React, { useMemo, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { MdMyLocation, MdEdit } from "react-icons/md";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import toast from "react-hot-toast";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state?.cartItem?.cart) || [];
  const [openCartSection, setOpenCartSection] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({
    address: "Detecting location...",
    isDetecting: false,
    error: null,
  });
  const [showLocationModal, setShowLocationModal] = useState(false);

  let totalPrice = 0;
  let totalQty = 0;
  try {
    const ctx = useGlobalContext();
    totalPrice = ctx.totalPrice ?? 0;
    totalQty = ctx.totalQty ?? 0;
  } catch (e) {
    console.warn("GlobalContext missing:", e.message);
  }

  const derived = useMemo(() => {
    const qty = cartItem.reduce((p, c) => p + (c.quantity || 0), 0);
    const price = cartItem.reduce((p, c) => {
      const pr = c?.productId?.price || 0;
      return p + pr * (c.quantity || 0);
    }, 0);
    return { qty, price };
  }, [cartItem]);

  if (totalQty === 0 && derived.qty > 0) totalQty = derived.qty;
  if (totalPrice === 0 && derived.price > 0) totalPrice = derived.price;

  const getCurrentLocation = () => {
    setCurrentLocation((prev) => ({ ...prev, isDetecting: true, error: null }));

    if (!navigator.geolocation) {
      setCurrentLocation((prev) => ({
        ...prev,
        isDetecting: false,
        error: "Geolocation not supported",
        address: "Location not available",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const address = `${data.locality || data.city || ""}, ${
            data.principalSubdivision || ""
          }`
            .trim()
            .replace(/^,|,$/, "") ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          setCurrentLocation({
            address,
            isDetecting: false,
            error: null,
            coordinates: { latitude, longitude },
          });
          localStorage.setItem(
            "userLocation",
            JSON.stringify({
              address,
              coordinates: { latitude, longitude },
              timestamp: Date.now(),
            })
          );
        } catch (err) {
          console.error("Error reverse geocoding:", err);
          setCurrentLocation((prev) => ({
            ...prev,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            isDetecting: false,
            error: "Could not get address",
          }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location access denied";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timeout";
            break;
          default:
            errorMessage = "Location error";
        }
        setCurrentLocation((prev) => ({
          ...prev,
          isDetecting: false,
          error: errorMessage,
          address: "Set location manually",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        const loc = JSON.parse(saved);
        const isRecent = Date.now() - loc.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setCurrentLocation({
            address: loc.address,
            isDetecting: false,
            error: null,
            coordinates: loc.coordinates,
          });
        } else {
          getCurrentLocation();
        }
      } catch {
        getCurrentLocation();
      }
    } else {
      getCurrentLocation();
    }
  }, []);

  const redirectToLoginPage = () => navigate("/login");
  const handleCloseUserMenu = () => setOpenUserMenu(false);
  const handleMobileUser = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  const LocationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Location Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <HiLocationMarker className="text-red-500" size={20} />
            <div className="flex-1">
              <p className="font-medium">Current Location</p>
              <p className="text-sm text-gray-600">
                {currentLocation.address}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              getCurrentLocation();
              setShowLocationModal(false);
            }}
            disabled={currentLocation.isDetecting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <MdMyLocation size={18} />
            {currentLocation.isDetecting
              ? "Detecting..."
              : "Use Current Location"}
          </button>
          <div className="text-center">
            <button
              onClick={() => setShowLocationModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between h-full">
          {/* Logo + Location on left, Search grows, then user/cart on right */}
          <div className="flex flex-1 items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to={"/"} className="h-full flex justify-center items-center">
                <img
                  src={logo}
                  width={170}
                  height={60}
                  alt="logo"
                  className="hidden lg:block"
                />
                <img
                  src={logo}
                  width={120}
                  height={60}
                  alt="logo"
                  className="lg:hidden"
                />
              </Link>

              {/* Location right of logo */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1 rounded-full border"
                style={{ minWidth: 160 }}
              >
                <HiLocationMarker className="text-red-500" size={16} />
                <span className="truncate max-w-xs">
                  {currentLocation.isDetecting ? (
                    <span className="flex items-center gap-1">
                      <div className="animate-spin w-3 h-3 border border-blue-500 border-t-transparent rounded-full"></div>
                      Detecting...
                    </span>
                  ) : (
                    currentLocation.address
                  )}
                </span>
                <MdEdit size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Search bar occupies remaining space */}
            <div className="flex-1 min-w-0">
              <Search />
            </div>
          </div>

          {/* Right Section - User Menu & Cart */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <button
              className="text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
              >
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItem.length ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile search fallback */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {/* Cart drawer/modal */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}

      {/* Location modal */}
      {showLocationModal && <LocationModal />}
    </header>
  );
};

export default Header;
