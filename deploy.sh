#!/bin/bash
# Fyvio Unified Deployment Script for Render

echo "🚀 Fyvio Unified Deployment Helper"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You can still deploy to Render without Docker."
    else
        print_status "Docker is installed"
    fi
    
    print_status "Prerequisites check completed"
}

# Validate project structure
validate_structure() {
    print_info "Validating project structure..."
    
    python3 validate.py
    if [ $? -eq 0 ]; then
        print_status "Project structure is valid"
    else
        print_error "Project structure validation failed"
        exit 1
    fi
}

# Show deployment options
show_deployment_options() {
    echo ""
    print_info "Deployment Options:"
    echo "1. 🌐 Render Web Service (Recommended)"
    echo "2. 🐳 Docker Deployment"
    echo "3. 📋 Show Environment Variables Template"
    echo "4. 🧪 Test Build Locally"
    echo "5. 📖 Open Documentation"
    echo "6. 🚪 Exit"
    echo ""
}

# Render deployment instructions
render_deployment() {
    echo ""
    print_info "Render Web Service Deployment Instructions:"
    echo ""
    echo "📋 Step-by-step deployment:"
    echo "1. Go to https://render.com and sign up/login"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your Git repository or upload the code"
    echo "4. Configure the service:"
    echo "   • Name: fyvio-unified"
    echo "   • Region: Choose closest to your users"
    echo "   • Branch: main"
    echo "   • Build Command: pip install -r requirements.txt && cd frontend && npm install && npm run build"
    echo "   • Start Command: uvicorn backend.fastapi.main:app --host 0.0.0.0 --port \$PORT"
    echo ""
    echo "🔧 Environment Variables to set in Render:"
    echo "• API_ID=your_telegram_api_id"
    echo "• API_HASH=your_telegram_api_hash"
    echo "• BOT_TOKEN=your_bot_token"
    echo "• AUTH_CHANNEL=your_auth_channel_id"
    echo "• DATABASE=your_mongodb_connection_string"
    echo "• TMDB_API=your_tmdb_api_key"
    echo "• PORT=8000"
    echo ""
    echo "5. Click 'Create Web Service'"
    echo "6. Wait for deployment to complete"
    echo ""
    print_status "Render deployment instructions displayed"
}

# Docker deployment instructions
docker_deployment() {
    echo ""
    print_info "Docker Deployment Instructions:"
    echo ""
    echo "🐳 Build and run with Docker:"
    echo "1. Build the Docker image:"
    echo "   docker build -t fyvio-unified ."
    echo ""
    echo "2. Run the container:"
    echo "   docker run -p 8000:8000 \"
    echo "     -e API_ID=your_api_id \"
    echo "     -e API_HASH=your_api_hash \"
    echo "     -e BOT_TOKEN=your_bot_token \"
    echo "     -e DATABASE=your_db_string \"
    echo "     -e TMDB_API=your_tmdb_key \"
    echo "     fyvio-unified"
    echo ""
    print_status "Docker deployment instructions displayed"
}

# Show environment variables template
show_env_template() {
    echo ""
    print_info "Environment Variables Template:"
    echo ""
    echo "Copy and customize this for your deployment:"
    echo "============================================="
    cat config.env
    echo "============================================="
    echo ""
    print_info "Remember to replace the empty values with your actual credentials!"
}

# Test build locally
test_build() {
    echo ""
    print_info "Testing local build..."
    echo ""
    
    # Test Python backend import
    print_info "Testing Python backend imports..."
    cd backend
    python3 -c "from fastapi.main import app; print('✅ FastAPI app imports successfully')" 2>/dev/null || print_warning "FastAPI app import test failed"
    cd ..
    
    # Check if frontend can be built (if npm is available)
    if command -v npm &> /dev/null; then
        print_info "Testing frontend build..."
        cd frontend
        npm list --depth=0 &> /dev/null
        if [ $? -eq 0 ]; then
            print_status "Frontend dependencies are installed"
            print_info "Run 'cd frontend && npm run build' to build the frontend"
        else
            print_warning "Frontend dependencies need to be installed"
            print_info "Run 'cd frontend && npm install' first"
        fi
        cd ..
    else
        print_warning "npm not found, skipping frontend build test"
    fi
    
    print_status "Local build test completed"
}

# Open documentation
show_documentation() {
    echo ""
    print_info "Opening documentation..."
    echo ""
    if command -v less &> /dev/null; then
        less README.md
    else
        cat README.md
    fi
}

# Main script logic
main() {
    clear
    echo "🚀 Fyvio Unified Deployment Helper"
    echo "=================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    echo ""
    
    # Validate project structure
    validate_structure
    echo ""
    
    # Main menu loop
    while true; do
        show_deployment_options
        
        read -p "Choose an option (1-6): " choice
        
        case $choice in
            1)
                render_deployment
                ;;
            2)
                docker_deployment
                ;;
            3)
                show_env_template
                ;;
            4)
                test_build
                ;;
            5)
                show_documentation
                ;;
            6)
                echo ""
                print_info "Thank you for using Fyvio Unified!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-6."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
        clear
        echo "🚀 Fyvio Unified Deployment Helper"
        echo "=================================="
    done
}

# Run the main function
main