'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'

type TimeFilter = '일' | '월' | '년'

function generateChartData(filter: TimeFilter, date?: Date) {
  const now = date ? new Date(date) : new Date()

  // Normalize date to start of day for deterministic views
  if (filter === '일' || filter === '월') {
    now.setHours(0, 0, 0, 0)
  }

  const data = []

  let points: number
  let interval: number // minutes

  // Setup points/interval based on filter
  switch (filter) {
    case '일': // Previously 1D (24h)
      points = 24
      interval = 60
      break
    case '월': // Month (30 days)
      points = 30
      interval = 1440 // 1 day
      break
    case '년': // Year (12 months)
      points = 12
      interval = 43200 // ~30 days
      break
  }

  // Seed basePrice
  let basePrice = 235 + (now.getDate() % 10) * 5

  // Logic generation
  if (filter === '일') {
    // 0 to 24 hours
    for (let i = 0; i <= 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000)
      const fluctuation = (Math.sin(time.getTime() / 100000) * 10) + (Math.random() - 0.5) * 5
      basePrice = Math.max(200, Math.min(300, basePrice + fluctuation))

      data.push({
        time: i,
        price: Math.round(basePrice),
        displayTime: `${i}시`
      })
    }
  } else if (filter === '월') {
    // 1 to 30 days
    for (let i = 1; i <= 30; i++) {
      const time = new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000)
      const fluctuation = (Math.sin(time.getTime() / 100000) * 10) + (Math.random() - 0.5) * 5
      basePrice = Math.max(200, Math.min(300, basePrice + fluctuation))

      data.push({
        time: i,
        price: Math.round(basePrice),
        displayTime: `${i}일`
      })
    }
  } else {
    // '년' (Year) - 12 months
    for (let i = 1; i <= 12; i++) {
      // Simple generation: just using i as month index for simple axis
      const fluctuation = (Math.sin(i * 1000) * 20) + (Math.random() - 0.5) * 10
      basePrice = Math.max(200, Math.min(300, basePrice + fluctuation))

      data.push({
        time: i,
        price: Math.round(basePrice),
        displayTime: `${i}월`
      })
    }
  }

  return data
}

export function PriceChart() {
  const [filter, setFilter] = useState<TimeFilter>('년')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const data = useMemo(() => generateChartData(filter, date), [filter, date])

  const currentPrice = data[data.length - 1]?.price || 250
  const startPrice = data[0]?.price || 235
  const priceChange = currentPrice - startPrice
  const percentChange = ((priceChange / startPrice) * 100).toFixed(1)
  const isPositive = priceChange >= 0

  const filters: TimeFilter[] = ['일', '월', '년']

  // Custom tick formatter
  const formatXAxis = (tick: any) => {
    if (filter === '일') {
      if (tick === 0) return '0시'
      if (tick === 6) return '6시'
      if (tick === 12) return '12시'
      if (tick === 18) return '18시'
      if (tick === 24) return '0시'
      return ''
    }
    if (filter === '월') {
      if (tick === 1 || tick === 10 || tick === 20 || tick === 30) return `${tick}일`
      return ''
    }
    if (filter === '년') {
      // Show every 2-3 months to avoid crowding? Or just standard months.
      // Let's show even months to keep it clean: 2, 4, 6, 8, 10, 12 or quarterly
      if (tick === 1 || tick === 3 || tick === 6 || tick === 9 || tick === 12) return `${tick}월`
      return ''
    }
    return tick
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card rounded-2xl p-5 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">가격 추이</p>

        {/* Time Filters */}
        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="p-1 rounded-md hover:bg-secondary transition-colors">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setIsCalendarOpen(false)
                }}
                initialFocus
                locale={ko}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                classNames={{
                  dropdowns: "flex w-full items-center justify-center gap-1.5 text-sm font-medium flex-row-reverse"
                }}
                formatters={{
                  formatYearCaption: (date) => format(date, 'yyyy년', { locale: ko }),
                  formatMonthCaption: (date) => format(date, 'M월', { locale: ko }),
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[160px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 25, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8B949E' }}
              interval={filter === '일' || filter === '월' || filter === '년' ? 0 : 'preserveStartEnd'}
              ticks={
                filter === '일' ? [0, 6, 12, 18, 24] :
                  filter === '년' ? [1, 3, 6, 9, 12] : undefined
              }
              tickFormatter={formatXAxis}
              type={(filter === '일' || filter === '월' || filter === '년') ? 'number' : 'category'}
              domain={
                filter === '일' ? [0, 24] :
                  filter === '월' ? [1, 30] :
                    filter === '년' ? [1, 12] : undefined
              }
            />
            <YAxis
              domain={['dataMin - 10', 'dataMax + 10']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8B949E' }}
              width={40}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#21262D',
                border: '1px solid #30363D',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#8B949E', fontSize: 11 }}
              itemStyle={{ color: '#F0F6FC', fontSize: 13, fontWeight: 600 }}
              labelFormatter={(label, payload) => payload[0]?.payload.displayTime || label}
              formatter={(value: number) => [`${value.toLocaleString()}원`, '가격']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
        <div>
          <p className="text-xs text-muted-foreground">시작가</p>
          <p className="text-sm font-medium text-foreground">{startPrice.toLocaleString()}원</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">변동</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{priceChange}원 ({isPositive ? '+' : ''}{percentChange}%)
          </p>
        </div>
      </div>
    </motion.div>
  )
}
