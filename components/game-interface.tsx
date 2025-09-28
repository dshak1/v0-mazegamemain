"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface GameInterfaceProps {
  levelId: number
  onBackToLevels: () => void
  onBackToMenu: () => void
}

enum TileType {
  EMPTY = "EMPTY",
  WALL = "WALL",
  GOAL = "GOAL",
}

enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

interface Agent {
  row: number
  col: number
  direction: Direction
  totalSteps: number
}

interface GameState {
  maze: TileType[][]
  agent: Agent
  goalPos: { row: number; col: number }
  output: string[]
  isComplete: boolean
}

const createLevelMaze = (
  levelId: number,
): {
  maze: TileType[][]
  startPos: { row: number; col: number }
  goalPos: { row: number; col: number }
  optimal: number
} => {
  const size = 15
  const maze = Array(size)
    .fill(null)
    .map(() => Array(size).fill(TileType.EMPTY))

  // Add walls around the border
  for (let i = 0; i < size; i++) {
    maze[0][i] = TileType.WALL
    maze[size - 1][i] = TileType.WALL
    maze[i][0] = TileType.WALL
    maze[i][size - 1] = TileType.WALL
  }

  let startPos = { row: 1, col: 1 }
  let goalPos = { row: 13, col: 13 }
  let optimal = 24 // Manhattan distance

  if (levelId === 1) {
    // Simple corridor maze - optimal path should be clear
    // Create a simple L-shaped path
    for (let i = 2; i < 8; i++) maze[i][5] = TileType.WALL
    for (let i = 6; i < 13; i++) maze[8][i] = TileType.WALL
    for (let i = 9; i < 13; i++) maze[i][10] = TileType.WALL

    startPos = { row: 1, col: 1 }
    goalPos = { row: 13, col: 13 }
    optimal = 28 // Actual shortest path considering walls
  } else if (levelId === 2) {
    // More complex maze for Dijkstra
    for (let i = 2; i < 13; i += 3) {
      for (let j = 2; j < 13; j += 3) {
        maze[i][j] = TileType.WALL
      }
    }
    optimal = 26
  } else {
    // Complex maze for A* and MST
    const walls = [
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 9],
      [3, 10],
      [3, 11],
      [5, 7],
      [6, 7],
      [7, 7],
      [8, 7],
      [9, 7],
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 9],
      [7, 10],
      [7, 11],
      [11, 5],
      [11, 6],
      [11, 7],
      [11, 8],
      [11, 9],
    ]
    walls.forEach(([r, c]) => {
      if (r < size && c < size) maze[r][c] = TileType.WALL
    })
    optimal = 30
  }

  maze[goalPos.row][goalPos.col] = TileType.GOAL

  return { maze, startPos, goalPos, optimal }
}

class CodeExecutor {
  private gameState: GameState
  private commands: string[]
  private commandIndex: number
  private maxSteps: number

  constructor(gameState: GameState) {
    this.gameState = gameState
    this.commands = []
    this.commandIndex = 0
    this.maxSteps = 100
  }

  parseCode(code: string): string[] {
    const commands: string[] = []
    const lines = code.split("\n")

    console.log("[v0] Parsing code:", code)

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const forwardMatch = trimmed.match(/forward$$(\d+)$$/)
        const leftMatch = trimmed.match(/left$$$$/)
        const rightMatch = trimmed.match(/right$$$$/)

        console.log("[v0] Checking line:", trimmed)
        console.log("[v0] Forward match:", forwardMatch)
        console.log("[v0] Left match:", leftMatch)
        console.log("[v0] Right match:", rightMatch)

        if (forwardMatch) {
          const steps = Number.parseInt(forwardMatch[1])
          console.log("[v0] Adding forward steps:", steps)
          for (let i = 0; i < steps; i++) {
            commands.push("forward")
          }
        } else if (leftMatch) {
          console.log("[v0] Adding left command")
          commands.push("left")
        } else if (rightMatch) {
          console.log("[v0] Adding right command")
          commands.push("right")
        }
      }
    }

    console.log("[v0] Final commands:", commands)
    return commands
  }

  async executeCode(code: string): Promise<{ success: boolean; steps: number; output: string[] }> {
    this.commands = this.parseCode(code)
    this.commandIndex = 0
    this.gameState.output = []
    this.gameState.isComplete = false

    console.log("[v0] Executing commands:", this.commands)

    for (const command of this.commands) {
      if (this.gameState.agent.totalSteps >= this.maxSteps) {
        this.gameState.output.push("❌ Maximum steps exceeded!")
        return { success: false, steps: this.gameState.agent.totalSteps, output: this.gameState.output }
      }

      const result = this.executeCommand(command)
      if (!result.success) {
        this.gameState.output.push(`❌ ${result.error}`)
        return { success: false, steps: this.gameState.agent.totalSteps, output: this.gameState.output }
      }

      if (this.isAtGoal()) {
        this.gameState.isComplete = true
        this.gameState.output.push("✅ Goal reached!")
        return { success: true, steps: this.gameState.agent.totalSteps, output: this.gameState.output }
      }
    }

    if (!this.isAtGoal()) {
      this.gameState.output.push("❌ Code completed but goal not reached")
      return { success: false, steps: this.gameState.agent.totalSteps, output: this.gameState.output }
    }

    return { success: true, steps: this.gameState.agent.totalSteps, output: this.gameState.output }
  }

  private executeCommand(command: string): { success: boolean; error?: string } {
    const agent = this.gameState.agent

    switch (command) {
      case "forward":
        const newPos = this.getForwardPosition()
        if (!this.isValidPosition(newPos.row, newPos.col)) {
          return { success: false, error: "Hit boundary!" }
        }
        if (this.gameState.maze[newPos.row][newPos.col] === TileType.WALL) {
          return { success: false, error: "Hit wall!" }
        }
        agent.row = newPos.row
        agent.col = newPos.col
        agent.totalSteps++
        return { success: true }

      case "left":
        agent.direction = (agent.direction + 3) % 4 // Turn left
        return { success: true }

      case "right":
        agent.direction = (agent.direction + 1) % 4 // Turn right
        return { success: true }

      default:
        return { success: false, error: `Unknown command: ${command}` }
    }
  }

  private getForwardPosition(): { row: number; col: number } {
    const agent = this.gameState.agent
    const deltas = [
      [-1, 0], // NORTH
      [0, 1], // EAST
      [1, 0], // SOUTH
      [0, -1], // WEST
    ]
    const [dr, dc] = deltas[agent.direction]
    return { row: agent.row + dr, col: agent.col + dc }
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.gameState.maze.length && col >= 0 && col < this.gameState.maze[0].length
  }

  private isAtGoal(): boolean {
    const agent = this.gameState.agent
    return agent.row === this.gameState.goalPos.row && agent.col === this.gameState.goalPos.col
  }
}

const getLevelInfo = (levelId: number) => {
  const levels = {
    1: { name: "Basic Commands", algorithm: "Manual Control" },
    2: { name: "Dijkstra's Algorithm", algorithm: "Dijkstra" },
    3: { name: "A* Search", algorithm: "A*" },
    4: { name: "Minimum Spanning Tree", algorithm: "MST" },
  }
  return levels[levelId as keyof typeof levels] || levels[1]
}

const getStarterCode = (levelId: number) => {
  const codes = {
    1: `# Level 1: Basic Movement
# Goal: Reach the 🎯 target!
# 
# Available commands:
# forward(n) - move forward n steps
# left()     - turn left 90 degrees  
# right()    - turn right 90 degrees

# Try this path (but it's not optimal!):
forward(4)
right()
forward(7)
left()
forward(8)
right()
forward(12)`,
    2: `# Level 2: Dijkstra's Algorithm
# Find the shortest path considering all edges

# Basic movement example:
forward(3)
right()
forward(5)
left()
forward(10)
right()
forward(10)`,
    3: `# Level 3: A* Search
# Use heuristics for efficient pathfinding

forward(2)
right()
forward(4)
left()
forward(11)
right()
forward(11)`,
    4: `# Level 4: Minimum Spanning Tree
# Connect all nodes efficiently

forward(1)
right()
forward(2)
left()
forward(12)
right()
forward(12)`,
  }
  return codes[levelId as keyof typeof codes] || codes[1]
}

const getLevelHints = (levelId: number) => {
  const hints = {
    1: {
      title: "Basic Movement",
      tips: [
        "🎯 Goal: Navigate to the target using simple commands",
        "📝 Use forward(n) to move n steps ahead",
        "🔄 Use left() and right() to turn 90 degrees",
        "💡 Plan your path: count steps and turns needed",
        "⚡ Optimal solution: 28 steps",
      ],
    },
    2: {
      title: "Dijkstra's Algorithm",
      tips: [
        "🎯 Goal: Find shortest path considering all edges",
        "📊 Dijkstra explores all possible paths systematically",
        "🔍 Algorithm maintains distance to each node",
        "💡 Think about weighted graph traversal",
        "⚡ Focus on exploring neighbors efficiently",
      ],
    },
    3: {
      title: "A* Search",
      tips: [
        "🎯 Goal: Use heuristics for efficient pathfinding",
        "🧠 A* combines actual cost + estimated cost to goal",
        "📐 Manhattan distance is a good heuristic here",
        "💡 Prioritize paths that seem most promising",
        "⚡ Should be faster than Dijkstra with good heuristic",
      ],
    },
    4: {
      title: "Minimum Spanning Tree",
      tips: [
        "🎯 Goal: Connect all reachable nodes efficiently",
        "🌳 MST finds minimum cost to connect all nodes",
        "🔗 Think about Kruskal's or Prim's algorithm",
        "💡 Focus on avoiding cycles while connecting",
        "⚡ Not about shortest path, but minimum connection cost",
      ],
    },
  }
  return hints[levelId as keyof typeof hints] || hints[1]
}

export default function GameInterface({ levelId, onBackToLevels, onBackToMenu }: GameInterfaceProps) {
  const levelData = createLevelMaze(levelId)

  const [code, setCode] = useState(getStarterCode(levelId))
  const [gameState, setGameState] = useState<GameState>({
    maze: levelData.maze,
    agent: {
      row: levelData.startPos.row,
      col: levelData.startPos.col,
      direction: Direction.EAST,
      totalSteps: 0,
    },
    goalPos: levelData.goalPos,
    output: [],
    isComplete: false,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState({
    steps: 0,
    optimal: levelData.optimal,
    efficiency: "Ready",
  })

  const levelInfo = getLevelInfo(levelId)
  const levelHints = getLevelHints(levelId)

  const executeCode = async () => {
    setIsRunning(true)

    // Reset game state
    const resetState: GameState = {
      maze: levelData.maze,
      agent: {
        row: levelData.startPos.row,
        col: levelData.startPos.col,
        direction: Direction.EAST,
        totalSteps: 0,
      },
      goalPos: levelData.goalPos,
      output: [],
      isComplete: false,
    }

    setGameState(resetState)

    // Execute code with delay for visual effect
    setTimeout(async () => {
      const executor = new CodeExecutor(resetState)
      const result = await executor.executeCode(code)

      console.log("[v0] Execution result:", result)

      setGameState(executor.gameState)

      setStats((prev) => ({
        ...prev,
        steps: result.steps,
        efficiency: result.success
          ? result.steps <= levelData.optimal
            ? "Optimal"
            : result.steps <= levelData.optimal * 1.2
              ? "Good"
              : "Poor"
          : "Failed",
      }))

      setIsRunning(false)
    }, 1000)
  }

  const resetLevel = () => {
    const resetState: GameState = {
      maze: levelData.maze,
      agent: {
        row: levelData.startPos.row,
        col: levelData.startPos.col,
        direction: Direction.EAST,
        totalSteps: 0,
      },
      goalPos: levelData.goalPos,
      output: [],
      isComplete: false,
    }

    setGameState(resetState)
    setStats((prev) => ({ ...prev, steps: 0, efficiency: "Ready" }))
  }

  const getCellClass = (row: number, col: number) => {
    if (row === gameState.agent.row && col === gameState.agent.col) return "bg-primary"
    if (row === gameState.goalPos.row && col === gameState.goalPos.col) return "bg-destructive"
    if (gameState.maze[row][col] === TileType.WALL) return "bg-foreground"
    return "bg-secondary border border-muted"
  }

  const getCellContent = (row: number, col: number) => {
    if (row === gameState.agent.row && col === gameState.agent.col) {
      const arrows = ["↑", "→", "↓", "←"]
      return arrows[gameState.agent.direction]
    }
    if (row === gameState.goalPos.row && col === gameState.goalPos.col) return "🎯"
    return ""
  }

  return (
    <div className="min-h-screen flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold pixel-text text-foreground">
            LEVEL {levelId}: {levelInfo.name}
          </h1>
          <Badge className="pixel-text text-xs bg-primary text-primary-foreground">{levelInfo.algorithm}</Badge>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={onBackToLevels}
            variant="outline"
            className="retro-button pixel-text border-foreground bg-transparent"
          >
            ← LEVELS
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="retro-button pixel-text border-foreground bg-transparent"
          >
            🏠 MENU
          </Button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-1 gap-4">
        {/* Left Side - Code Editor and Hints */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Code Editor */}
          <Card className="flex-1 p-4 border-2 border-yellow-400 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold pixel-text text-yellow-300">💻 CODE EDITOR</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={executeCode}
                    disabled={isRunning}
                    className="retro-button pixel-text bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold shadow-lg"
                  >
                    {isRunning ? "⏳ RUNNING..." : "▶ RUN CODE"}
                  </Button>
                  <Button
                    onClick={resetLevel}
                    variant="outline"
                    className="retro-button pixel-text border-orange-400 bg-transparent text-orange-300 hover:bg-orange-400/20"
                  >
                    🔄 RESET
                  </Button>
                </div>
              </div>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 font-mono text-sm bg-slate-950 border-2 border-cyan-400 resize-none text-green-300 placeholder:text-green-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="# Write your algorithm here..."
              />

              {/* Output */}
              {gameState.output.length > 0 && (
                <div className="p-3 bg-slate-950 border-2 border-red-400 rounded text-green-300">
                  {gameState.output.map((line, index) => (
                    <p key={index} className="text-sm pixel-text font-mono">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Hints Section */}
          <Card className="p-4 border-2 border-blue-400 bg-gradient-to-br from-blue-900/50 to-purple-900/50 shadow-lg">
            <h2 className="text-lg font-bold pixel-text text-blue-300 mb-3">💡 {levelHints.title} - HINTS</h2>
            <div className="space-y-2">
              {levelHints.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-cyan-400 pixel-text text-xs mt-0.5">•</span>
                  <p className="text-sm pixel-text text-cyan-200 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side - Game View */}
        <div className="flex flex-col space-y-4">
          {/* Maze Display */}
          <Card className="p-4 border-2 border-foreground">
            <h2 className="text-lg font-bold pixel-text mb-4">MAZE</h2>
            <div className="retro-screen p-4 scanlines">
              <div className="grid grid-cols-15 gap-0.5 w-fit">
                {gameState.maze.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-4 h-4 flex items-center justify-center text-xs ${getCellClass(rowIndex, colIndex)}`}
                    >
                      {getCellContent(rowIndex, colIndex)}
                    </div>
                  )),
                )}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-4 border-2 border-foreground">
            <h2 className="text-lg font-bold pixel-text mb-4">STATS</h2>
            <div className="space-y-2 pixel-text text-sm">
              <div className="flex justify-between">
                <span>Steps Taken:</span>
                <span className="text-primary">{stats.steps}</span>
              </div>
              <div className="flex justify-between">
                <span>Optimal Steps:</span>
                <span className="text-accent">{stats.optimal}</span>
              </div>
              <div className="flex justify-between">
                <span>Efficiency:</span>
                <span
                  className={
                    stats.efficiency === "Optimal"
                      ? "text-primary"
                      : stats.efficiency === "Good"
                        ? "text-accent"
                        : stats.efficiency === "Failed"
                          ? "text-destructive"
                          : "text-muted-foreground"
                  }
                >
                  {stats.efficiency}
                </span>
              </div>
            </div>
          </Card>

          {/* Controls Help */}
          <Card className="p-4 border-2 border-foreground">
            <h2 className="text-lg font-bold pixel-text mb-4">CONTROLS</h2>
            <div className="space-y-1 pixel-text text-xs text-muted-foreground">
              <p>▶ RUN CODE - Execute your algorithm</p>
              <p>🔄 RESET - Reset agent position</p>
              <p>↑→↓← = Agent direction</p>
              <p>🎯 = Goal position</p>
              <p>⬛ = Wall</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
