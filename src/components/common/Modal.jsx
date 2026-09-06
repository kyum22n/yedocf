import { createPortal } from "react-dom";
import Button from "@/components/common/Button";
import { useEffect, useState } from "react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    actionLabel,
    onAction,
    cancelLabel,
    onCancel,
    resetOnClose = false,
}) => {

    const [internalKey, setInternalKey] = useState(0);

    useEffect(() => {
        if (!isOpen && resetOnClose) {
            setInternalKey(prev => prev + 1);
        }
    }, [isOpen, resetOnClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                key={internalKey}
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>

                {children}

                <div className="mt-6 flex justify-end gap-2">
                    {cancelLabel && (
                        <Button variant="secondary" onClick={onCancel || onClose} className="mr-2">
                            {cancelLabel}
                        </Button>
                    )}
                    {actionLabel && (
                        <Button variant="success" onClick={onAction} className="mr-2">
                            {actionLabel}
                        </Button>
                    )}
                </div>

                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-5 text-gray-500 text-lg font-bold"
                >
                    ✕
                </button>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
