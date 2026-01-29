'use client'

import { useState, useEffect } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from '@/components/ui/drawer'
import { Check } from 'lucide-react'

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onApply: (period: string, sort: string) => void
    currentPeriod: string
    currentSort: string
}

export function FilterDrawer({
    open,
    onOpenChange,
    onApply,
    currentPeriod,
    currentSort
}: FilterDrawerProps) {
    const [period, setPeriod] = useState(currentPeriod)
    const [sort, setSort] = useState(currentSort)

    useEffect(() => {
        if (open) {
            setPeriod(currentPeriod)
            setSort(currentSort)
        }
    }, [open, currentPeriod, currentSort])

    const handleApply = () => {
        onApply(period, sort)
        onOpenChange(false)
    }

    const periods = ['1개월', '3개월', '지난달', '직접설정']
    const sorts = ['최신순', '과거순']

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-card border-border rounded-t-3xl">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-xl font-bold">필터 설정</DrawerTitle>
                    <DrawerDescription>
                        조회 기간과 정렬 방식을 선택해주세요.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-6">
                    {/* Period Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">조회 기간</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {periods.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`relative py-2.5 rounded-xl text-sm font-medium transition-all ${period === p
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                        }`}
                                >
                                    {p}
                                    {period === p && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">정렬</h3>
                        <div className="flex gap-2">
                            {sorts.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSort(s)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${sort === s
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                        }`}
                                >
                                    {s}
                                    {sort === s && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DrawerFooter className="pt-2 pb-8">
                    <button
                        onClick={handleApply}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]"
                    >
                        적용하기
                    </button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
