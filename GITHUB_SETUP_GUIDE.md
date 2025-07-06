# 🚀 Panduan Setup GitHub untuk SentraBASE

## 📋 Langkah-langkah Menghubungkan ke GitHub

### 1. **Buat Repository di GitHub**

1. Buka [GitHub.com](https://github.com) dan login ke akun Anda
2. Klik tombol **"New"** atau **"+"** di pojok kanan atas
3. Pilih **"New repository"**
4. Isi detail repository:
   - **Repository name**: `sentrabase` atau `SentraBASE`
   - **Description**: `🏥 Platform Terpusat untuk Keamanan & Efisiensi Klinik - Healthcare Management System`
   - **Visibility**: Pilih **Public** atau **Private** sesuai kebutuhan
   - **JANGAN** centang "Initialize this repository with README" (karena kita sudah punya)
5. Klik **"Create repository"**

### 2. **Hubungkan Local Repository ke GitHub**

Setelah repository GitHub dibuat, jalankan command berikut di terminal:

```bash
# Masuk ke direktori project
cd /home/febrian/project/SentraBASE

# Tambahkan remote origin (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/sentrabase.git

# Atau jika menggunakan SSH (recommended)
git remote add origin git@github.com:USERNAME/sentrabase.git

# Rename branch ke main (opsional, tapi recommended)
git branch -M main

# Push ke GitHub
git push -u origin main
```

### 3. **Verifikasi Koneksi**

```bash
# Cek remote yang terhubung
git remote -v

# Cek status
git status

# Cek log commit
git log --oneline
```

## 🔐 Setup SSH Key (Recommended)

Untuk keamanan yang lebih baik, gunakan SSH key:

### 1. **Generate SSH Key**
```bash
# Generate SSH key baru
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519
```

### 2. **Add SSH Key to GitHub**
```bash
# Copy SSH public key
cat ~/.ssh/id_ed25519.pub
```

1. Copy output dari command di atas
2. Buka GitHub → Settings → SSH and GPG keys
3. Klik **"New SSH key"**
4. Paste key dan beri title (misal: "SentraBASE Development")
5. Klik **"Add SSH key"**

### 3. **Test SSH Connection**
```bash
ssh -T git@github.com
```

## 📝 Git Workflow untuk Development

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Create new feature branch
git checkout -b feature/new-feature-name

# Make changes, then add and commit
git add .
git commit -m "✨ Add new feature: description"

# Push feature branch
git push origin feature/new-feature-name

# Create Pull Request di GitHub
# Merge setelah review
# Delete branch setelah merge
git branch -d feature/new-feature-name
```

### Commit Message Convention
```bash
# Format: <type>(<scope>): <description>
git commit -m "✨ feat(demo): add multi-step form validation"
git commit -m "🐛 fix(ui): resolve button color contrast issue"
git commit -m "📝 docs: update README with deployment guide"
git commit -m "🎨 style(components): improve responsive design"
git commit -m "♻️ refactor(modal): optimize component structure"
```

### Emoji Guide
- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 📝 `:memo:` - Documentation
- 🎨 `:art:` - UI/UX improvements
- ♻️ `:recycle:` - Code refactoring
- 🚀 `:rocket:` - Performance improvements
- 🔧 `:wrench:` - Configuration changes
- 🧪 `:test_tube:` - Tests

## 🌟 GitHub Repository Setup

### 1. **Repository Settings**

#### Branch Protection
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

#### Pages (untuk deployment)
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `gh-pages`
4. Folder: `/ (root)` atau `/dist`

### 2. **Add Repository Topics**
Di halaman utama repository, klik ⚙️ dan tambahkan topics:
- `healthcare`
- `react`
- `vite`
- `tailwindcss`
- `clinic-management`
- `medical-records`
- `indonesia`

### 3. **Create Issues Templates**
Buat folder `.github/ISSUE_TEMPLATE/` dengan templates:
- Bug report
- Feature request
- Documentation improvement

### 4. **Add GitHub Actions** (Optional)
Buat `.github/workflows/deploy.yml` untuk auto-deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔄 Sync dengan GitHub

### Push Changes
```bash
# Add semua perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "🎨 improve: enhance demo modal accessibility and navigation"

# Push ke GitHub
git push origin main
```

### Pull Latest Changes
```bash
# Pull dari GitHub
git pull origin main

# Atau dengan rebase (recommended)
git pull --rebase origin main
```

## 📊 GitHub Features untuk Project

### 1. **Projects** (Project Management)
- Create project board
- Add issues dan pull requests
- Track progress dengan kanban board

### 2. **Wiki** (Documentation)
- API documentation
- Setup guides
- Architecture decisions

### 3. **Releases** (Version Management)
- Tag versions: `v1.0.0`, `v1.1.0`
- Release notes
- Binary attachments

### 4. **Insights** (Analytics)
- Code frequency
- Contributors
- Traffic analytics

## 🚨 Troubleshooting

### Common Issues

#### 1. **Permission Denied**
```bash
# Solution: Check SSH key atau gunakan HTTPS
git remote set-url origin https://github.com/USERNAME/sentrabase.git
```

#### 2. **Merge Conflicts**
```bash
# Pull latest changes
git pull origin main

# Resolve conflicts manually
# Then commit
git add .
git commit -m "🔀 resolve merge conflicts"
```

#### 3. **Large Files**
```bash
# Remove large files dari Git history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch large-file.png' --prune-empty --tag-name-filter cat -- --all
```

## ✅ Checklist Setup

- [ ] Repository dibuat di GitHub
- [ ] Remote origin ditambahkan
- [ ] SSH key setup (recommended)
- [ ] First push berhasil
- [ ] Branch protection rules
- [ ] Repository topics ditambahkan
- [ ] README.md terlihat bagus di GitHub
- [ ] Issues templates (optional)
- [ ] GitHub Actions (optional)

---

**Setelah setup selesai, repository SentraBASE Anda akan tersedia di:**
`https://github.com/USERNAME/sentrabase`

**Happy coding! 🚀**
