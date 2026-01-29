'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Bell, CheckCheck, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    title: string
    message: string
    time: string
    read: boolean
    type: 'info' | 'alert' | 'success'
}

interface NotificationSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    notifications: Notification[]
    onMarkAsRead: (id: string) => void
    onMarkAllAsRead: () => void
}

export function NotificationSidebar({
    open,
    onOpenChange,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead
}: NotificationSidebarProps) {

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[320px] sm:w-[380px] p-0 bg-background/95 backdrop-blur-lg border-l border-border">
                <div className="flex flex-col h-full font-sans">

                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-foreground" />
                            <h2 className="text-lg font-bold text-foreground">알림</h2>
                            {unreadCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                            <CheckCheck className="w-3 h-3" /> 모두 읽음
                        </button>
                    </div>

                    {/* List */}
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    알림이 없습니다.
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => onMarkAsRead(n.id)}
                                        className={cn(
                                            "text-left p-5 border-b border-border/50 transition-all hover:bg-secondary/50 relative group",
                                            // Read vs Unread styling
                                            n.read ? "bg-background/40 opacity-70" : "bg-primary/5 hover:bg-primary/10"
                                        )}
                                    >
                                        {/* Unread Indicator Dot */}
                                        {!n.read && (
                                            <div className="absolute top-6 right-5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        )}

                                        <div className="pr-4">
                                            <h4 className={cn(
                                                "text-sm mb-1 line-clamp-1",
                                                n.read ? "font-medium text-muted-foreground" : "font-bold text-foreground"
                                            )}>
                                                {n.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground/80">
                                                <Clock className="w-3 h-3" />
                                                {n.time}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}
