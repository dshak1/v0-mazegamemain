"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface LeaderboardEntry {
  rank: number
  name: string
  level: string
  steps: number
  time: string
  efficiency: number
}

interface LeaderboardProps {
  onBack: () => void
}

// Generate random leaderboard entries
const generateRandomEntries = (): LeaderboardEntry[] => {
  const names = [
    "ALEX_CODE",
    "BYTE_MASTER",
    "ALGO_NINJA",
    "PATH_FINDER",
    "MAZE_RUNNER",
    "CODE_WIZARD",
    "PIXEL_HERO",
    "RETRO_GAMER",
    "LOGIC_LORD",
    "CYBER_ACE",
    "GRID_WALKER",
    "STEP_COUNTER",
    "ROUTE_KING",
    "MAZE_SOLVER",
    "BIT_CRUSHER",
    "ALGO_BEAST",
    "PATH_SAGE",
    "CODE_KNIGHT",
    "PIXEL_PUNK",
    "RETRO_REBEL",
  ]

  const levels = ["BASIC", "DIJKSTRA", "A_STAR", "MST"]
  const levelOptimal = { BASIC: 28, DIJKSTRA: 45, A_STAR: 32, MST: 38 }

  const entries: LeaderboardEntry[] = []

  for (let i = 0; i < 15; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const optimal = levelOptimal[level as keyof typeof levelOptimal]
    const steps = optimal + Math.floor(Math.random() * 15) - 5 // Some variation around optimal
    const efficiency = Math.max(50, Math.min(100, Math.round((optimal / Math.max(steps, optimal)) * 100)))

    entries.push({
      rank: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      level,
      steps: Math.max(steps, optimal),
      time: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      efficiency,
    })
  }

  // Sort by efficiency (highest first)
  return entries
    .sort((a, b) => b.efficiency - a.efficiency)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL")

  useEffect(() => {
    setEntries(generateRandomEntries())
  }, [])

  const filteredEntries = selectedLevel === "ALL" ? entries : entries.filter((entry) => entry.level === selectedLevel)

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "bg-green-500"
    if (efficiency >= 85) return "bg-blue-500"
    if (efficiency >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold pixel-text bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
          LEADERBOARD
        </h1>
        <p className="text-lg pixel-text text-yellow-300">Top Algorithm Masters</p>
      </div>

      {/* Level Filter */}
      <div className="flex space-x-2">
        {["ALL", "BASIC", "DIJKSTRA", "A_STAR", "MST"].map((level) => (
          <Button
            key={level}
            onClick={() => setSelectedLevel(level)}
            variant={selectedLevel === level ? "default" : "outline"}
            className={`retro-button pixel-text text-sm ${
              selectedLevel === level
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg"
                : "border-2 border-yellow-400 bg-transparent text-yellow-300 hover:bg-yellow-400/20"
            }`}
          >
            {level.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Leaderboard */}
      <Card className="w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-yellow-400 rounded-lg shadow-2xl">
        <div className="retro-screen scanlines p-6">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 pb-4 border-b-2 border-yellow-400/50 text-yellow-300 pixel-text text-sm font-bold">
            <div>RANK</div>
            <div>PLAYER</div>
            <div>LEVEL</div>
            <div>STEPS</div>
            <div>TIME</div>
            <div>EFFICIENCY</div>
          </div>

          {/* Entries */}
          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto">
            {filteredEntries.slice(0, 10).map((entry) => (
              <div
                key={`${entry.name}-${entry.level}-${entry.rank}`}
                className={`grid grid-cols-6 gap-4 py-3 px-2 rounded transition-all hover:scale-[1.02] ${
                  entry.rank <= 3
                    ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 shadow-lg"
                    : "hover:bg-yellow-400/10 hover:border hover:border-yellow-400/30"
                }`}
              >
                <div className="text-yellow-300 pixel-text font-bold text-lg">{getRankIcon(entry.rank)}</div>
                <div className="text-cyan-300 pixel-text truncate font-semibold">{entry.name}</div>
                <div className="text-green-300 pixel-text">
                  <Badge
                    variant="outline"
                    className="pixel-text text-xs border-green-400 text-green-300 bg-green-400/10"
                  >
                    {entry.level.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-blue-300 pixel-text font-mono">{entry.steps}</div>
                <div className="text-purple-300 pixel-text font-mono">{entry.time}</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getEfficiencyColor(entry.efficiency)} shadow-lg`}></div>
                  <span className="text-yellow-300 pixel-text text-sm font-bold">{entry.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-yellow-300/70 pixel-text">
              No entries found for {selectedLevel} level
            </div>
          )}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-cyan-400 p-4 text-center shadow-lg">
          <div className="text-2xl font-bold pixel-text text-white">{filteredEntries.length}</div>
          <div className="text-sm pixel-text text-cyan-200">TOTAL PLAYERS</div>
        </Card>
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-2 border-green-400 p-4 text-center shadow-lg">
          <div className="text-2xl font-bold pixel-text text-white">
            {filteredEntries.length > 0
              ? Math.round(filteredEntries.reduce((acc, e) => acc + e.efficiency, 0) / filteredEntries.length)
              : 0}
            %
          </div>
          <div className="text-sm pixel-text text-green-200">AVG EFFICIENCY</div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-2 border-orange-400 p-4 text-center shadow-lg">
          <div className="text-2xl font-bold pixel-text text-white">
            {filteredEntries.length > 0 ? Math.min(...filteredEntries.map((e) => e.steps)) : 0}
          </div>
          <div className="text-sm pixel-text text-orange-200">BEST STEPS</div>
        </Card>
      </div>

      {/* Back Button */}
      <Button
        onClick={onBack}
        className="retro-button h-12 text-lg pixel-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold w-64 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        ← BACK TO MENU
      </Button>

      {/* Footer */}
      <div className="text-center text-xs pixel-text text-yellow-300/70">
        <p>Leaderboard updates every 24 hours</p>
      </div>
    </div>
  )
}
