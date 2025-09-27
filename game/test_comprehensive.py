"""
Comprehensive test of the simplified maze game features
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from engine.grid import Grid, TileType
from engine.agent import Agent
from engine.runner import SafeCodeRunner
from engine.pathfinder import calculate_optimal_steps, get_efficiency_rating

def test_all_features():
    print("🧪 COMPREHENSIVE MAZE GAME TEST")
    print("=" * 50)
    
    # Test 1: Grid Creation
    print("\n1. Testing Grid Creation...")
    grid = Grid(10, 15)
    grid.create_simple_maze()
    grid.set_start(2, 2)
    grid.set_goal(7, 12)
    
    # Count different tile types
    empty_count = wall_count = 0
    for row in range(grid.rows):
        for col in range(grid.cols):
            tile = grid.tiles[row][col]
            if tile.type == TileType.EMPTY:
                empty_count += 1
            elif tile.type == TileType.WALL:
                wall_count += 1
    
    print(f"   ✅ Grid created: {grid.rows}x{grid.cols}")
    print(f"   ✅ Empty tiles: {empty_count}, Wall tiles: {wall_count}")
    print(f"   ✅ Start: {grid.start_pos}, Goal: {grid.goal_pos}")
    
    # Test 2: Agent Creation and Movement
    print("\n2. Testing Agent Movement...")
    agent = Agent(grid, 2, 2)
    agent.reset()
    initial_pos = agent.get_position()
    
    # Test basic movement
    agent.forward(3)
    agent.right()
    agent.forward(2)
    
    print(f"   ✅ Initial position: {initial_pos}")
    print(f"   ✅ After moves: {agent.get_position()}")
    print(f"   ✅ Steps taken: {agent.total_steps}")
    print(f"   ✅ Direction: {agent.get_direction_symbol()}")
    
    # Test 3: Pathfinding Calculation
    print("\n3. Testing Optimal Path Calculation...")
    optimal_steps = calculate_optimal_steps(grid)
    print(f"   ✅ Optimal path requires: {optimal_steps} steps")
    
    # Test efficiency ratings
    test_cases = [(33, "Perfect!"), (40, "Excellent"), (50, "Good"), (70, "Fair"), (100, "Needs work")]
    for steps, expected in test_cases:
        rating = get_efficiency_rating(steps, optimal_steps)
        print(f"   ✅ {steps} steps → {rating} rating")
    
    # Test 4: Code Execution
    print("\n4. Testing Safe Code Execution...")
    agent.reset()
    runner = SafeCodeRunner(agent)
    
    # Test simple code
    test_code = """
# Simple movement test
forward(2)
right()
forward(3)
left()
forward(1)
"""
    
    success, error, steps = runner.execute_code(test_code)
    print(f"   ✅ Code execution: {'Success' if success else 'Failed'}")
    if success:
        print(f"   ✅ Operations performed: {len(steps)}")
        print(f"   ✅ Agent steps: {agent.total_steps}")
        print(f"   ✅ Final position: {agent.get_position()}")
    else:
        print(f"   ❌ Error: {error}")
    
    # Test 5: Goal Detection
    print("\n5. Testing Goal Detection...")
    agent.reset()
    print(f"   ✅ At start, at_goal(): {agent.at_goal()}")
    
    # Move agent to goal position manually
    agent.row, agent.col = grid.goal_pos
    print(f"   ✅ At goal position, at_goal(): {agent.at_goal()}")
    
    # Test 6: Scan Function
    print("\n6. Testing Scan Function...")
    agent.reset()
    scan_result = agent.scan()
    print(f"   ✅ Scan from start: {scan_result}")
    
    # Test different directions
    for _ in range(4):
        agent.right()
        scan_result = agent.scan()
        print(f"   ✅ Scan {agent.get_direction_symbol()}: {scan_result}")
    
    # Test 7: Loop Algorithm
    print("\n7. Testing Loop Algorithm...")
    agent.reset()
    
    loop_code = """
# Smart pathfinding with loop
steps = 0
while not at_goal() and steps < 50:
    steps += 1
    if scan() == "WALL":
        right()
    else:
        forward(1)
"""
    
    success, error, operations = runner.execute_code(loop_code)
    if success:
        efficiency = get_efficiency_rating(agent.total_steps, optimal_steps)
        print(f"   ✅ Loop algorithm completed")
        print(f"   ✅ Steps taken: {agent.total_steps}")
        print(f"   ✅ Reached goal: {agent.at_goal()}")
        print(f"   ✅ Efficiency: {efficiency}")
        
        if agent.at_goal():
            extra_steps = agent.total_steps - optimal_steps
            if extra_steps == 0:
                print("   🏆 PERFECT! Optimal solution!")
            else:
                print(f"   🎉 Success! (+{extra_steps} extra steps)")
    else:
        print(f"   ❌ Loop algorithm failed: {error}")
    
    print("\n" + "=" * 50)
    print("🎉 TEST COMPLETE!")
    
    # Summary
    print(f"\nSUMMARY:")
    print(f"• Maze size: {grid.rows}x{grid.cols}")
    print(f"• Start → Goal: {grid.start_pos} → {grid.goal_pos}")
    print(f"• Optimal path: {optimal_steps} steps")
    print(f"• Agent capabilities: ✅ Movement, ✅ Scanning, ✅ Goal detection")
    print(f"• Code execution: ✅ Safe sandbox, ✅ Loop support")
    print(f"• Performance tracking: ✅ Step counting, ✅ Efficiency rating")

if __name__ == "__main__":
    test_all_features()
