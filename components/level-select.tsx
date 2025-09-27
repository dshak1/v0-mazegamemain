"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LevelSelectProps {
  onLevelSelect: (levelId: number) => void
  onBack: () => void
}

const levels = [
  {
    id: 1,
    name: "Basic Commands",
    description: "Learn forward(), left(), right()",
    difficulty: "BEGINNER",
    algorithm: "Manual Control",
    completed: false,
    stars: 0,
    bestSteps: null,
  },
  {
    id: 2,
    name: "Dijkstra's Algorithm",
    description: "Shortest path with weighted edges",
    difficulty: "INTERMEDIATE",
    algorithm: "Dijkstra",
    completed: false,
    stars: 0,
    bestSteps: null,
  },
  {
    id: 3,
    name: "A* Search",
    description: "Heuristic-based pathfinding",
    difficulty: "ADVANCED",
    algorithm: "A*",
    completed: false,
    stars: 0,
    bestSteps: null,
  },
  {
    id: 4,
    name: "Minimum Spanning Tree",
    description: "Connect all nodes efficiently",
    difficulty: "EXPERT",
    algorithm: "MST",
    completed: false,
    stars: 0,
    bestSteps: null,
  },
]

export default function LevelSelect({ onLevelSelect, onBack }: LevelSelectProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-primary text-primary-foreground"
      case "INTERMEDIATE":
        return "bg-accent text-accent-foreground"
      case "ADVANCED":
        return "bg-destructive text-destructive-foreground"
      case "EXPERT":
        return "bg-foreground text-background"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold pixel-text text-foreground">SELECT LEVEL</h1>
        <p className="text-lg pixel-text text-muted-foreground">Choose your algorithmic challenge</p>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {levels.map((level) => (
          <Card
            key={level.id}
            className="p-6 border-2 border-foreground hover:bg-secondary/50 transition-colors cursor-pointer retro-button"
            onClick={() => onLevelSelect(level.id)}
          >
            <div className="space-y-4">
              {/* Level Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold pixel-text text-foreground">LEVEL {level.id}</h3>
                  <p className="text-lg pixel-text text-foreground">{level.name}</p>
                </div>
                <Badge className={`pixel-text text-xs ${getDifficultyColor(level.difficulty)}`}>
                  {level.difficulty}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm pixel-text text-muted-foreground">{level.description}</p>

              {/* Algorithm Badge */}
              <div className="flex items-center space-x-2">
                <span className="text-xs pixel-text text-muted-foreground">ALGORITHM:</span>
                <Badge variant="outline" className="pixel-text text-xs border-foreground">
                  {level.algorithm}
                </Badge>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {level.completed ? (
                    <span className="text-primary pixel-text">✓ COMPLETED</span>
                  ) : (
                    <span className="text-muted-foreground pixel-text">○ NOT STARTED</span>
                  )}
                </div>

                {level.completed && (
                  <div className="flex items-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < level.stars ? "text-accent" : "text-muted"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Best Score */}
              {level.bestSteps && (
                <div className="text-xs pixel-text text-muted-foreground">BEST: {level.bestSteps} STEPS</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="retro-button h-12 text-lg pixel-text border-2 border-foreground w-48 bg-transparent"
      >
        ← BACK TO MENU
      </Button>

      {/* Instructions */}
      <div className="text-center text-xs pixel-text text-muted-foreground max-w-2xl">
        <p>Each level teaches a different pathfinding algorithm.</p>
        <p>Complete challenges to earn stars and unlock advanced techniques!</p>
      </div>
    </div>
  )
}
