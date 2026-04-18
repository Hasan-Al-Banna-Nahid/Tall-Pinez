"use client"

import React, { useState, useEffect } from "react"
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Briefcase,
  FileText,
} from "lucide-react"

type TabType = "CPA" | "Vendor" | "Referral"

const WEBHOOK_URL =
  "https://n8n-simplifai.saavatar.xyz/webhook/6cc2d09b-017e-401e-9f18-6373c7e043ae"

const CATEGORIES = [
  "Financial Services",
  "Legal Services",
  "Insurance Services",
  "Real Estate Services",
  "Business Operations & Consulting",
  "Technology Services",
  "Marketing & Sales",
  "Human Resources",
  "Specialized & Niche Services",
]

export default function TallPinzePortal() {
  const [activeTab, setActiveTab] = useState<TabType>("Referral")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<any>({})

  // Load Draft from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(`tp_draft_${activeTab}`)
    if (saved) setFormData(JSON.parse(saved))
    else
      setFormData({
        category: "",
        urgency: "Medium",
        pledgeAgreed: false,
        feeAgreed: false,
      })
  }, [activeTab])

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value
    const updated = { ...formData, [name]: val }
    setFormData(updated)
    localStorage.setItem(`tp_draft_${activeTab}`, JSON.stringify(updated))
    console.log(`[LOG] ${activeTab} Form -> ${name}:`, val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log(`[SUBMIT] Sending ${activeTab} data to n8n...`, formData)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: activeTab,
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        localStorage.removeItem(`tp_draft_${activeTab}`)
      }
    } catch (err) {
      console.error("Submission Error", err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-2xl">
        <CheckCircle2 className="mx-auto mb-4 h-20 w-20 text-green-500" />
        <h2 className="text-3xl font-bold text-gray-900">Submitted!</h2>
        <p className="mt-3 text-gray-600">
          Your application/inquiry is being processed.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 font-bold text-blue-600 transition-colors hover:text-blue-800"
        >
          Return to Form
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 font-sans">
      {/* Tab Navigation */}
      <div className="mb-8 flex justify-center gap-2 rounded-2xl bg-gray-100 p-1.5 shadow-inner">
        {(["Referral", "Vendor", "CPA"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab === "Referral"
              ? "Client Referral"
              : tab === "Vendor"
                ? "Vendor App"
                : "CPA Application"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gray-900 px-8 py-6 text-white">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">TALL PINZE</h1>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
              Referral Platform
            </p>
          </div>
          <button className="flex items-center gap-2 text-xs font-medium text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          {/* --- REFERRAL FORM --- */}
          {activeTab === "Referral" && (
            <div className="animate-in space-y-10 duration-500 fade-in slide-in-from-bottom-4">
              <section>
                <h2 className="text-3xl font-bold text-gray-900">
                  Submit a Client Referral
                </h2>
                <p className="mt-2 text-gray-600">
                  Match your client with a vetted, pledge-bound professional.
                </p>
              </section>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-blue-600">
                    <FileText className="h-4 w-4" /> 01. Your Information
                  </h3>
                  <input
                    required
                    name="name"
                    placeholder="Full Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-blue-600">
                    <Briefcase className="h-4 w-4" /> 02. Client Information
                  </h3>
                  <input
                    required
                    name="clientName"
                    placeholder="Client Name"
                    value={formData.clientName || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                  <input
                    name="clientCompany"
                    placeholder="Client Company"
                    value={formData.clientCompany || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-blue-600">03. Service Details</h3>
                <select
                  required
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  className="tp-input"
                >
                  <option value="">Select Service Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["Urgent", "High", "Medium", "Low"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "urgency", value: level },
                        })
                      }
                      className={`rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                        formData.urgency === level
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {level === "Urgent" && "Urgent — ASAP / Within days"}
                      {level === "High" && "High — Within 1–2 weeks"}
                      {level === "Medium" && "Medium — Within 2–4 weeks"}
                      {level === "Low" && "Low — Flexible timeline (4+ weeks)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- VENDOR FORM --- */}
          {activeTab === "Vendor" && (
            <div className="animate-in space-y-10 duration-500 fade-in slide-in-from-bottom-4">
              <section>
                <h2 className="text-3xl font-bold text-gray-900">
                  Join the Network
                </h2>
                <p className="mt-2 text-gray-600">
                  Verified professional partner application.
                </p>
              </section>

              <div className="space-y-6">
                <h3 className="font-bold text-blue-600">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    required
                    name="name"
                    placeholder="Full Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Business Email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="tp-input"
                  />
                  <input
                    name="license"
                    placeholder="Professional License Number"
                    value={formData.license || ""}
                    onChange={handleInputChange}
                    className="tp-input md:col-span-2"
                  />
                </div>
                <select
                  required
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  className="tp-input"
                >
                  <option value="">Select Your Service Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="flex items-center gap-2 font-bold text-gray-800">
                  <ShieldCheck className="text-green-600" /> Professional Pledge
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Treat each referral with respect and timely response.</p>
                  <p>• Maintain clear communication with referring CPAs.</p>
                </div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    required
                    name="pledgeAgreed"
                    checked={formData.pledgeAgreed || false}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded accent-blue-600"
                  />
                  <span className="text-sm font-semibold">
                    I commit to the professional pledge.
                  </span>
                </label>
              </div>

              <div className="space-y-4 rounded-2xl border-2 border-dashed border-blue-100 p-6">
                <h3 className="font-bold text-blue-900">Fee Agreement</h3>
                <p className="text-xs text-gray-500">
                  Annual Fee: $750 | Technology Fee: 10% on completed
                  transactions.
                </p>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    required
                    name="feeAgreed"
                    checked={formData.feeAgreed || false}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded accent-blue-600"
                  />
                  <span className="text-sm font-semibold">
                    I agree to the fee structure.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* --- CPA FORM (Standard Config) --- */}
          {activeTab === "CPA" && (
            <div className="animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-4">
              <section>
                <h2 className="text-3xl font-bold text-gray-900">
                  CPA Firm Registration
                </h2>
                <p className="mt-2 text-gray-600">
                  Register your firm to start sending and tracking referrals.
                </p>
              </section>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  name="firmName"
                  placeholder="Firm Name"
                  value={formData.firmName || ""}
                  onChange={handleInputChange}
                  className="tp-input"
                />
                <input
                  required
                  name="contactPerson"
                  placeholder="Primary Contact Person"
                  value={formData.contactPerson || ""}
                  onChange={handleInputChange}
                  className="tp-input"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Firm Email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="tp-input md:col-span-2"
                />
                <textarea
                  name="firmDetails"
                  placeholder="Briefly describe your firm's focus..."
                  value={formData.firmDetails || ""}
                  onChange={handleInputChange}
                  className="tp-input h-32 md:col-span-2"
                ></textarea>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="mt-12 space-y-4">
            <button
              disabled={loading}
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-blue-700 hover:shadow-blue-200 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : activeTab === "Referral" ? (
                "Submit Inquiry"
              ) : (
                "Submit Application"
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400">
              Secure transmission to Tall Pinze LLC. Data subject to privacy
              policy.
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .tp-input {
          @apply w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-medium transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50;
        }
      `}</style>
    </div>
  )
}
