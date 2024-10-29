'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'bg-black/50 fixed inset-0 z-50 animate-in fade-in',
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = 'ModalOverlay'

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onSubmit?: React.FormEventHandler<HTMLFormElement>
  }
>(({ className, children, onSubmit, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 grid w-full max-w-md scale-100 gap-4 bg-white p-6 opacity-100 animate-in fade-in-90 data-[state=open]:translate-y-0 data-[state=closed]:translate-y-4 md:rounded-lg md:border md:border-gray-200',
        className
      )}
      {...props}
    >
      {onSubmit ? (
        <form onSubmit={onSubmit}>
          {children}
        </form>
      ) : (
        children
      )}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M7 7L17 17M7 17L17 7"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
ModalContent.displayName = 'ModalContent'

const ModalHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
)

const ModalTitle = DialogPrimitive.Title

const ModalDescription = DialogPrimitive.Description

const ModalFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
)

export { Modal, ModalTrigger, ModalPortal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter }
