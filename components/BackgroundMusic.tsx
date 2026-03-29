"use client"

import { useEffect, useRef, useState } from "react"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("music-enabled")
    if (saved === "true") playMusic()
  }, [])

  const playMusic = async () => {
    if (!audioRef.current) return
    try {
      audioRef.current.volume = 0.3
      await audioRef.current.play()
      setIsPlaying(true)
      localStorage.setItem("music-enabled", "true")
    } catch (err) {
      console.log("Autoplay blocked until user interaction")
    }
  }

  const stopMusic = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    localStorage.setItem("music-enabled", "false")
  }

  const toggleMusic = () => {
    if (isPlaying) stopMusic()
    else playMusic()
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/song.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 18px",
          borderRadius: "12px",
          backgroundColor: "#111",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "14px",
        }}
      >
        {isPlaying ? "🔊 Music ON" : "🎵 Music OFF"}
      </button>
    </>
  )
}
