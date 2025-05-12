"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ExpenseForm from '@/components/expense-form';
import { Button } from '@/components/ui/button';
import { X, Scan } from 'lucide-react';
// import { toast } from "@/components/ui/use-toast";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner";

const Invoice = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanData, setScanData] = useState<any>(null);
  
  // Reference to the expense form
  const expenseFormRef = useRef<any>(null);

  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is image(PNG or JPEG/JPG)
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only PNG or JPEG images');
        event.target.value = ''; // Reset input
        return;
      }

      // Check file size (optional, set to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        event.target.value = '';
        return;
      }

      setSelectedImage(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Clean up object URLs when component unmounts or when image changes
  useEffect(() => {
    return () => {
      // Revoke the object URL to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  // Reset the image and preview
  const handleResetImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setScanData(null);
  };
  
  // Scan the invoice image
  const handleScanInvoice = async () => {
    if (!selectedImage) {
      toast("No image selected", {
        description: "Please upload an invoice image first",
      });
      return;
    }
    
    setIsScanning(true);
    setScanData(null); // Reset any previous scan data
    
    try {
      console.log("Starting invoice scan process");
      
      // Create form data with the image
      const formData = new FormData();
      formData.append('file', selectedImage);
      console.log(`Uploading image: ${selectedImage.name}, size: ${selectedImage.size} bytes, type: ${selectedImage.type}`);
      
      // Send the image to the scanner API
      const response = await fetch('/api/scanner', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Scanner API response:", result);
      
      if (result.success && result.data) {
        setScanData(result.data);
        console.log("Scan data received:", result.data);
        
        // Populate the form with the scanned data
        if (expenseFormRef.current) {
          const { expanse, expanse_detail } = result.data;
          
          if (!expanse || !expanse_detail || !Array.isArray(expanse_detail)) {
            throw new Error("Invalid data structure received from scanner");
          }
          
          // Create form data structure
          const formData = {
            code_receipt: expanse.code_receipt || '',
            name_supplier: expanse.name_supplier || '',
            date: expanse.date ? new Date(expanse.date) : new Date(),
            total_price: expanse.total_price || 0,
            tax_price: expanse.tax_price || 0,
            note: '',
            expense_details: expanse_detail.map((item: any) => ({
              id_expense_detail: Math.random().toString(36).substring(2, 15),
              name_product: item.name_product || '',
              category: item.category || 'Office Supplies',
              quantity: item.quantity || 1,
              unit: item.unit || 'Piece',
              price_per_unit: item.price_per_unit || 0,
              total_price: item.total_price || 0,
            }))
          };
          
          console.log("Populating form with data:", formData);
          
          // Update the form
          expenseFormRef.current.populateForm(formData);
          
          toast("Invoice scanned successfully", {
            description: "The form has been populated with the invoice data",
          });
        }
      } else {
        console.error("Scanning failed:", result.reason);
        toast("Scanning failed", {
          description: result.reason || "Could not extract data from the invoice",
          // variant: "destructive"
        });
        
        // Provide more helpful guidance based on the error
        if (result.reason && result.reason.includes("not recognized as an invoice")) {
          toast("Scanning tip", {
            description: "Try using a clearer image or a different invoice format",
          });
        } else if (result.reason && result.reason.includes("No text could be detected")) {
          toast("Scanning tip", {
            description: "The image quality is too low. Try taking a clearer photo with good lighting",
          });
        }
      }
    } catch (error: any) {
      console.error('Error scanning invoice:', error);
      toast("Scanning error", {
        description: `Error: ${error.message || "An unexpected error occurred"}`,
        // variant: "destructive"
      });
      
      // Provide troubleshooting tips
      toast("Troubleshooting", {
        description: "Try using a different image or check your internet connection",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className='flex flex-col'>    
        <div className="w-full bg-gray-50 p-4 rounded-lg">
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-gray-600">This is the invoice page.</p>
        </div>

        {/* Upload Invoice */}
        <div className="w-full p-4 rounded-lg">
          <div className="flex flex-col items-center">
            {!imagePreview ? (
              <label 
                htmlFor="dropzone-file" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload an Invoice</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG or JPEG only (MAX. 10MB)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file"
                  className="hidden" 
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative w-full">
                <div 
                  className="relative w-full min-h-[300px] max-w-[600px] mx-auto overflow-hidden rounded-lg border-2 border-gray-300 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img 
                    src={imagePreview} 
                    alt="Invoice Preview" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs">Click to enlarge</div>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleResetImage}
                    className="flex items-center gap-2"
                  >
                    Reset Image
                  </Button>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    View Full Size
                  </Button>
                  <Button 
                    onClick={handleScanInvoice}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Scan Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {selectedImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Selected file: {selectedImage.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Form */}
        <div className="w-full p-4 rounded-lg">
          <ExpenseForm ref={expenseFormRef} router={router}/>
        </div>
        <Toaster />
        {/* Modal for full-size image view */}
        {isModalOpen && imagePreview && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg p-2 overflow-hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="w-full h-full overflow-auto">
                <img 
                  src={imagePreview} 
                  alt="Invoice Preview Full Size" 
                  className="max-w-full max-h-[85vh] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Invoice