"use client";

import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isPreparing, setIsPreparing] = useState(false);

  // Serialize a File (PDF) to base64 so we can reconstruct it on the chat page
  const serializeFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const CHUNK_SIZE = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      binary += String.fromCharCode(
        ...bytes.subarray(i, i + CHUNK_SIZE)
      );
    }
    const base64 = btoa(binary);
    return {
      name: file.name,
      type: file.type,
      base64,
    };
  };

  const handleSend = async (text: string, file: File | null) => {
    if (!text.trim() && !file) return;
    setIsPreparing(true);

    const sessionId = crypto.randomUUID();

    let serializedFile: {
      name: string;
      type: string;
      base64: string;
    } | undefined = undefined;

    try {
      if (file) {
        if (file.type !== "application/pdf") {
          console.warn("Only PDF files are expected.");
        }
        serializedFile = await serializeFile(file);
      }
    } catch (err) {
      console.error("Failed to serialize file:", err);
    }

    window.sessionStorage.setItem(
      `first-message-${sessionId}`,
      JSON.stringify({
        text,
        file: serializedFile ?? null,
      })
    );

    router.push(`/chat/${sessionId}/`);
  };

  return (
    /* h-[calc(100vh-3.5rem)] accounts for the 3.5rem (56px = h-14) top navbar added by layout */
    <div className="h-[calc(100vh-3.5rem)] w-full bg-dots text-neutral-900 dark:text-white">
      <main className="ml-16 h-full">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-10">
            Hii, How can I help you today?
          </h1>

          {isPreparing && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Preparing your session...
            </p>
          )}

          <ChatInput sendUserMessage={handleSend} />
        </div>
      </main>
    </div>
  );
}