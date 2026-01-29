'use client'

import { useState } from 'react'
import { KakaoMap } from '@/components/kakao-map'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Zap, Battery } from 'lucide-react'

/**
 * 에너지 거래 지도 페이지
 * 제주도 내 에너지 거래 위치를 카카오맵으로 표시합니다.
 */
export function EnergyMapView() {
    // 제주도 에너지 거래 샘플 마커 데이터
    const [markers] = useState([
        {
            position: { lat: 33.4996, lng: 126.5312 },
            title: '제주시 에너지 허브',
            content: '<strong>제주시 에너지 허브</strong><br/>판매: 50kWh<br/>가격: 120원/kWh',
        },
        {
            position: { lat: 33.2541, lng: 126.5601 },
            title: '서귀포 태양광 발전소',
            content: '<strong>서귀포 태양광</strong><br/>판매: 120kWh<br/>가격: 110원/kWh',
        },
        {
            position: { lat: 33.3886, lng: 126.2625 },
            title: '한림 풍력 발전소',
            content: '<strong>한림 풍력</strong><br/>판매: 200kWh<br/>가격: 115원/kWh',
        },
        {
            position: { lat: 33.4273, lng: 126.9338 },
            title: '성산 에너지 스테이션',
            content: '<strong>성산 스테이션</strong><br/>구매 요청: 80kWh<br/>희망가: 125원/kWh',
        },
    ])

    const [selectedMarker, setSelectedMarker] = useState<any>(null)

    const handleMarkerClick = (marker: any) => {
        setSelectedMarker(marker)
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <MapPin className="w-8 h-8 text-primary" />
                        에너지 거래 지도
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        제주도 내 실시간 에너지 거래 위치를 확인하세요
                    </p>
                </div>
                <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    새 거래 등록
                </Button>
            </div>

            {/* 지도 및 정보 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 지도 영역 */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>거래 위치</CardTitle>
                        <CardDescription>
                            마커를 클릭하여 상세 정보를 확인하세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <KakaoMap
                            center={{ lat: 33.4996, lng: 126.5312 }}
                            level={10}
                            markers={markers}
                            onMarkerClick={handleMarkerClick}
                            className="h-[500px]"
                        />
                    </CardContent>
                </Card>

                {/* 선택된 마커 정보 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Battery className="w-5 h-5" />
                            거래 정보
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedMarker ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedMarker.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        위치: {selectedMarker.position.lat.toFixed(4)}, {selectedMarker.position.lng.toFixed(4)}
                                    </p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div dangerouslySetInnerHTML={{ __html: selectedMarker.content }} />
                                </div>
                                <div className="space-y-2">
                                    <Button className="w-full">거래 신청</Button>
                                    <Button variant="outline" className="w-full">상세 정보</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>지도에서 마커를 선택하세요</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 거래 목록 */}
            <Card>
                <CardHeader>
                    <CardTitle>활성 거래 목록</CardTitle>
                    <CardDescription>현재 진행 중인 에너지 거래</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {markers.map((marker, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedMarker(marker)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-sm">{marker.title}</h4>
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div
                                    className="text-xs text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: marker.content }}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
