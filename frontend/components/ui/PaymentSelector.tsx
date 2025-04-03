"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";
interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
}

interface PaymentSelectorProps {
  methods: PaymentMethod[];
  selectedMethodId: string | null;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  methods,
  selectedMethodId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <div
          key={method.id}
          onClick={() => onSelect(method)}
          className={clsx(
            "cursor-pointer p-4 border rounded-md shadow transition-transform duration-200 flex items-center",
            selectedMethodId === method.id
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 bg-white"
          )}
        >
          <div className="mr-4">
            <Image
              src={method.imageUrl}
              alt={method.name}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">{method.name}</h3>
            {method.description && (
              <p className="text-sm text-gray-600">{method.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSelector;
