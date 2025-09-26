"use client";

import React from "react";
import { toast } from "react-toastify";

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmToast({ message, onConfirm, onCancel }: ConfirmToastProps) {
  return (
    <div className="flex flex-col gap-2">
      <span>{message}</span>
      <div className="flex gap-2">
        <button
          onClick={() => {
            toast.dismiss();
            onConfirm();
          }}
          className="px-3 py-1 rounded bg-red-500 text-white text-sm"
        >
          Confirm
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            onCancel?.();
          }}
          className="px-3 py-1 rounded bg-gray-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
