'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ProductDeleteDialogProps {
  readonly isOpen: boolean;
  readonly productTitle: string;
  readonly isDeleting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function ProductDeleteDialog({
  isOpen,
  productTitle,
  isDeleting,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-destructive">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Confirm Product Deletion</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete <strong className="text-foreground">{productTitle}</strong>?
        </p>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-800 dark:text-amber-300 leading-normal space-y-1">
          <p className="font-semibold">Simulated Deletion & Snapshot Preservation:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Existing customer orders retain historical product snapshots.</li>
            <li>The product will no longer appear in customer search or recommendation rails.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
