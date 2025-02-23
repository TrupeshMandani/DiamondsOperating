// "use client";
// import React from "react";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { FiArrowRight, FiCheckCircle, FiLoader } from "react-icons/fi";

// function LoginForm() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     firstname: "",
//     email: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     if (formData.email.includes("@") && formData.password.length >= 6) {
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 2000);
//     } else {
//       setError("Please check your credentials");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
//       <motion.div
//         className="p-8 rounded-xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20"
//         style={{ width: "800px", height: "400px" }}
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex h-full">
//           {/* Left Panel */}
//           <motion.div
//             className="w-1/2 p-4 flex flex-col items-center justify-center bg-navy-800/50 backdrop-blur-sm rounded-xl border border-white/20"
//             whileHover={{ scale: 1.02 }}
//           >
//             <motion.img
//               src="Diamond.avif
//               "
//               alt="Company Logo"
//               className="w-24 h-24 rounded-full mb-4 backdrop-blur-sm border-2 border-white/30"
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 1 }}
//             />
//             <h1 className="text-xl font-bold text-white">
//               Diamond Management System
//             </h1>
//             <p className="text-center text-gray-300 text-sm mt-2">
//               Secure access to your professional dashboard
//             </p>
//           </motion.div>

//           {/* Right Form Panel */}
//           <motion.div
//             className="w-1/2 p-8 px-16 flex flex-col items-center justify-center"
//             key={isSignup ? "signup" : "login"}
//             initial={{ opacity: 0, x: isSignup ? 50 : -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.h1
//               className="text-2xl font-bold text-center text-white mb-6"
//               animate={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
//               transition={{ repeat: Infinity, duration: 2 }}
//             >
//               {isSignup ? "Signup" : "Login"}
//             </motion.h1>

//             <form onSubmit={handleSubmit} className="space-y-4 w-full">
//               {isSignup && (
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                 >
//                   <input
//                     type="text"
//                     name="firstname"
//                     placeholder="First Name"
//                     value={formData.firstname}
//                     onChange={handleChange}
//                     className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all"
//                   />
//                 </motion.div>
//               )}

//               <motion.div whileHover={{ scale: 1.02 }}>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all"
//                 />
//               </motion.div>

//               <motion.div whileHover={{ scale: 1.02 }}>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all pr-10"
//                 />
//               </motion.div>

//               {error && (
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="text-red-400 text-sm text-center"
//                 >
//                   {error}
//                 </motion.div>
//               )}

//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 disabled={isLoading}
//                 className="w-full bg-blue-500/90 text-white px-4 py-2 rounded-md hover:bg-blue-600/90 transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <>
//                     <FiLoader className="animate-spin" />
//                     Processing...
//                   </>
//                 ) : isSuccess ? (
//                   <>
//                     <FiCheckCircle className="animate-pulse" />
//                     Success!
//                   </>
//                 ) : (
//                   <>
//                     <FiArrowRight />
//                     {isSignup ? "Signup" : "Login"}
//                   </>
//                 )}
//               </motion.button>
//             </form>

//             <motion.button
//               onClick={() => setIsSignup(!isSignup)}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="text-blue-400 hover:text-blue-300 mt-4 text-sm font-medium backdrop-blur-sm flex items-center gap-2"
//             >
//               {isSignup ? "Already have an account?" : "Don't have an account?"}
//               <motion.span
//                 animate={{ x: [-2, 2, -2] }}
//                 transition={{ repeat: Infinity, duration: 1 }}
//               >
//                 →
//               </motion.span>
//             </motion.button>
//           </motion.div>
//         </div>

//         {/* Success overlay */}
//         {isSuccess && (
//           <motion.div
//             className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <FiCheckCircle className="text-4xl text-green-400 animate-bounce" />
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

// export default LoginForm;
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiLoader } from "react-icons/fi";

function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Get the backend base URL from .env

    // Dynamically set the endpoint based on the isSignup flag
    const endpoint = isSignup
      ? `http://localhost:5023/api/auth/register`
      : `http://localhost:5023/api/auth/login`;
    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        router.push("/Pages/Manager/Dashboard"); // Redirect after successful login/signup
      }, 2000);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      {/* Roaming Particles Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="p-8 rounded-xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20"
        style={{ width: "800px", height: "400px" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-full">
          {/* Left Panel */}
          <motion.div
            className="w-1/2 p-4 flex flex-col items-center justify-center bg-navy-800/50 backdrop-blur-sm rounded-xl border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src="/Diamond logo.png"
              alt="Company Logo"
              className="w-24 h-24 rounded-full mb-4 backdrop-blur-sm border-2 border-white/30"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            />
            <h1 className="text-xl font-bold text-white">
              Diamond Management System
            </h1>
            <p className="text-center text-gray-300 text-sm mt-2">
              Secure access to your professional dashboard
            </p>
          </motion.div>

          {/* Right Form Panel */}
          <motion.div
            className="w-1/2 p-8 px-16 flex flex-col items-center justify-center"
            key={isSignup ? "signup" : "login"}
            initial={{ opacity: 0, x: isSignup ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-2xl font-bold text-center text-white mb-6"
              animate={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {isSignup ? "Signup" : "Login"}
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {isSignup && (
                <motion.div whileHover={{ scale: 1.02 }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all"
                  />
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.02 }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm transition-all"
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-blue-500/90 text-white px-4 py-2 rounded-md hover:bg-blue-600/90 transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : isSuccess ? (
                  <FiCheckCircle className="animate-pulse" />
                ) : (
                  <FiArrowRight />
                )}
                {isSignup ? "Signup" : "Login"}
              </motion.button>
            </form>

            <motion.button
              onClick={() => setIsSignup(!isSignup)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-400 hover:text-blue-300 mt-4 text-sm font-medium  flex items-center gap-2"
            >
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <motion.span
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginForm;
