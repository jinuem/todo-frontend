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
    
    # Check if it's frontend's turn and PRD has changes
    CURRENT_TURN=$(grep "Current Turn" COLLABORATION.md | grep "FRONTEND")
    PRD_CHANGED=$(git log -1 --name-only --format="" | grep "PRD.md")
    
    # Only process if it's our turn AND there are actual PRD changes
    if [[ -n "$CURRENT_TURN" ]] && [[ -n "$PRD_CHANGED" ]]; then
        echo "[$AGENT_NAME] My turn! Processing PRD changes..."
        
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
        else
            echo "[$AGENT_NAME] Task execution failed. Will retry on next cycle."
            sleep 15
            continue
        fi
        
        # Update collaboration log and pass turn to backend
        cd "$REQUIREMENTS_REPO"
        
        # Update current turn
        sed -i '' 's/\*\*FRONTEND\*\*.*/\*\*BACKEND\*\* - Ready to process/' COLLABORATION.md
        
        # Add completion log
        echo "" >> COLLABORATION.md
        echo "### [$(date '+%Y-%m-%d %H:%M')] - $AGENT_NAME" >> COLLABORATION.md
        echo "- Processed PRD requirements" >> COLLABORATION.md
        echo "- Implemented frontend components" >> COLLABORATION.md
        echo "- Committed and pushed changes" >> COLLABORATION.md
        echo "- Passing turn to Backend Agent" >> COLLABORATION.md
        
        git add COLLABORATION.md
        git commit -m "$AGENT_NAME: Completed task, passing to backend" >/dev/null 2>&1
        git push origin init >/dev/null 2>&1
        
        echo "[$AGENT_NAME] Task completed. Turn passed to Backend Agent."
        
        # Wait before next check
        sleep 15
    else
        # Not our turn or no new changes, wait shorter
        sleep 15
    fi
done
