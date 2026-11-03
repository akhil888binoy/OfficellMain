import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const ConfirmDialog = ({ open, title, description, deleting, onClose, onDelete }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={() => { if (!deleting) onClose(); }} className="relative z-30">
    <DialogBackdrop className="fixed inset-0 bg-black/80" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-950 p-5 text-white shadow-xl">
        <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
        <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-800 pt-4">
          <button type="button" data-autofocus onClick={onClose} disabled={deleting} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-900 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onDelete} disabled={deleting} className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50">{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
);
