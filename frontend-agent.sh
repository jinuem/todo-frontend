#!/bin/bash

# Frontend Agent - Monitors requirements repo and develops React frontend

REQUIREMENTS_REPO="../todo-requirements"
FRONTEND_REPO="."
AGENT_NAME="Auto Frontend Agent"
SERVICE_STARTED=false

echo "[$AGENT_NAME] Starting automated monitoring..."

while true; do
    cd "$REQUIREMENTS_REPO"
    git pull origin init >/dev/null 2>&1
    
    LAST_COMMIT=$(git log -1 --format="%H")
    CHANGED_FILES=$(git diff-tree --no-commit-id --name-only -r $LAST_COMMIT 2>/dev/null || echo "")
    
    if [[ "$CHANGED_FILES" == *"PRD.md"* ]] || [[ "$CHANGED_FILES" == *"COLLABORATION.md"* ]]; then
        echo "[$AGENT_NAME] Requirements updated! Auto-processing..."
        
        PRD_CONTENT=$(cat PRD.md)
        COLLAB_CONTENT=$(cat COLLABORATION.md)
        
        cd "$FRONTEND_REPO"
        git pull origin init >/dev/null 2>&1
        
        # Auto-run Kiro CLI
        cat << 'EOF' | kiro-cli chat --non-interactive --trust-all-tools
You are the Frontend Agent. Based on these requirements, develop/update the React frontend:

REQUIREMENTS:
$PRD_CONTENT

COLLABORATION LOG:
$COLLAB_CONTENT

Tasks:
1. Create/update React components for the todo app
2. Implement the UI based on PRD requirements  
3. Set up API integration points
4. Ensure responsive design
5. Commit your changes with message \"Frontend Agent: Auto-update from requirements\"

Work efficiently and commit when done.

After completing the work, start the frontend dev server in a new terminal:
- Open new terminal for frontend service  
- Run: cd $FRONTEND_REPO && npm start
EOF

        # Start frontend service in new terminal after code update (only once)
        if [ "$SERVICE_STARTED" = false ]; then
            echo "[$AGENT_NAME] Starting frontend service in new terminal..."
            osascript -e "tell app \"Terminal\" to do script \"cd $(pwd) && echo 'Frontend Service Starting...' && npm start\""
            SERVICE_STARTED=true
        else
            echo "[$AGENT_NAME] Service already running, skipping start"
        fi
        
        # Update collaboration log
        cd "$REQUIREMENTS_REPO"
        echo "" >> COLLABORATION.md
        echo "### [$(date '+%Y-%m-%d %H:%M')] - $AGENT_NAME" >> COLLABORATION.md
        echo "- Auto-processed requirements change" >> COLLABORATION.md
        echo "- Updated frontend components" >> COLLABORATION.md
        
        git add COLLABORATION.md
        git commit -m "$AGENT_NAME: Auto-processed requirements" >/dev/null 2>&1
        git push origin init >/dev/null 2>&1
        
        echo "[$AGENT_NAME] Completed auto-update cycle"
    fi
    
    sleep 15
done
