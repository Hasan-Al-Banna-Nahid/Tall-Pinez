"use client"

import React, { useState, useEffect, FormEvent } from "react"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

type FormType = "CPA" | "Vendor" | "Inquiry"

const BookingForm = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // সব ডাটা এই একটি স্টেটেই থাকবে যা UI এবং LS উভয়কে কন্ট্রোল করবে
  const [formData, setFormData] = useState({
    type: "CPA" as FormType,
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  // ১. পেজ লোড হলে Local Storage থেকে ডাটা আনা
  useEffect(() => {
    const savedData = localStorage.getItem("tallpines_draft")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
        console.log("LOG: UI Restored from LS", parsed)
      } catch (e) {
        console.error("LS Parsing Error")
      }
    }
  }, [])

  // ২. ইনপুট চেঞ্জ হ্যান্ডলার (টাইপিং এবং অটো-সেভ একসাথে)
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    // নতুন ডাটা অবজেক্ট তৈরি
    const updatedData = { ...formData, [name]: value }

    // স্টেট আপডেট (যাতে UI তে দেখা যায়)
    setFormData(updatedData)

    // লোকাল স্টোরেজ আপডেট
    localStorage.setItem("tallpines_draft", JSON.stringify(updatedData))

    console.log(`LOG: Typing ${name} -> ${value}`)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("LOG: Submitting to n8n:", formData)

    try {
      const response = await fetch(
        "http://n8n-simplifai.saavatar.xyz/webhook/6cc2d09b-017e-401e-9f18-6373c7e043ae",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            submittedAt: new Date().toISOString(),
          }),
        }
      )

      if (response.ok) {
        setSubmitted(true)
        localStorage.removeItem("tallpines_draft")
      } else {
        throw new Error("Webhook Error")
      }
    } catch (err) {
      setError("Failed to send. Please check n8n.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-semibold text-gray-900">Success!</h2>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 font-medium text-blue-600 hover:underline"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tall Pinez Application
        </h1>
        <p className="text-sm text-gray-500">
          Live Sync & Local Auto-save enabled.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Application Type
          </label>
          <div className="flex gap-4">
            {["CPA", "Vendor", "Inquiry"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  handleInputChange({
                    target: { name: "type", value: t },
                  } as any)
                }
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                  formData.type === t
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              required
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {formData.type === "Inquiry" ? "Subject" : "Company Name"}
          </label>
          <input
            name="company"
            value={formData.company || ""}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Additional Details
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message || ""}
            onChange={handleInputChange}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  )
}

export default BookingForm
