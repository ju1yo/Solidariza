import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"

export interface Notification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  link: string | null
  createdAt: string
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return
    
    try {
      setLoading(true)
      const res = await fetch("/api/notifications")
      if (!res.ok) throw new Error("Erro ao buscar notificações")
      
      const { notifications, unreadCount } = await res.json()
      setNotifications(notifications)
      setUnreadCount(unreadCount)
    } catch (err) {
      console.error("Erro ao carregar notificações:", err)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Poll every 60s
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error("Erro ao marcar como lida:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}
