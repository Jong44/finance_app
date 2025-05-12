"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseForm from "@/components/expense-form"

interface PageProps {
  params: {
    id: string
  }
}

export default function InvoiceDetailPage() {
    const [invoice, setInvoice] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { id: paramsId } = useParams()

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${paramsId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch invoice details")
        }
        const data = await response.json()
        setInvoice(data.invoice)
      } catch (err) {
        console.error("Error fetching invoice:", err)
        setError("Failed to load invoice details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (paramsId) {
      fetchInvoice()
    }
  }, [paramsId])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Records
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {invoice ? (
            <ExpenseForm router={router} initialData={invoice} isEditing={true} />
          ) : (
            <p className="text-muted-foreground text-center py-8">Invoice not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}