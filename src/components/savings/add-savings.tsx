"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddEditSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    target_amount: number;
    current_amount?: number;
  }) => void;
  defaultValues?: {
    id?: string;
    name: string;
    target_amount: number;
    current_amount?: number;
  };
}

const AddEditSavingsModal: React.FC<AddEditSavingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultValues,
}) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name);
      setTargetAmount(defaultValues.target_amount.toString());
      setCurrentAmount(defaultValues.current_amount?.toString() || "");
    }
  }, [defaultValues]);

  const handleSubmit = async () => {
    if (!name || !targetAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = {
      id: defaultValues?.id,
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: currentAmount ? parseFloat(currentAmount) : 0,
    };

    onSave(data);
    onClose();
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Savings Goal" : "Add Savings Goal"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Update your savings goal details."
              : "Create a new savings goal to start saving."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Trip to Bali"
          />

          <Label>Target Amount</Label>
          <Input
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="e.g. 10000000"
          />

          {defaultValues && (
            <>
              <Label>Current Amount</Label>
              <Input
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="e.g. 5000000"
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {defaultValues ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSavingsModal;
