import { useState } from 'react';
import { Save, Eye, Trash2, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormActionsProps {
  onSave: (asDraft?: boolean) => void;
  onPreview?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  isNew?: boolean;
  hasChanges?: boolean;
  mode?: 'create' | 'edit';
}

export function FormActions({
  onSave,
  onPreview,
  onDelete,
  onCancel,
  isSaving = false,
  isNew = false,
  hasChanges = true,
  mode: _mode = 'create',
}: FormActionsProps) {
  // _mode is kept for future use
  void _mode;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left side - Cancel/Back */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Delete button (only for edit mode) */}
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}

            {/* Preview button */}
            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 disabled:opacity-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}

            {/* Save as Draft */}
            <button
              type="button"
              onClick={() => onSave(true)}
              disabled={isSaving || !hasChanges}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-30 transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Draft
            </button>

            {/* Save/Publish button */}
            <button
              type="button"
              onClick={() => onSave(false)}
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isNew ? 'Publish' : 'Update'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a1a] border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Delete Item?</h3>
                  <p className="text-white/50 text-sm mt-1">
                    This action cannot be undone. The item will be permanently removed from the database.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete?.();
                    setShowDeleteConfirm(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
