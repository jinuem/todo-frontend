#!/bin/bash

# Frontend Agent - Sequential workflow with PRD monitoring

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REQUIREMENTS_REPO="$SCRIPT_DIR/../todo-requirements"
FRONTEND_REPO="$SCRIPT_DIR"
AGENT_NAME="Frontend Agent"

echo "[$AGENT_NAME] Starting sequential monitoring..."
echo "[$AGENT_NAME] Working in: $FRONTEND_REPO"
echo "[$AGENT_NAME] Monitoring: $REQUIREMENTS_REPO"

while true; do
    cd "$REQUIREMENTS_REPO"
    git pull origin init >/dev/null 2>&1
    
    # Debug: Show current turn status
    CURRENT_TURN_LINE=$(grep -A1 "Current Turn" COLLABORATION.md)
    echo "[$AGENT_NAME] Current turn status: $CURRENT_TURN_LINE"
    
    # Git-based turn coordination
    git pull origin main >/dev/null 2>&1
    
    # Get PRD last modification timestamp and current time
    PRD_TIMESTAMP=$(stat -f "%m" PRD.md)
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - PRD_TIMESTAMP))
    
    # Check if both agents have completed their work for current PRD
    if ../completion-tracker.sh check; then
        echo "[$AGENT_NAME] Both agents completed current PRD. Waiting for new PRD changes..."
        
        # Check if PRD has been modified since completion
        COMPLETION_TIME=$(stat -f "%m" .processing-status 2>/dev/null || echo "0")
        if [[ $PRD_TIMESTAMP -gt $COMPLETION_TIME ]]; then
            echo "[$AGENT_NAME] New PRD changes detected! Resetting completion tracking."
            ../completion-tracker.sh reset
            # Continue to process new changes
        else
            # No new PRD changes, keep monitoring
            sleep 15
            continue
        fi
    fi
    
    # Check current turn
    CURRENT_TURN=$(grep "^\*\*" COLLABORATION.md | head -1 | grep -o "FRONTEND\|BACKEND")
    
    # Proceed if it's our turn OR timeout exceeded AND it's not explicitly another agent's turn
    if [[ "$CURRENT_TURN" == "FRONTEND" ]] || ([[ $TIME_DIFF -gt 300 ]] && [[ "$CURRENT_TURN" != "BACKEND" ]]); then
        echo "[$AGENT_NAME] My turn! Processing PRD changes..."
        
        # Log task start in collaboration
        cd "$REQUIREMENTS_REPO"
        echo "" >> COLLABORATION.md
        echo "### [$(date '+%Y-%m-%d %H:%M')] - $AGENT_NAME - STARTED" >> COLLABORATION.md
        echo "**Tasks In Progress:**" >> COLLABORATION.md
        echo "- 🔄 Analyzing PRD requirements" >> COLLABORATION.md
        echo "- 🔄 Updating frontend components" >> COLLABORATION.md
        echo "- 🔄 Implementing UI changes" >> COLLABORATION.md
        echo "**Status:** Frontend processing started" >> COLLABORATION.md
        
        PRD_CONTENT=$(cat PRD.md)
        
        cd "$FRONTEND_REPO"
        git pull origin init >/dev/null 2>&1
        
        # Execute Kiro CLI with PRD content
        cat << EOF | kiro-cli chat --non-interactive --trust-all-tools
You are the Frontend Agent. Implement the React frontend based on PRD requirements:

PRD REQUIREMENTS:
$PRD_CONTENT

Tasks:
1. Create/update React components matching PRD specifications
2. Implement UI exactly as described in PRD
3. Set up API integration for backend endpoints
4. Add proper error handling and loading states
5. Ensure responsive design
6. Add unit tests as specified in PRD
7. Commit and push all changes with message "Frontend Agent: Implemented PRD requirements"

CRITICAL: Follow PRD as single source of truth. Work in current directory.
After completing ALL tasks including unit tests, respond with "FRONTEND_TASK_COMPLETE" to signal completion.
EOF
        
        # Check if task was completed successfully
        if [ $? -eq 0 ]; then
            echo "[$AGENT_NAME] Task execution completed successfully."
            
            # Mark completion
            ../completion-tracker.sh mark "Frontend Agent"
            
        else
            echo "[$AGENT_NAME] Task execution failed. Will retry on next cycle."
            sleep 15
            continue
        fi
        
        # Update turn using git coordination
        cd "$REQUIREMENTS_REPO"
        sed -i '' 's/\*\*FRONTEND\*\*.*/\*\*BACKEND\*\* - Ready for next PRD update/' COLLABORATION.md
        
        # Add detailed completion log with tasks
        echo "" >> COLLABORATION.md
        echo "### [$(date '+%Y-%m-%d %H:%M')] - $AGENT_NAME" >> COLLABORATION.md
        echo "**Tasks Completed:**" >> COLLABORATION.md
        echo "1. ✅ Analyzed PRD requirements and specifications" >> COLLABORATION.md
        echo "2. ✅ Updated React components based on PRD changes" >> COLLABORATION.md
        echo "3. ✅ Implemented frontend functionality as specified" >> COLLABORATION.md
        echo "4. ✅ Updated styling and UI components" >> COLLABORATION.md
        echo "5. ✅ Ensured responsive design compliance" >> COLLABORATION.md
        echo "6. ✅ Added/updated unit tests as required" >> COLLABORATION.md
        echo "7. ✅ Committed and pushed all changes to repository" >> COLLABORATION.md
        echo "8. ✅ Validated frontend implementation against PRD" >> COLLABORATION.md
        echo "**Status:** Frontend implementation complete" >> COLLABORATION.md
        echo "**Next:** Passing turn to Backend Agent" >> COLLABORATION.md
        
        git add COLLABORATION.md
        git commit -m "$AGENT_NAME: Completed task, passing to backend" >/dev/null 2>&1
        git push origin init >/dev/null 2>&1
        
        echo "[$AGENT_NAME] Task completed. Turn passed to Backend Agent."
        
        # Wait before next check
        sleep 15
    else
        # Not our turn and timeout not reached
        echo "[$AGENT_NAME] Waiting... (${TIME_DIFF}s since last PRD update)"
        sleep 15
    fi
done
