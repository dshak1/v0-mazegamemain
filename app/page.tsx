"use client"

import { useState } from "react"
import MainMenu from "@/components/main-menu"
import LevelSelect from "@/components/level-select"
import GameInterface from "@/components/game-interface"

type GameState = "menu" | "levelSelect" | "playing"

export default function MazeGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const handlePlay = () => {
    setGameState("levelSelect")
  }

  const handleLevelSelect = (levelId: number) => {
    setSelectedLevel(levelId)
    setGameState("playing")
  }

  const handleBackToMenu = () => {
    setGameState("menu")
    setSelectedLevel(null)
  }

  const handleBackToLevels = () => {
    setGameState("levelSelect")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {gameState === "menu" && <MainMenu onPlay={handlePlay} />}

        {gameState === "levelSelect" && <LevelSelect onLevelSelect={handleLevelSelect} onBack={handleBackToMenu} />}

        {gameState === "playing" && selectedLevel !== null && (
          <GameInterface levelId={selectedLevel} onBackToLevels={handleBackToLevels} onBackToMenu={handleBackToMenu} />
        )}
      </div>
    </div>
  )
}
