#!/bin/bash

# 🔄 Development Workflow Script untuk SentraBASE
# Helper script untuk common Git operations

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}"
    echo "🏥 SentraBASE - Development Workflow"
    echo "=================================="
    echo -e "${NC}"
}

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

# Function untuk quick commit dan push
quick_commit() {
    echo ""
    print_info "Quick Commit & Push"
    echo "==================="
    
    # Show current status
    echo "Current status:"
    git status --short
    
    echo ""
    read -p "Commit message: " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        print_error "Commit message tidak boleh kosong"
        return 1
    fi
    
    # Add all changes
    git add .
    
    # Commit
    if git commit -m "$COMMIT_MSG"; then
        print_status "Commit berhasil"
        
        # Push
        read -p "Push ke GitHub? (y/n): " PUSH_CONFIRM
        if [ "$PUSH_CONFIRM" = "y" ] || [ "$PUSH_CONFIRM" = "Y" ]; then
            if git push; then
                print_status "Push berhasil!"
            else
                print_error "Push gagal"
            fi
        fi
    else
        print_error "Commit gagal"
    fi
}

# Function untuk create feature branch
create_feature() {
    echo ""
    print_info "Create Feature Branch"
    echo "===================="
    
    read -p "Nama feature (tanpa 'feature/'): " FEATURE_NAME
    
    if [ -z "$FEATURE_NAME" ]; then
        print_error "Nama feature tidak boleh kosong"
        return 1
    fi
    
    BRANCH_NAME="feature/$FEATURE_NAME"
    
    # Pull latest main
    print_info "Pulling latest main..."
    git checkout main
    git pull origin main
    
    # Create and checkout feature branch
    if git checkout -b "$BRANCH_NAME"; then
        print_status "Feature branch '$BRANCH_NAME' berhasil dibuat"
        print_info "Sekarang Anda berada di branch: $BRANCH_NAME"
    else
        print_error "Gagal membuat feature branch"
    fi
}

# Function untuk sync dengan main
sync_main() {
    echo ""
    print_info "Sync dengan Main Branch"
    echo "======================="
    
    CURRENT_BRANCH=$(git branch --show-current)
    print_info "Current branch: $CURRENT_BRANCH"
    
    # Stash changes if any
    if ! git diff-index --quiet HEAD --; then
        print_warning "Ada perubahan yang belum di-commit. Stashing..."
        git stash push -m "Auto stash before sync"
        STASHED=true
    fi
    
    # Switch to main and pull
    git checkout main
    if git pull origin main; then
        print_status "Main branch berhasil di-sync"
        
        # Switch back to original branch
        if [ "$CURRENT_BRANCH" != "main" ]; then
            git checkout "$CURRENT_BRANCH"
            print_info "Kembali ke branch: $CURRENT_BRANCH"
            
            # Pop stash if we stashed
            if [ "$STASHED" = true ]; then
                print_info "Restoring stashed changes..."
                git stash pop
            fi
        fi
    else
        print_error "Gagal sync main branch"
    fi
}

# Function untuk show project status
show_status() {
    echo ""
    print_info "Project Status"
    echo "=============="
    
    echo "📁 Current directory: $(pwd)"
    echo "🌿 Current branch: $(git branch --show-current)"
    echo "📊 Git status:"
    git status --short
    
    echo ""
    echo "🔗 Remote repositories:"
    git remote -v
    
    echo ""
    echo "📝 Recent commits:"
    git log --oneline -5
    
    echo ""
    echo "🏷️  Available branches:"
    git branch -a
}

# Function untuk cleanup branches
cleanup_branches() {
    echo ""
    print_info "Cleanup Merged Branches"
    echo "======================="
    
    # Show merged branches
    echo "Merged branches yang bisa dihapus:"
    git branch --merged main | grep -v "main" | grep -v "master"
    
    echo ""
    read -p "Hapus merged branches? (y/n): " CLEANUP_CONFIRM
    
    if [ "$CLEANUP_CONFIRM" = "y" ] || [ "$CLEANUP_CONFIRM" = "Y" ]; then
        git branch --merged main | grep -v "main" | grep -v "master" | xargs -n 1 git branch -d
        print_status "Cleanup selesai"
    fi
}

# Main menu
show_menu() {
    print_header
    
    echo "Pilih action:"
    echo "1) 🚀 Quick commit & push"
    echo "2) 🌿 Create feature branch"
    echo "3) 🔄 Sync dengan main branch"
    echo "4) 📊 Show project status"
    echo "5) 🧹 Cleanup merged branches"
    echo "6) 🏃 Start development server"
    echo "7) 🏗️  Build production"
    echo "8) ❌ Exit"
    echo ""
}

# Main script
while true; do
    show_menu
    read -p "Pilihan (1-8): " CHOICE
    
    case $CHOICE in
        1)
            quick_commit
            ;;
        2)
            create_feature
            ;;
        3)
            sync_main
            ;;
        4)
            show_status
            ;;
        5)
            cleanup_branches
            ;;
        6)
            print_info "Starting development server..."
            npm run dev
            ;;
        7)
            print_info "Building for production..."
            npm run build
            ;;
        8)
            print_status "Goodbye! 👋"
            exit 0
            ;;
        *)
            print_error "Pilihan tidak valid"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
