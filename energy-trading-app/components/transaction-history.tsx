import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react'
import { FilterDrawer } from './filter-drawer'

interface TransactionHistoryProps {
    onBack: () => void
}

export function TransactionHistory({ onBack }: TransactionHistoryProps) {
    const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [period, setPeriod] = useState('1개월')
    const [sort, setSort] = useState('최신순')

    // Mock Data
    const transactions = [
        { id: 1, type: 'sell', amount: 5.2, price: 1300, date: '2024. 01. 28 14:30', status: 'completed' },
        { id: 2, type: 'buy', amount: 10.0, price: 2450, date: '2024. 01. 27 09:15', status: 'completed' },
        { id: 3, type: 'sell', amount: 8.3, price: 2075, date: '2024. 01. 25 18:20', status: 'completed' },
        { id: 4, type: 'buy', amount: 15.0, price: 3600, date: '2024. 01. 24 11:00', status: 'completed' },
        { id: 5, type: 'sell', amount: 3.5, price: 875, date: '2024. 01. 23 15:45', status: 'completed' },
        { id: 6, type: 'sell', amount: 12.0, price: 3000, date: '2024. 01. 22 10:30', status: 'completed' },
        { id: 7, type: 'buy', amount: 20.0, price: 4800, date: '2024. 01. 20 08:00', status: 'completed' },
        { id: 8, type: 'sell', amount: 6.8, price: 1700, date: '2024. 01. 19 16:10', status: 'completed' },
    ]

    const filteredTransactions = transactions
        .filter(tx => {
            if (filter === 'all') return true
            return tx.type === filter
        })
        .sort((a, b) => {
            // Basic string sort works for "YYYY. MM. DD HH:mm" format
            if (sort === '최신순') {
                return b.date.localeCompare(a.date)
            } else {
                return a.date.localeCompare(b.date)
            }
        })

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar */}
            <motion.header
                className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center px-4 h-14 gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h1 className="text-lg font-bold text-foreground">내 거래 내역</h1>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-5 pb-24 space-y-4 overflow-y-auto">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setFilter('buy')}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'buy'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}
                    >
                        구매 내역
                    </button>
                    <button
                        onClick={() => setFilter('sell')}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'sell'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}
                    >
                        판매 내역
                    </button>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-full border border-border ml-auto ${period !== '1개월' || sort !== '최신순'
                                ? 'bg-primary/10 text-primary border-primary/50'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        {(period !== '1개월' || sort !== '최신순') && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                </div>

                {/* Transaction List */}
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                >
                    {filteredTransactions.map((tx) => (
                        <motion.div
                            layout
                            key={tx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card rounded-2xl p-4 border border-border shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'sell' ? 'bg-primary/10' : 'bg-secondary'
                                        }`}>
                                        {tx.type === 'sell' ? (
                                            <ArrowUpRight className="w-5 h-5 text-primary" />
                                        ) : (
                                            <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {tx.type === 'sell' ? '에너지 판매' : '에너지 충전'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    완료됨
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-border pt-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">거래 수량</p>
                                    <p className="font-medium text-foreground">{tx.amount} kWh</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground mb-1">총 금액</p>
                                    <p className={`text-lg font-bold ${tx.type === 'sell' ? 'text-primary' : 'text-foreground'}`}>
                                        {tx.type === 'sell' ? '+' : '-'}{tx.price.toLocaleString()}원
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            <FilterDrawer
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                currentPeriod={period}
                currentSort={sort}
                onApply={(p, s) => {
                    setPeriod(p)
                    setSort(s)
                }}
            />
        </div>
    )
}
