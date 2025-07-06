#!/bin/bash

# 🚀 GitHub Setup Script untuk SentraBASE
# Jalankan script ini setelah membuat repository di GitHub

echo "🏥 SentraBASE - GitHub Setup Script"
echo "=================================="

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
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

# Cek apakah kita di direktori yang benar
if [ ! -f "package.json" ] || [ ! -f "vite.config.js" ]; then
    print_error "Script harus dijalankan dari root directory SentraBASE"
    exit 1
fi

print_info "Memulai setup GitHub untuk SentraBASE..."

# Input GitHub username dan repository name
echo ""
read -p "Masukkan GitHub username Anda: " GITHUB_USERNAME
read -p "Masukkan nama repository (default: sentrabase): " REPO_NAME

# Set default repository name
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="sentrabase"
fi

# Pilih protokol (HTTPS atau SSH)
echo ""
echo "Pilih protokol untuk GitHub:"
echo "1) HTTPS (mudah, tidak perlu SSH key)"
echo "2) SSH (recommended, perlu SSH key)"
read -p "Pilihan (1/2): " PROTOCOL_CHOICE

if [ "$PROTOCOL_CHOICE" = "2" ]; then
    REMOTE_URL="git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
    print_info "Menggunakan SSH: $REMOTE_URL"
else
    REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    print_info "Menggunakan HTTPS: $REMOTE_URL"
fi

# Cek apakah remote origin sudah ada
if git remote get-url origin > /dev/null 2>&1; then
    print_warning "Remote origin sudah ada. Menghapus yang lama..."
    git remote remove origin
fi

# Tambahkan remote origin
print_info "Menambahkan remote origin..."
if git remote add origin "$REMOTE_URL"; then
    print_status "Remote origin berhasil ditambahkan"
else
    print_error "Gagal menambahkan remote origin"
    exit 1
fi

# Rename branch ke main
print_info "Mengubah nama branch ke 'main'..."
if git branch -M main; then
    print_status "Branch berhasil diubah ke 'main'"
else
    print_warning "Gagal mengubah nama branch (mungkin sudah 'main')"
fi

# Test koneksi ke GitHub
print_info "Testing koneksi ke GitHub..."
if [ "$PROTOCOL_CHOICE" = "2" ]; then
    # Test SSH connection
    if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
        print_status "SSH connection berhasil"
    else
        print_warning "SSH connection gagal. Pastikan SSH key sudah di-setup"
        echo "Jalankan: ssh-keygen -t ed25519 -C 'your-email@example.com'"
        echo "Lalu tambahkan public key ke GitHub Settings > SSH Keys"
    fi
fi

# Push ke GitHub
echo ""
read -p "Push ke GitHub sekarang? (y/n): " PUSH_NOW

if [ "$PUSH_NOW" = "y" ] || [ "$PUSH_NOW" = "Y" ]; then
    print_info "Pushing ke GitHub..."
    
    if git push -u origin main; then
        print_status "Successfully pushed to GitHub!"
        echo ""
        echo "🎉 Repository SentraBASE berhasil di-push ke GitHub!"
        echo "🔗 URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo ""
        echo "Next steps:"
        echo "1. Buka repository di GitHub"
        echo "2. Setup branch protection rules"
        echo "3. Add repository topics: healthcare, react, vite, tailwindcss"
        echo "4. Enable GitHub Pages jika ingin deploy"
    else
        print_error "Push gagal. Periksa:"
        echo "1. Repository sudah dibuat di GitHub?"
        echo "2. Username dan repository name benar?"
        echo "3. SSH key sudah di-setup (jika menggunakan SSH)?"
        echo "4. Internet connection stabil?"
    fi
else
    print_info "Push dibatalkan. Jalankan manual dengan:"
    echo "git push -u origin main"
fi

# Show current status
echo ""
print_info "Git Status:"
git remote -v
echo ""
git status

echo ""
print_status "Setup selesai! 🚀"
echo "Dokumentasi lengkap ada di: GITHUB_SETUP_GUIDE.md"
