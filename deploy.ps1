# Deploy script for EMPTY GAZ website

# Configure git
git config user.email "denly1@example.com"
git config user.name "denly1"

# Add remote
git remote add origin https://github.com/denly1/Sait.git

# Commit and push
git add .
git commit -m "Initial commit - EMPTY GAZ website"
git branch -M main
git push -u origin main --force

Write-Host "Deployment complete!" -ForegroundColor Green
