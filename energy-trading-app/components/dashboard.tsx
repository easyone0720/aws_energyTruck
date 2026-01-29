'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Zap, Battery, TrendingUp, ArrowUpRight, ArrowDownRight, Leaf, Trees, Map, ClipboardList } from 'lucide-react'
import { PriceChart } from './price-chart'
import { BuyDrawer } from './buy-drawer'
import { SellDrawer } from './sell-drawer'
import { MyPageDrawer } from './mypage-drawer'
import { MenuSidebar } from './menu-sidebar'
import { NotificationSidebar } from './notification-sidebar'

interface DashboardProps {
  onLogout: () => void
  onHistory: () => void
}

export function Dashboard({ onLogout, onHistory }: DashboardProps) {
  const [buyDrawerOpen, setBuyDrawerOpen] = useState(false)
  const [sellDrawerOpen, setSellDrawerOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [myPageOpen, setMyPageOpen] = useState(false)
  const [userMode, setUserMode] = useState<'seller' | 'buyer'>('seller')

  // Notification State
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: '1', title: '거래 완료', message: '판매하신 50kWh 전력이 성공적으로 거래되었습니다.', time: '방금 전', read: false, type: 'success' },
    { id: '2', title: '가격 변동 알림', message: '현재 전력 가격이 250원으로 상승했습니다.', time: '10분 전', read: false, type: 'info' },
    { id: '3', title: '주간 리포트', message: '지난 주 에너지 거래 리포트가 도착했습니다.', time: '1일 전', read: true, type: 'info' },
  ] as any[])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const themeColor = userMode === 'seller' ? 'text-primary' : 'text-blue-500'

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {showMenu && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setShowMenu(false)}
        />
      )}
      {/* Top Bar */}
      <motion.header
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="flex items-center justify-between px-4 h-14"
          onClick={() => showMenu && setShowMenu(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(true)
            }}
            className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Mode Toggle */}
          <div
            className="flex bg-secondary rounded-full p-1 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setUserMode('buyer')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${userMode === 'buyer'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-foreground'
                }`}
            >
              구매자
            </button>
            <button
              onClick={() => setUserMode('seller')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${userMode === 'seller'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-zinc-400 hover:text-foreground'
                }`}
            >
              판매자
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationOpen(true)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Menu (Replaces Dropdown) */}
        <MenuSidebar
          open={showMenu}
          onOpenChange={setShowMenu}
          onLogout={onLogout}
        />
      </motion.header>

      {/* Notification Sidebar */}
      <NotificationSidebar
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-5 pb-24 space-y-4 overflow-y-auto">
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Battery className={`w-4 h-4 ${themeColor}`} />
              <span>{userMode === 'buyer' ? '내 차 배터리 잔량' : '보유 에너지 재고'}</span>
            </div>
            <p className="text-xl font-bold text-foreground">42.5 <span className="text-sm font-medium text-muted-foreground">kWh</span></p>
            <p className="text-xs text-muted-foreground mt-1">약 10,625원</p>
          </div>

          {userMode === 'seller' ? (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>이번달 수익</span>
              </div>
              <p className="text-xl font-bold text-primary">+18,420<span className="text-sm font-medium">원</span></p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">12%</span>
                <span className="text-xs text-muted-foreground">지난달 대비</span>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-4 border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Leaf className="w-4 h-4 text-green-500" />
                <span>탄소 저감 기여도</span>
              </div>
              <div className="text-xl font-bold text-green-500 flex items-center gap-1">
                <Trees className="w-5 h-5 fill-current" />
                2.4<span className="text-sm font-medium">그루</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">탄소 배출 저감 효과</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Current Price Card */}
        {/* Main Info Card */}
        <motion.div
          className={`rounded-2xl p-5 h-[180px] flex flex-col justify-between ${userMode === 'seller'
            ? 'bg-[#5512f1] shadow-lg shadow-indigo-500/20'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">
                {userMode === 'seller' ? '권장 판매 가격' : '최적 구매 가격'}
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {userMode === 'seller' ? '260원' : '245원'}
                <span className="text-lg font-medium opacity-80">/kWh</span>
              </p>
            </div>
            <button
              className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
              onClick={() => {
                // Placeholder for navigation
                console.log(userMode === 'seller' ? 'Go to Sales Registration' : 'Go to Map')
              }}
            >
              {userMode === 'seller' ? (
                <ClipboardList className="w-7 h-7 text-white" />
              ) : (
                <Map className="w-7 h-7 text-white" />
              )}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/30">
            {userMode === 'seller' ? (
              <div className="flex items-center gap-2">
                <div className="bg-emerald-400/20 px-2 py-1 rounded-lg">
                  <span className="text-xs font-bold text-emerald-300">New Tip</span>
                </div>
                <span className="text-xs text-blue-100 font-medium tracking-wide">
                  "오후 2-4시 사이 판매 수익률 최고!"
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-blue-50 font-medium">주변 이용 가능 트럭:</span>
                </div>
                <span className="text-sm font-bold text-white">5대</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Price Chart */}
        <PriceChart />

        {/* Recent Activity */}
        <motion.div
          className="bg-card rounded-2xl p-5 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">최근 거래</h3>
            <button
              onClick={onHistory}
              className={`text-xs hover:opacity-80 transition-opacity flex items-center gap-1 ${themeColor}`}
            >
              내 거래 내역 <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { type: 'sell', amount: 5.2, price: 1300, time: '2시간 전' },
              { type: 'buy', amount: 10.0, price: 2450, time: '어제' },
              { type: 'sell', amount: 8.3, price: 2075, time: '3일 전' },
              { type: 'buy', amount: 15.5, price: 3200, time: '4일 전' },
              { type: 'sell', amount: 12.1, price: 2900, time: '1주 전' },
            ].filter(tx => userMode === 'seller' ? tx.type === 'sell' : tx.type === 'buy')
              .slice(0, 3)
              .map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
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
                      <p className="font-medium text-foreground text-sm">
                        {tx.type === 'sell' ? '에너지 판매' : '에너지 구매'}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${tx.type === 'sell' ? 'text-primary' : 'text-foreground'}`}>
                      {tx.type === 'sell' ? '+' : '-'}{tx.price.toLocaleString()}원
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.amount} kWh</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </main>

      {/* Action Footer */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex gap-3">
          {userMode === 'buyer' ? (
            <button
              onClick={() => setBuyDrawerOpen(true)}
              className="flex-1 h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-border"
            >
              <Battery className="w-5 h-5" />
              충전하기
            </button>
          ) : (
            <button
              onClick={() => setSellDrawerOpen(true)}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Zap className="w-5 h-5" />
              수익내기
            </button>
          )}
        </div>
      </motion.div>

      {/* Drawers */}
      <BuyDrawer open={buyDrawerOpen} onOpenChange={setBuyDrawerOpen} />
      <SellDrawer open={sellDrawerOpen} onOpenChange={setSellDrawerOpen} />
      <MyPageDrawer open={myPageOpen} onOpenChange={setMyPageOpen} />
    </div>
  )
}
