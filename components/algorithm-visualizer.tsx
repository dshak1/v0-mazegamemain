"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Settings, TrendingUp, Clock, Zap } from "lucide-react"

interface AlgorithmVisualizerProps {
  onBack: () => void
}

type AlgorithmType = "dijkstra" | "astar" | "bfs" | "dfs"
type NodeState = "wall" | "empty" | "start" | "goal" | "exploring" | "explored" | "path"

interface Node {
  x: number
  y: number
  state: NodeState
  distance: number
  heuristic: number
  fScore: number
  parent: Node | null
}

interface AlgorithmStats {
  nodesExplored: number
  pathLength: number
  executionTime: number
  optimalPath: boolean
  efficiency: number
}

const GRID_SIZE = 20
const ALGORITHMS = {
  dijkstra: { name: "Dijkstra's Algorithm", color: "oklch(0.75 0.15 85)" },
  astar: { name: "A* Search", color: "oklch(0.6 0.15 140)" },
  bfs: { name: "Breadth-First Search", color: "oklch(0.7 0.2 200)" },
  dfs: { name: "Depth-First Search", color: "oklch(0.6 0.25 15)" },
}

export default function AlgorithmVisualizer({ onBack }: AlgorithmVisualizerProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("dijkstra")
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [grid, setGrid] = useState<Node[][]>([])
  const [stats, setStats] = useState<AlgorithmStats>({
    nodesExplored: 0,
    pathLength: 0,
    executionTime: 0,
    optimalPath: false,
    efficiency: 0,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [speed, setSpeed] = useState(100)

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: Node[] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        let state: NodeState = "empty"

        // Add some walls for complexity
        if (Math.random() < 0.25 && !(x === 1 && y === 1) && !(x === GRID_SIZE - 2 && y === GRID_SIZE - 2)) {
          state = "wall"
        }

        // Set start and goal
        if (x === 1 && y === 1) state = "start"
        if (x === GRID_SIZE - 2 && y === GRID_SIZE - 2) state = "goal"

        row.push({
          x,
          y,
          state,
          distance: Number.POSITIVE_INFINITY,
          heuristic: 0,
          fScore: Number.POSITIVE_INFINITY,
          parent: null,
        })
      }
      newGrid.push(row)
    }
    setGrid(newGrid)
  }, [])

  // Calculate heuristic (Manhattan distance)
  const calculateHeuristic = (node: Node, goal: Node): number => {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y)
  }

  // Get neighbors
  const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
    const neighbors: Node[] = []
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    for (const [dx, dy] of directions) {
      const newX = node.x + dx
      const newY = node.y + dy

      if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        const neighbor = grid[newY][newX]
        if (neighbor.state !== "wall") {
          neighbors.push(neighbor)
        }
      }
    }

    return neighbors
  }

  // Run algorithm visualization
  const runAlgorithm = async () => {
    if (!grid.length) return

    setIsRunning(true)
    setIsPaused(false)
    const startTime = Date.now()

    // Reset grid states
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        state: node.state === "exploring" || node.state === "explored" || node.state === "path" ? "empty" : node.state,
        distance: node.state === "start" ? 0 : Number.POSITIVE_INFINITY,
        fScore: Number.POSITIVE_INFINITY,
        parent: null,
      })),
    )

    const startNode = newGrid[1][1]
    const goalNode = newGrid[GRID_SIZE - 2][GRID_SIZE - 2]

    let nodesExplored = 0
    let pathFound = false

    if (selectedAlgorithm === "dijkstra" || selectedAlgorithm === "astar") {
      const openSet: Node[] = [startNode]
      const closedSet: Set<Node> = new Set()

      startNode.distance = 0
      if (selectedAlgorithm === "astar") {
        startNode.heuristic = calculateHeuristic(startNode, goalNode)
        startNode.fScore = startNode.heuristic
      }

      while (openSet.length > 0 && !pathFound) {
        // Sort by distance (Dijkstra) or fScore (A*)
        openSet.sort((a, b) => {
          if (selectedAlgorithm === "astar") {
            return a.fScore - b.fScore
          }
          return a.distance - b.distance
        })

        const current = openSet.shift()!
        closedSet.add(current)

        if (current === goalNode) {
          pathFound = true
          break
        }

        if (current.state !== "start" && current.state !== "goal") {
          current.state = "exploring"
        }

        nodesExplored++
        setStats((prev) => ({ ...prev, nodesExplored }))
        setGrid([...newGrid])

        await new Promise((resolve) => setTimeout(resolve, 101 - speed))

        const neighbors = getNeighbors(current, newGrid)

        for (const neighbor of neighbors) {
          if (closedSet.has(neighbor)) continue

          const tentativeDistance = current.distance + 1

          if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance
            neighbor.parent = current

            if (selectedAlgorithm === "astar") {
              neighbor.heuristic = calculateHeuristic(neighbor, goalNode)
              neighbor.fScore = neighbor.distance + neighbor.heuristic
            }

            if (!openSet.includes(neighbor)) {
              openSet.push(neighbor)
            }
          }
        }

        if (current.state !== "start" && current.state !== "goal") {
          current.state = "explored"
        }
      }
    }

    // Reconstruct path
    if (pathFound) {
      const path: Node[] = []
      let current: Node | null = goalNode

      while (current !== null) {
        if (current.state !== "start" && current.state !== "goal") {
          current.state = "path"
        }
        path.unshift(current)
        current = current.parent
      }

      // Animate path
      for (let i = 0; i < path.length; i++) {
        if (path[i].state === "path") {
          setGrid([...newGrid])
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      const executionTime = Date.now() - startTime
      const pathLength = path.length - 1
      const optimalPath = pathLength <= 35 // Rough estimate for this grid
      const efficiency = Math.max(0, 100 - (nodesExplored / (GRID_SIZE * GRID_SIZE)) * 100)

      setStats({
        nodesExplored,
        pathLength,
        executionTime,
        optimalPath,
        efficiency: Math.round(efficiency),
      })
    }

    setIsRunning(false)
  }

  const resetGrid = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentStep(0)
    setStats({
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      optimalPath: false,
      efficiency: 0,
    })
    initializeGrid()
  }

  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  const getNodeColor = (node: Node): string => {
    switch (node.state) {
      case "wall":
        return "oklch(0.2 0 0)"
      case "start":
        return "oklch(0.6 0.15 140)"
      case "goal":
        return "oklch(0.6 0.25 15)"
      case "exploring":
        return ALGORITHMS[selectedAlgorithm].color
      case "explored":
        return "oklch(0.3 0.1 240)"
      case "path":
        return "oklch(0.7 0.2 140)"
      default:
        return "oklch(0.15 0 0)"
    }
  }

  return (
    <div
      className="dashboard-dark min-h-screen p-6"
      style={{ backgroundColor: "oklch(0.08 0 0)", color: "oklch(0.85 0 0)" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="outline" className="border-border bg-transparent">
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Algorithm Visualizer</h1>
              <p className="text-muted-foreground">Interactive pathfinding algorithm analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-primary text-primary">
              Live Analysis
            </Badge>
            <Badge variant="outline">{ALGORITHMS[selectedAlgorithm].name}</Badge>
          </div>
        </div>

        {/* Algorithm Selection */}
        <Tabs value={selectedAlgorithm} onValueChange={(value) => setSelectedAlgorithm(value as AlgorithmType)}>
          <TabsList className="bg-card border border-border">
            <TabsTrigger
              value="dijkstra"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dijkstra
            </TabsTrigger>
            <TabsTrigger
              value="astar"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              A*
            </TabsTrigger>
            <TabsTrigger
              value="bfs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              BFS
            </TabsTrigger>
            <TabsTrigger
              value="dfs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              DFS
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualization Grid */}
          <div className="lg:col-span-3">
            <Card className="metric-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pathfinding Visualization</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={runAlgorithm}
                    disabled={isRunning}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? "Running..." : "Start"}
                  </Button>
                  <Button onClick={resetGrid} variant="outline" className="border-border bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="algorithm-grid p-4 rounded-lg border border-border">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                  {grid.map((row, y) =>
                    row.map((node, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={`algorithm-node w-6 h-6 border border-border/30 ${
                          node.state === "exploring" ? "exploring" : ""
                        } ${node.state === "path" ? "path" : ""}`}
                        style={{ backgroundColor: getNodeColor(node) }}
                        title={`(${x}, ${y}) - ${node.state} - Distance: ${node.distance === Number.POSITIVE_INFINITY ? "∞" : node.distance}`}
                      />
                    )),
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.6 0.15 140)" }}></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.6 0.25 15)" }}></div>
                  <span>Goal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.2 0 0)" }}></div>
                  <span>Wall</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: ALGORITHMS[selectedAlgorithm].color }}
                  ></div>
                  <span>Exploring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.3 0.1 240)" }}></div>
                  <span>Explored</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.7 0.2 140)" }}></div>
                  <span>Path</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-4">
            {/* Real-time Metrics */}
            <Card className="metric-card p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Live Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nodes Explored</span>
                  <span className="text-2xl font-bold text-primary">{stats.nodesExplored}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Path Length</span>
                  <span className="text-2xl font-bold">{stats.pathLength}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Execution Time</span>
                  <span className="text-lg font-semibold">{stats.executionTime}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                  <Badge
                    variant={stats.efficiency > 70 ? "default" : stats.efficiency > 40 ? "secondary" : "destructive"}
                    className={stats.efficiency > 70 ? "bg-success text-success-foreground" : ""}
                  >
                    {stats.efficiency}%
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="metric-card p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Algorithm Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Current:</span>
                  <p className="text-muted-foreground">{ALGORITHMS[selectedAlgorithm].name}</p>
                </div>
                <div>
                  <span className="font-medium">Time Complexity:</span>
                  <p className="text-muted-foreground">
                    {selectedAlgorithm === "dijkstra" && "O((V + E) log V)"}
                    {selectedAlgorithm === "astar" && "O(b^d)"}
                    {selectedAlgorithm === "bfs" && "O(V + E)"}
                    {selectedAlgorithm === "dfs" && "O(V + E)"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Optimal:</span>
                  <Badge variant={stats.optimalPath ? "default" : "secondary"} className="ml-2">
                    {stats.optimalPath ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Performance Chart */}
            <Card className="metric-card p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Performance
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nodes/Second</span>
                  <span>
                    {stats.executionTime > 0 ? Math.round((stats.nodesExplored / stats.executionTime) * 1000) : 0}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.nodesExplored / (GRID_SIZE * GRID_SIZE)) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Search space coverage: {Math.round((stats.nodesExplored / (GRID_SIZE * GRID_SIZE)) * 100)}%
                </div>
              </div>
            </Card>

            {/* Speed Control */}
            <Card className="metric-card p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Speed Control
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Animation Speed</span>
                  <span>{speed}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
