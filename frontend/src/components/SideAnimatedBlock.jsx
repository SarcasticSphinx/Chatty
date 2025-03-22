import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { MessageSquare, Users } from "lucide-react";

const SideAnimatedBlock = ({ auth }) => {
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    });
  }, [controls]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const content = {
    logIn: {
      title: "Welcome Back",
      subtitle: "Connect with your team and start chatting",
      icon: <MessageSquare className="w-16 h-16" />,
    },
    signUp: {
      title: "Join the Conversation",
      subtitle: "Create your account and connect with your team",
      icon: <Users className="w-16 h-16" />,
    },
  };

  const currentContent = content[auth] || content.logIn;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={controls}
      className="relative h-full flex items-center justify-center overflow-hidden bg-base-300 w-full z-[-1]"
    >
      {/* Subtle gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(var(--p), 0.1), rgba(var(--s), 0.1))",
            "linear-gradient(45deg, rgba(var(--s), 0.1), rgba(var(--a), 0.1))",
            "linear-gradient(45deg, rgba(var(--a), 0.1), rgba(var(--p), 0.1))",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="text-primary mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {currentContent.icon}
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-base-content">
          {currentContent.title}
        </h2>
        <p className="text-lg opacity-80 text-base-content/80 mb-8">
          {currentContent.subtitle}
        </p>

        {/* Geometric Animation */}
        <div className="relative w-96 h-96 mx-auto mb-8">
          {/* Outer hexagon */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/20 rounded-lg"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, repeatType: "reverse" },
            }}
          />

          {/* Inner hexagon */}
          <motion.div
            className="absolute inset-8 border-2 border-secondary/20 rounded-lg"
            animate={{
              rotate: -360,
              scale: [1, 0.9, 1],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
            }}
          />

          {/* Center circle */}
          <motion.div
            className="absolute inset-16 border-2 border-accent/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Connection lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-24 bg-primary/20"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "center",
                transform: `rotate(${i * 60}deg) translateY(-48px)`,
              }}
              animate={{
                scaleY: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Floating dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${25 + Math.cos(i * Math.PI / 4) * 25}%`,
                top: `${25 + Math.sin(i * Math.PI / 4) * 25}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Mouse follower effect */}
          <motion.div
            className="absolute w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none"
            animate={{
              x: mousePosition.x - 160,
              y: mousePosition.y - 160,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 100,
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/20"
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/20"
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5 }}
      />
    </motion.div>
  );
};

export default SideAnimatedBlock;