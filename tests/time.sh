#!/bin/bash

# Number of times to run the command
iterations=300

# Command to time
command="node perf.cjs"

# Variable to accumulate total time in milliseconds
total_time=0

for ((i=1; i<=iterations; i++)); do
    # Time the command and get the real time in milliseconds
    start_time=$(date +%s%3N)
    $command
    end_time=$(date +%s%3N)
    
    # Calculate the elapsed time in milliseconds
    elapsed=$((end_time - start_time))
    
    # Accumulate the elapsed time
    total_time=$((total_time + elapsed))
    
    echo "Iteration $i: $elapsed ms"
done

# Calculate average time in milliseconds
average_time=$(echo "scale=2; $total_time / $iterations" | bc)

echo "Average execution time: $average_time ms"
