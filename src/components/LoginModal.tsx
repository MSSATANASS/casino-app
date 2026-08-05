import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../lib/auth";
import Login from "./Login";

export default function LoginModal() {
  const { loginPromptOpen, closeLoginPrompt, user } = useAuth();
  const open = loginPromptOpen && !user;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeLoginPrompt}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLoginPrompt}
              aria-label="Cerrar"
              className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#10162b] text-white shadow-glow transition-transform hover:scale-105"
            >
              <X size={16} />
            </button>
            <Login />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
