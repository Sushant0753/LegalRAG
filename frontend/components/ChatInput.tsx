"use client";

import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FiPlus, FiArrowUp, FiX, FiFileText } from "react-icons/fi";

type ChatInputProps = {
  sendUserMessage: (text: string, file: File | null) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ sendUserMessage }) => {
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentRef = useRef<File | null>(null);

  const hasText = value.trim().length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!value.trim() && !attachmentRef.current) return;
    sendUserMessage(value, attachmentRef.current);

    setValue("");
    attachmentRef.current = null;
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleAddAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    attachmentRef.current = file;
    setFileName(file.name);
  };

  const handleRemoveFile = () => {
    attachmentRef.current = null;
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div
        className={`
          bg-white dark:bg-neutral-800
          rounded-xl border flex flex-col justify-between px-3 py-2
          transition-all duration-200
          ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-500/30 dark:ring-blue-500/20"
              : "border-neutral-200 dark:border-neutral-700"
          }
        `}
      >
        {/* File attachment chip */}
        {fileName && (
          <div className="relative inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 mb-2 bg-neutral-100 dark:bg-neutral-700 px-2 py-1.5 rounded-full shadow-sm max-w-48">
            <FiFileText size={15} className="text-neutral-500 dark:text-neutral-300" />
            <span className="truncate flex-1 pr-6 text-xs">{fileName}</span>
            <button
              onClick={handleRemoveFile}
              className="absolute right-2 text-neutral-400 hover:text-red-500 cursor-pointer transition-colors"
              title="Remove attachment"
              aria-label="Remove attachment"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Textarea */}
        <TextareaAutosize
          minRows={1}
          maxRows={6}
          placeholder="Type your message here..."
          className="w-full resize-none bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 outline-none text-sm leading-relaxed py-1"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Actions row */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          {/* Attachment button */}
          <div>
            <button
              className="flex items-center justify-center h-7 w-7 rounded-full text-neutral-400 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
              title="Add attachment"
              type="button"
              onClick={handleAddAttachment}
              aria-label="Add attachment"
            >
              <FiPlus size={17} />
            </button>
            <input
              title="Upload file"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Send button */}
          <button
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${
              hasText || attachmentRef.current
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
            }`}
            title="Send message"
            onClick={handleSubmit}
            type="button"
            aria-label="Send message"
          >
            <FiArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;