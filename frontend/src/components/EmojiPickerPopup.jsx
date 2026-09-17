import React, { useState } from "react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";

const EmojiPickerPopup = ({ icon, onSelect, type = "income" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  const isIncome = type === "income";
  const boxStyles = isIncome
    ? "bg-blue-50 dark:bg-[#0c192c] text-[#2563EB] border-blue-200/60 dark:border-[#1e3a66] group-hover:border-[#2563EB]"
    : "bg-red-50 dark:bg-[#250c0f] text-[#FA2C37] border-red-200/60 dark:border-[#4d161b] group-hover:border-[#FA2C37]";

  const isUrl =
    typeof icon === "string" &&
    (icon.startsWith("http") ||
      icon.includes("cdn.jsdelivr.net") ||
      icon.endsWith(".png"));

  const imageSrc = isUrl
    ? icon.startsWith("http")
      ? icon
      : `https://${icon.replace(/^\/\//, "")}`
    : null;

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl border transition-colors shrink-0 overflow-hidden ${boxStyles}`}
        >
          {icon ? (
            isUrl ? (
              <img src={imageSrc} alt="Icon" className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-2xl">{icon}</span>
            )
          ) : (
            <LuImage size={22} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
            {icon ? "Change Icon" : "Pick Icon"}
          </p>
          <p className="text-xs text-slate-400 dark:text-gray-400">
            Customize transaction icon
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="relative mt-2 md:mt-0 z-30">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 rounded-full absolute -top-2 -right-2 z-40 shadow-md hover:text-rose-500 cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="Close emoji picker"
          >
            <LuX size={14} />
          </button>
          <EmojiPicker
            theme={isDark ? EmojiTheme.DARK : EmojiTheme.LIGHT}
            open={isOpen}
            onEmojiClick={(emoji) => {
              onSelect(emoji?.imageUrl || emoji?.emoji || "");
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
