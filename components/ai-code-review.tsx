"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AICodeReviewProps {
  code: string
  levelId: number
  steps: number
  optimal: number
}

export default function AICodeReview({ code, levelId, steps, optimal }: AICodeReviewProps) {
  const [review, setReview] = useState<{
    score: number
    feedback: string[]
    suggestions: string[]
    complexity: string
  } | null>(null)

  const analyzeCode = () => {
    // Simulate AI analysis
    const lineCount = code.split("\n").filter((line) => line.trim() && !line.trim().startsWith("#")).length
    const hasComments = code.includes("#")
    const efficiency = steps <= optimal ? 100 : Math.round((optimal / steps) * 100)

    const feedback: string[] = []
    const suggestions: string[] = []

    // Efficiency analysis
    if (steps === optimal) {
      feedback.push("✅ Perfect! You found the optimal path.")
    } else if (steps <= optimal * 1.1) {
      feedback.push("🎯 Excellent! Very close to optimal solution.")
      suggestions.push("Try reducing unnecessary turns to reach optimal.")
    } else if (steps <= optimal * 1.3) {
      feedback.push("👍 Good solution, but there's room for improvement.")
      suggestions.push("Analyze the maze structure to find shorter paths.")
      suggestions.push("Consider using diagonal thinking to reduce steps.")
    } else {
      feedback.push("⚠️ Solution works but is inefficient.")
      suggestions.push("Your path has significant redundancy.")
      suggestions.push("Try planning the entire route before coding.")
    }

    // Code quality analysis
    if (hasComments) {
      feedback.push("📝 Good documentation with comments!")
    } else {
      suggestions.push("Add comments to explain your algorithm strategy.")
    }

    if (lineCount < 5) {
      feedback.push("🎨 Clean, concise code!")
    } else if (lineCount > 15) {
      suggestions.push("Consider combining forward() calls to simplify code.")
    }

    // Algorithm-specific feedback
    if (levelId === 2) {
      suggestions.push("💡 Dijkstra Tip: Think about exploring all neighbors systematically.")
    } else if (levelId === 3) {
      suggestions.push("💡 A* Tip: Use Manhattan distance heuristic to guide your path.")
    } else if (levelId === 4) {
      suggestions.push("💡 MST Tip: Focus on connecting nodes with minimum total edge weight.")
    }

    const complexity =
      steps <= optimal * 1.1
        ? "O(n) - Optimal"
        : steps <= optimal * 1.5
          ? "O(n log n) - Good"
          : "O(n²) - Needs Optimization"

    setReview({
      score: efficiency,
      feedback,
      suggestions,
      complexity,
    })
  }

  if (!review) {
    return (
      <Card className="p-4 border-2 border-purple-400 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        <div className="text-center">
          <h3 className="text-lg font-bold pixel-text text-purple-300 mb-2">🤖 AI CODE REVIEW</h3>
          <p className="text-sm pixel-text text-purple-200 mb-4">Get intelligent feedback on your solution</p>
          <button
            onClick={analyzeCode}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold pixel-text rounded shadow-lg"
          >
            🔍 ANALYZE CODE
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 border-2 border-purple-400 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold pixel-text text-purple-300">🤖 AI CODE REVIEW</h3>
          <Badge className="pixel-text bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Score: {review.score}%
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-bold pixel-text text-pink-300 mb-2">📊 Complexity Analysis</h4>
            <p className="text-sm pixel-text text-purple-200">{review.complexity}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold pixel-text text-pink-300 mb-2">✅ Feedback</h4>
            <div className="space-y-1">
              {review.feedback.map((item, index) => (
                <p key={index} className="text-sm pixel-text text-green-300">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {review.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-bold pixel-text text-pink-300 mb-2">💡 Suggestions</h4>
              <div className="space-y-1">
                {review.suggestions.map((item, index) => (
                  <p key={index} className="text-sm pixel-text text-yellow-300">
                    • {item}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={analyzeCode}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold pixel-text rounded shadow-lg text-sm"
        >
          🔄 RE-ANALYZE
        </button>
      </div>
    </Card>
  )
}
