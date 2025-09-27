"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MainMenuProps {
  onPlay: () => void
}

export default function MainMenu({ onPlay }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      {/* Retro Gaming Device */}
      <div className="relative">
        <Card className="w-80 h-96 bg-secondary border-4 border-foreground rounded-lg shadow-2xl">
          {/* Screen */}
          <div className="mx-6 mt-6 h-48 retro-screen rounded-sm scanlines flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-primary text-2xl pixel-text animate-pulse">████████</div>
              <div className="text-primary text-sm pixel-text">MAZE QUEST</div>
              <div className="text-primary/70 text-xs pixel-text">ALGORITHM EDITION</div>
            </div>
          </div>

          {/* D-Pad and Buttons */}
          <div className="flex justify-between items-center px-6 mt-6">
            {/* D-Pad */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-4 bg-foreground rounded-sm"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-12 bg-foreground rounded-sm"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full border-2 border-foreground"></div>
              <div className="w-8 h-8 bg-destructive rounded-full border-2 border-foreground"></div>
            </div>
          </div>

          {/* Start/Select */}
          <div className="flex justify-center space-x-4 mt-4">
            <div className="w-12 h-3 bg-muted border border-foreground rounded-full"></div>
            <div className="w-12 h-3 bg-muted border border-foreground rounded-full"></div>
          </div>
        </Card>
      </div>

      {/* Game Title */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold pixel-text text-foreground">MAZE QUEST</h1>
        <p className="text-xl pixel-text text-muted-foreground">Algorithm Learning Platform</p>
        <p className="text-sm pixel-text text-muted-foreground max-w-md">
          Master pathfinding algorithms through interactive maze challenges. Code your way to victory!
        </p>
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col space-y-4 w-64">
        <Button
          onClick={onPlay}
          className="retro-button h-12 text-lg pixel-text bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          ▶ PLAY GAME
        </Button>

        <Button
          variant="outline"
          className="retro-button h-12 text-lg pixel-text border-2 border-foreground bg-transparent"
        >
          📊 LEADERBOARD
        </Button>

        <Button
          variant="outline"
          className="retro-button h-12 text-lg pixel-text border-2 border-foreground bg-transparent"
        >
          ⚙ SETTINGS
        </Button>

        <Button
          variant="outline"
          className="retro-button h-12 text-lg pixel-text border-2 border-foreground bg-transparent"
        >
          ❓ HELP
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs pixel-text text-muted-foreground">
        <p>Press ▶ PLAY GAME to begin your algorithmic adventure</p>
        <p className="mt-2">© 2025 Maze Quest - Algorithm Learning Platform</p>
      </div>
    </div>
  )
}
