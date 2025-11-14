import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useModel } from '@/contexts/ModelContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RetrySettings() {
  const { retrySets, updateRetrySets } = useModel();
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(retrySets.toString());
  const [error, setError] = useState('');

  const handleSave = () => {
    const success = updateRetrySets(tempValue);
    if (success) {
      setError('');
      setIsOpen(false);
    } else {
      setError('Please enter a number between 1 and 10');
    }
  };

  const handleOpen = (open) => {
    setIsOpen(open);
    if (open) {
      setTempValue(retrySets.toString());
      setError('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 hover:text-white transition-colors"
        title="Retry Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Retry Settings</DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure how many times to retry failed AI requests.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="retry-sets" className="text-slate-300">
                Number of Retry Sets
              </Label>
              <Input
                id="retry-sets"
                type="number"
                min="1"
                max="10"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400">
                Each set includes 3 retry attempts. Total retries: {tempValue ? parseInt(tempValue) * 3 : 0}
              </p>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <div className="bg-slate-900 p-3 rounded-lg space-y-1">
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Current setting:</strong> {retrySets} set{retrySets !== 1 ? 's' : ''} ({retrySets * 3} total retries)
              </p>
              <p className="text-xs text-slate-400">
                Higher values increase reliability but may take longer for failed requests.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
