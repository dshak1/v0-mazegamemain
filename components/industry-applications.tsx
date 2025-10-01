"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IndustryApplicationsProps {
  onBack: () => void
}

export default function IndustryApplications({ onBack }: IndustryApplicationsProps) {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold pixel-text text-foreground">🏭 INDUSTRY APPLICATIONS</h1>
          <p className="text-sm pixel-text text-muted-foreground mt-2">
            See how real companies use these algorithms in production
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="retro-button pixel-text border-foreground bg-transparent">
          ← BACK
        </Button>
      </div>

      <Tabs defaultValue="dijkstra" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary border-2 border-foreground">
          <TabsTrigger value="dijkstra" className="pixel-text">
            Dijkstra
          </TabsTrigger>
          <TabsTrigger value="astar" className="pixel-text">
            A*
          </TabsTrigger>
          <TabsTrigger value="bfs" className="pixel-text">
            BFS
          </TabsTrigger>
          <TabsTrigger value="dfs" className="pixel-text">
            DFS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dijkstra" className="space-y-4 mt-6">
          <Card className="p-6 border-2 border-yellow-400 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold pixel-text text-yellow-300">Dijkstra's Algorithm</h2>
                <p className="text-sm pixel-text text-cyan-200 mt-2">Shortest path in weighted graphs</p>
              </div>
              <Badge className="pixel-text bg-green-500 text-white">PRODUCTION READY</Badge>
            </div>

            <div className="space-y-6">
              {/* Google Maps */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🗺️</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Google Maps</h3>
                    <p className="text-xs pixel-text text-cyan-200">Navigation & Route Planning</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Google Maps uses Dijkstra's algorithm to find the shortest driving route between two locations,
                  considering road distances as edge weights. Processes millions of route requests per second.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-blue-500">Real-time Traffic</Badge>
                  <Badge className="pixel-text text-xs bg-purple-500">Weighted Edges</Badge>
                  <Badge className="pixel-text text-xs bg-orange-500">Billions of Nodes</Badge>
                </div>
              </div>

              {/* Network Routing */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🌐</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Internet Routing (OSPF)</h3>
                    <p className="text-xs pixel-text text-cyan-200">Network Packet Routing</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  OSPF (Open Shortest Path First) protocol uses Dijkstra to route internet packets through the most
                  efficient network path. Powers the backbone of internet infrastructure.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-red-500">Mission Critical</Badge>
                  <Badge className="pixel-text text-xs bg-green-500">Low Latency</Badge>
                  <Badge className="pixel-text text-xs bg-yellow-500">Global Scale</Badge>
                </div>
              </div>

              {/* Uber/Lyft */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🚗</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Uber / Lyft</h3>
                    <p className="text-xs pixel-text text-cyan-200">Driver-Passenger Matching</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Ride-sharing apps use Dijkstra to calculate optimal pickup routes and match drivers with passengers
                  based on shortest travel time, considering traffic conditions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-pink-500">Real-time Matching</Badge>
                  <Badge className="pixel-text text-xs bg-indigo-500">Dynamic Weights</Badge>
                  <Badge className="pixel-text text-xs bg-teal-500">Cost Optimization</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="astar" className="space-y-4 mt-6">
          <Card className="p-6 border-2 border-yellow-400 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold pixel-text text-yellow-300">A* Search Algorithm</h2>
                <p className="text-sm pixel-text text-cyan-200 mt-2">Heuristic-based pathfinding</p>
              </div>
              <Badge className="pixel-text bg-green-500 text-white">PRODUCTION READY</Badge>
            </div>

            <div className="space-y-6">
              {/* Video Games */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🎮</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Video Game AI</h3>
                    <p className="text-xs pixel-text text-cyan-200">NPC Pathfinding</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Games like StarCraft, League of Legends, and The Sims use A* for NPC movement. Calculates paths in
                  real-time for hundreds of units simultaneously with minimal CPU overhead.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-purple-500">Real-time AI</Badge>
                  <Badge className="pixel-text text-xs bg-red-500">Performance Critical</Badge>
                  <Badge className="pixel-text text-xs bg-blue-500">Multi-agent</Badge>
                </div>
              </div>

              {/* Robotics */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Autonomous Robots</h3>
                    <p className="text-xs pixel-text text-cyan-200">Warehouse & Delivery Robots</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Amazon warehouse robots and delivery drones use A* to navigate around obstacles and find efficient
                  paths. Processes sensor data in real-time to avoid collisions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-orange-500">Obstacle Avoidance</Badge>
                  <Badge className="pixel-text text-xs bg-green-500">Real-time Planning</Badge>
                  <Badge className="pixel-text text-xs bg-yellow-500">Safety Critical</Badge>
                </div>
              </div>

              {/* GPS Navigation */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Waze Navigation</h3>
                    <p className="text-xs pixel-text text-cyan-200">Smart Route Planning</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Waze uses A* with traffic heuristics to predict the fastest route, considering historical traffic
                  patterns and real-time user reports. Optimizes for time rather than distance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-indigo-500">Predictive Routing</Badge>
                  <Badge className="pixel-text text-xs bg-pink-500">Crowd-sourced Data</Badge>
                  <Badge className="pixel-text text-xs bg-teal-500">Time Optimization</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bfs" className="space-y-4 mt-6">
          <Card className="p-6 border-2 border-yellow-400 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold pixel-text text-yellow-300">Breadth-First Search</h2>
                <p className="text-sm pixel-text text-cyan-200 mt-2">Level-by-level exploration</p>
              </div>
              <Badge className="pixel-text bg-green-500 text-white">PRODUCTION READY</Badge>
            </div>

            <div className="space-y-6">
              {/* Social Networks */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">👥</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Facebook / LinkedIn</h3>
                    <p className="text-xs pixel-text text-cyan-200">Friend Suggestions & Connections</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Social networks use BFS to find "People You May Know" by exploring friend connections level by level.
                  Also used to calculate degrees of separation between users.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-blue-500">Social Graphs</Badge>
                  <Badge className="pixel-text text-xs bg-purple-500">Recommendation Engine</Badge>
                  <Badge className="pixel-text text-xs bg-green-500">Billions of Users</Badge>
                </div>
              </div>

              {/* Web Crawlers */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🕷️</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Google Search Crawler</h3>
                    <p className="text-xs pixel-text text-cyan-200">Web Indexing</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Google's web crawler uses BFS to discover and index web pages by following links systematically.
                  Crawls billions of pages to keep search results up-to-date.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-red-500">Web Scale</Badge>
                  <Badge className="pixel-text text-xs bg-yellow-500">Distributed System</Badge>
                  <Badge className="pixel-text text-xs bg-orange-500">Continuous Crawling</Badge>
                </div>
              </div>

              {/* Network Broadcasting */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">📡</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Network Broadcasting</h3>
                    <p className="text-xs pixel-text text-cyan-200">Peer-to-Peer Networks</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  BitTorrent and blockchain networks use BFS to broadcast messages to all peers efficiently. Ensures
                  every node receives updates in minimum time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-indigo-500">P2P Networks</Badge>
                  <Badge className="pixel-text text-xs bg-pink-500">Message Propagation</Badge>
                  <Badge className="pixel-text text-xs bg-teal-500">Decentralized</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dfs" className="space-y-4 mt-6">
          <Card className="p-6 border-2 border-yellow-400 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold pixel-text text-yellow-300">Depth-First Search</h2>
                <p className="text-sm pixel-text text-cyan-200 mt-2">Deep exploration strategy</p>
              </div>
              <Badge className="pixel-text bg-green-500 text-white">PRODUCTION READY</Badge>
            </div>

            <div className="space-y-6">
              {/* Maze Generation */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">🎲</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Procedural Generation</h3>
                    <p className="text-xs pixel-text text-cyan-200">Game Level Design</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Games like Minecraft and Spelunky use DFS to generate random mazes and dungeon layouts. Creates
                  unique, solvable levels procedurally for infinite replayability.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-purple-500">Procedural Content</Badge>
                  <Badge className="pixel-text text-xs bg-blue-500">Maze Generation</Badge>
                  <Badge className="pixel-text text-xs bg-green-500">Infinite Worlds</Badge>
                </div>
              </div>

              {/* File Systems */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">📁</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">File System Search</h3>
                    <p className="text-xs pixel-text text-cyan-200">Directory Traversal</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Operating systems use DFS to search through directory trees. Commands like "find" and "grep" traverse
                  folders depth-first to locate files efficiently.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-orange-500">OS Level</Badge>
                  <Badge className="pixel-text text-xs bg-red-500">Tree Traversal</Badge>
                  <Badge className="pixel-text text-xs bg-yellow-500">Memory Efficient</Badge>
                </div>
              </div>

              {/* Dependency Resolution */}
              <div className="p-4 bg-slate-950 border-2 border-cyan-400 rounded">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">📦</div>
                  <div>
                    <h3 className="text-lg font-bold pixel-text text-cyan-300">Package Managers</h3>
                    <p className="text-xs pixel-text text-cyan-200">npm, pip, cargo</p>
                  </div>
                </div>
                <p className="text-sm pixel-text text-green-300 leading-relaxed mb-3">
                  Package managers use DFS to resolve dependency trees and detect circular dependencies. Ensures correct
                  installation order for software packages.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="pixel-text text-xs bg-indigo-500">Dependency Resolution</Badge>
                  <Badge className="pixel-text text-xs bg-pink-500">Cycle Detection</Badge>
                  <Badge className="pixel-text text-xs bg-teal-500">Build Systems</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
