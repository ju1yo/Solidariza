"use client"

import React, { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Landmark, ShoppingBasket, Shirt, Baby, Dog, User } from "lucide-react"
import { renderToString } from "react-dom/server"

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MarkerData {
  id: string
  title: string
  latitude: number | null
  longitude: number | null
  helpType: string
  authorName?: string
}

interface Props {
  markers: MarkerData[]
}

export default function HelpRequestMap({ markers }: Props) {
  const manausCoords: [number, number] = [-3.1190, -60.0217]

  const getMarkerIcon = (helpType: string) => {
    let color = "#ef4444" // Default red-500
    let Icon = Heart

    if (helpType.includes("Alimentos")) { color = "#f59e0b"; Icon = ShoppingBasket; }
    if (helpType.includes("Roupas")) { color = "#3b82f6"; Icon = Shirt; }
    if (helpType.includes("Bebês")) { color = "#ec4899"; Icon = Baby; }
    if (helpType.includes("Animais")) { color = "#10b981"; Icon = Dog; }
    if (helpType.includes("Voluntário")) { color = "#8b5cf6"; Icon = Landmark; }

    const iconHtml = renderToString(
      <div style={{ 
        backgroundColor: color, 
        width: "36px", 
        height: "36px", 
        borderRadius: "50% 50% 50% 0", 
        transform: "rotate(-45deg)", 
        border: "3px solid white", 
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <div style={{ transform: "rotate(45deg)", color: "white" }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
    )

    return L.divIcon({
      className: "custom-div-icon",
      html: iconHtml,
      iconSize: [36, 48],
      iconAnchor: [18, 48],
    })
  }

  return (
    <div className="h-[600px] w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-gray-100 group relative">
      <MapContainer 
        center={manausCoords} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.filter(m => m.latitude && m.longitude).map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.latitude!, marker.longitude!]}
            icon={getMarkerIcon(marker.helpType)}
          >
            <Popup className="premium-popup">
              <div className="p-1 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <User size={12} />
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Pedido de Ajuda</span>
                </div>
                <h4 className="font-black text-sm text-gray-900 leading-tight mb-1">{marker.title}</h4>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{marker.helpType}</span>
                </div>
                <Button asChild size="sm" className="w-full h-9 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black shadow-lg shadow-red-100 transition-all active:scale-95">
                  <Link href={`/solicitacoes/${marker.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl space-y-2 pointer-events-none">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legenda de Manaus</p>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
            <div className="w-2 h-2 rounded-full bg-amber-500" /> Alimentos
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
            <div className="w-2 h-2 rounded-full bg-blue-500" /> Roupas
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Animais
         </div>
      </div>
    </div>
  )
}
