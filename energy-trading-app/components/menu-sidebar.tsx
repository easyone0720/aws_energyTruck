'use client'

import {
    Sheet,
    SheetContent,
} from '@/components/ui/sheet'
import {
    Wallet,
    Car,
    Home,
    Leaf,
    BookOpen,
    LogOut,
    ChevronRight,
    Sparkles,
    CreditCard,
    Zap,
    MoveRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { LocationSettingDialog } from './location-setting-dialog'

interface MenuSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onLogout: () => void
}

export function MenuSidebar({ open, onOpenChange, onLogout }: MenuSidebarProps) {
    const [locationOpen, setLocationOpen] = useState(false)

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05 + 0.1,
                duration: 0.4
            }
        })
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="left"
                className="w-[320px] sm:w-[380px] p-0 bg-background/95 backdrop-blur-lg text-foreground shadow-2xl rounded-r-[32px]"
            >
                <div className="flex flex-col h-full font-sans tracking-wide">

                    {/* Header / Profile */}
                    <div className="p-8 pt-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-5 mb-8"
                        >
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border border-border">
                                    <span className="text-2xl pt-1">🍊</span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3B82F6] rounded-full border-[2px] border-black" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">홍길동 님</h3>
                                <p className="text-[11px] text-zinc-400 font-light mt-0.5 tracking-wider">k_energy@email.com</p>
                            </div>
                        </motion.div>

                        {/* Minimalist Wallet Card */}
                        {/* Minimalist Wallet Card Removed */}
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto px-8 py-2 space-y-10">

                        {/* Section 1 */}
                        <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Assets</h4>
                            <div className="space-y-1">
                                <MenuButton
                                    icon={Car}
                                    label="내 차량 관리"
                                    rightElement={<span className="text-[10px] text-zinc-400 font-light tracking-wide">IONIQ 5</span>}
                                />
                                <MenuButton
                                    icon={Home}
                                    label="내 집 발전 현황"
                                    rightElement={<span className="text-[10px] text-[#3B82F6] font-medium tracking-wide">3.2 kWh</span>}
                                    onClick={() => setLocationOpen(true)}
                                />
                            </div>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Sustainability</h4>
                            <div className="space-y-1">
                                <MenuButton
                                    icon={Leaf}
                                    label="탄소 중립 점수"
                                    rightElement={<span className="text-[10px] text-zinc-300 font-light">85 / 100</span>}
                                />
                                <MenuButton
                                    icon={BookOpen}
                                    label="에너지 가계부"
                                />
                            </div>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Settings</h4>
                            <div className="space-y-1">
                                <MenuButton
                                    icon={CreditCard}
                                    label="결제 수단"
                                />
                                <MenuButton
                                    icon={Sparkles}
                                    label="멤버십 관리"
                                />
                            </div>
                        </motion.div>

                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-border">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 text-zinc-400 hover:text-foreground transition-colors text-xs font-medium tracking-wide group"
                        >
                            <LogOut className="w-4 h-4 stroke-[1.5] group-hover:stroke-foreground transition-colors" />
                            Sign Out
                        </button>
                    </div>

                </div>

            </SheetContent>

            <LocationSettingDialog
                open={locationOpen}
                onOpenChange={setLocationOpen}
            />
        </Sheet >
    )
}

// Minimalist Menu Button
interface MenuButtonProps {
    icon: any
    label: string
    rightElement?: React.ReactNode
    onClick?: () => void
}

function MenuButton({ icon: Icon, label, rightElement, onClick }: MenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between py-4 px-3 -mx-3 rounded-lg hover:bg-secondary/50 transition-all group"
        >
            <div className="flex items-center gap-4">
                <Icon className="w-5 h-5 stroke-[1px] text-zinc-400 group-hover:text-foreground transition-colors" />
                <span className="text-sm font-light text-zinc-300 group-hover:text-foreground transition-colors tracking-wide">{label}</span>
            </div>

            {rightElement && rightElement}
        </button>
    )
}
