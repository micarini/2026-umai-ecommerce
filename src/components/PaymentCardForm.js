"use client";

import "react-credit-cards-2/dist/es/styles-compiled.css";

import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import Cards from "react-credit-cards-2";

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1A4345",
      fontFamily: "inherit",
      "::placeholder": { color: "#1A434580" },
    },
    invalid: { color: "#EE6A4D" },
  },
};

const elementClassName =
  "w-full rounded-lg border border-sand bg-cream px-4 py-3.5 outline-none focus-within:border-teal";

export default function PaymentCardForm({ cardName, onCardNameChange, onElementsChange }) {
  const [focused, setFocused] = useState("");
  const [brand, setBrand] = useState("");

  function handleChange(field) {
    return (event) => {
      if (field === "number") {
        setBrand(event.brand && event.brand !== "unknown" ? event.brand : "");
      }
      onElementsChange((prev) => ({ ...prev, [field]: event.complete }));
    };
  }

  return (
    <div className="space-y-4">
      <div className="[&>div]:mx-auto [&>div]:sm:mx-0">
        <Cards
          number="•••• •••• •••• ••••"
          name={cardName || "YOUR NAME"}
          expiry="••/••"
          cvc={focused === "cvc" ? "•••" : ""}
          focused={focused || undefined}
          issuer={brand || undefined}
          preview
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
          Name on card
        </label>
        <input
          className="w-full rounded-lg border border-sand bg-cream px-4 py-3 outline-none focus:border-teal"
          value={cardName}
          onChange={(e) => onCardNameChange(e.target.value)}
          onFocus={() => setFocused("name")}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
          Card number
        </label>
        <div className={elementClassName}>
          <CardNumberElement
            options={ELEMENT_OPTIONS}
            onChange={handleChange("number")}
            onFocus={() => setFocused("number")}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
            Expiry
          </label>
          <div className={elementClassName}>
            <CardExpiryElement
              options={ELEMENT_OPTIONS}
              onChange={handleChange("expiry")}
              onFocus={() => setFocused("expiry")}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-teal/60">
            CVC
          </label>
          <div className={elementClassName}>
            <CardCvcElement
              options={ELEMENT_OPTIONS}
              onChange={handleChange("cvc")}
              onFocus={() => setFocused("cvc")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-teal/40">
        Test mode — use card number 4242 4242 4242 4242, any future expiry, any CVC.
      </p>
    </div>
  );
}
