'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import { MapPin, Search, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LocationSettingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LocationSettingDialog({ open, onOpenChange }: LocationSettingDialogProps) {
    const [step, setStep] = useState<'search' | 'pin'>('search')
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
        lat: 37.566826,
        lng: 126.9786567
    })

    // Reset step when dialog opens
    useEffect(() => {
        if (open) {
            setStep('search')
        }
    }, [open])

    const [loading, error] = useKakaoLoader({
        appkey: "YOUR_JAVASCRIPT_APP_KEY", // [!] User must replace this with valid key
        libraries: ["services", "clusterer", "drawing"],
    })

    const handleComplete = (data: any) => {
        let fullAddress = data.address
        let extraAddress = ''

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
        }

        setAddress(fullAddress)

        // Mock geocoding (In real app, use Kakao Maps Services Geocoder)
        // For now, we'll just move to the map step with dummy coords update or keep default
        // To make it realistic, we often need the geocoder service which needs the script loaded with libraries=services
        // We will assume the map will load and user refines it.
        setStep('pin')
    }

    const handleConfirm = () => {
        // Save logic here (e.g. API call or global state update)
        console.log('Saved Location:', { address, coordinates })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] sm:max-w-[500px] bg-black/80 backdrop-blur-xl border-white/10 text-white p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        발전 설비 위치 설정
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs">
                        {step === 'search'
                            ? '설비가 설치된 도로명 주소를 검색해주세요.'
                            : '지도를 움직여 정확한 설치 위치를 지정해주세요.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 pt-2 min-h-[400px]">
                    {step === 'search' ? (
                        <div className="h-[400px] rounded-xl overflow-hidden border border-white/10">
                            <DaumPostcodeEmbed
                                onComplete={handleComplete}
                                style={{ height: '100%' }}
                                theme={{
                                    bgColor: '#18181b', // dark background check
                                    searchBgColor: '#18181b',
                                    contentBgColor: '#27272a',
                                    pageBgColor: '#18181b',
                                    textColor: '#ffffff',
                                    queryTextColor: '#ffffff',
                                    outlineColor: '#3f3f46'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/10 flex items-start gap-3">
                                <div className="p-1.5 bg-primary/10 rounded-full mt-0.5">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-primary font-bold mb-0.5">선택된 주소</p>
                                    <p className="text-sm text-zinc-200 leading-snug">{address}</p>
                                </div>
                            </div>

                            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-white/10 relative">
                                {loading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                ) : error ? (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-red-500 text-xs text-center p-4">
                                        <p>지도 로드 실패.<br />API 키를 확인해주세요.</p>
                                    </div>
                                ) : (
                                    <Map
                                        center={coordinates}
                                        style={{ width: '100%', height: '100%' }}
                                        level={3}
                                        onCenterChanged={(map) => setCoordinates({
                                            lat: map.getCenter().getLat(),
                                            lng: map.getCenter().getLng(),
                                        })}
                                    >
                                        <MapMarker position={coordinates} />
                                    </Map>
                                )}

                                {/* Center Pin HUD */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                    <div className="relative">
                                        <MapPin className="w-8 h-8 text-primary drop-shadow-lg -mt-8" fill="currentColor" />
                                        <div className="w-2 h-2 bg-primary absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full animate-ping" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl text-base"
                                onClick={handleConfirm}
                            >
                                <Check className="w-5 h-5 mr-2" />
                                이 위치로 설정하기
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
