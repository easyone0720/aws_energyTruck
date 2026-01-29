'use client'

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { User, Wallet, Car, Battery, ChevronRight, Settings, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

interface MyPageDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MyPageDrawer({ open, onOpenChange }: MyPageDrawerProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-card border-t border-border focus:outline-none h-[85vh]">
                <div className="mx-auto w-full max-w-md flex flex-col h-full">
                    <DrawerHeader className="border-b border-border/50 pb-4">
                        <DrawerTitle className="text-center font-bold text-lg">마이페이지</DrawerTitle>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">

                        {/* User Profile Section */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">김에너지</h3>
                                <p className="text-sm text-muted-foreground">energy_master@email.com</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                        인증된 판매자
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                                        구매 등급: Gold
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Assets Card */}
                        <div className="bg-secondary/30 rounded-2xl p-5 border border-border">
                            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> 나의 자산
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">보유 포인트</p>
                                    <p className="text-lg font-bold">128,450 P</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">연결 계좌</p>
                                    <p className="text-lg font-bold">KakaoBank</p>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2.5 bg-background rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                                <CreditCard className="w-4 h-4" /> 충전 / 환급 관리
                            </button>
                        </div>

                        {/* Vehicle Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <Car className="w-5 h-5 text-primary" /> 등록 차량 정보
                            </h4>

                            <div className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center shadow-sm">
                                <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                    <Car className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-base">Tesla Model Y</p>
                                    <p className="text-sm text-muted-foreground">12가 3456</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-green-500 font-medium text-sm justify-end">
                                        <Battery className="w-4 h-4 fill-current" /> 82%
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">배터리 상태 우수</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu List */}
                        <div className="space-y-2 pt-2">
                            {[
                                { icon: Settings, label: '앱 설정' },
                                { icon: User, label: '개인정보 수정' },
                                { icon: Camera, label: '결제 수단 관리' }, // Using Camera just as a placeholder if CreditCard is used elsewhere or import
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-background transition-colors">
                                            <item.icon className="w-4 h-4 text-foreground" />
                                        </div>
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

// Helper for icon dummy
import { Camera } from 'lucide-react'
