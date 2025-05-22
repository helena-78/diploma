"use client"

// Inspired by react-hot-toast library
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastProps {
  id: string
  visible: boolean
}

// Simple toast implementation
export function toast(props: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9)
  const toast: Toast = {
    id,
    visible: true,
    variant: "default",
    duration: 3000,
    ...props,
  }

  // Add toast to DOM
  const toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    const container = document.createElement("div")
    container.id = "toast-container"
    container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(container)
  }

  const toastElement = document.createElement("div")
  toastElement.id = `toast-${id}`
  toastElement.className = `bg-white border p-4 rounded-lg shadow-lg transition-all transform translate-x-0 max-w-sm ${
    toast.variant === "destructive"
      ? "border-red-500"
      : toast.variant === "success"
        ? "border-green-500"
        : "border-gray-200"
  }`

  toastElement.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-medium ${
          toast.variant === "destructive"
            ? "text-red-700"
            : toast.variant === "success"
              ? "text-green-700"
              : "text-gray-900"
        }">${toast.title}</h3>
        ${toast.description ? `<p class="text-sm text-gray-500">${toast.description}</p>` : ""}
      </div>
      <button class="text-gray-400 hover:text-gray-500" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `

  const container = document.getElementById("toast-container")
  container?.appendChild(toastElement)

  // Add animation
  setTimeout(() => {
    toastElement.classList.add("translate-x-0", "opacity-100")
  }, 10)

  // Add close button functionality
  const closeButton = toastElement.querySelector("button")
  closeButton?.addEventListener("click", () => {
    toastElement.classList.add("translate-x-full", "opacity-0")
    setTimeout(() => {
      toastElement.remove()
    }, 300)
  })

  // Auto-dismiss
  setTimeout(() => {
    toastElement.classList.add("translate-x-full", "opacity-0")
    setTimeout(() => {
      toastElement.remove()
    }, 300)
  }, toast.duration)

  return id
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast }
