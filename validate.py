#!/usr/bin/env python3
"""
Test script to validate the unified Fyvio project structure
"""
import os
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and print status"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} - NOT FOUND")
        return False

def check_directory_exists(dir_path, description):
    """Check if a directory exists and print status"""
    if os.path.isdir(dir_path):
        print(f"✅ {description}: {dir_path}")
        return True
    else:
        print(f"❌ {description}: {dir_path} - NOT FOUND")
        return False

def main():
    """Main validation function"""
    print("🔍 Validating Fyvio Unified Project Structure")
    print("=" * 50)
    
    # Check root directory
    root_dir = Path(__file__).parent
    print(f"📁 Project root: {root_dir}")
    
    # Check main configuration files
    config_files = [
        ("package.json", "Root package.json"),
        ("requirements.txt", "Python requirements"),
        ("Dockerfile", "Docker configuration"),
        ("render.yaml", "Render deployment config"),
        ("config.env", "Environment configuration"),
        (".gitignore", "Git ignore file"),
        ("README.md", "Documentation"),
    ]
    
    print("\n📋 Configuration Files:")
    all_config_ok = True
    for file_name, description in config_files:
        if not check_file_exists(root_dir / file_name, description):
            all_config_ok = False
    
    # Check frontend structure
    print("\n🎨 Frontend Structure:")
    frontend_dir = root_dir / "frontend"
    frontend_ok = check_directory_exists(frontend_dir, "Frontend directory")
    
    if frontend_ok:
        frontend_files = [
            ("package.json", "Frontend package.json"),
            ("vite.config.js", "Vite configuration"),
            ("index.html", "Main HTML file"),
            ("src/main.jsx", "React entry point"),
            ("src/App.jsx", "Main App component"),
        ]
        
        for file_name, description in frontend_files:
            if not check_file_exists(frontend_dir / file_name, description):
                frontend_ok = False
    
    # Check backend structure
    print("\n⚙️ Backend Structure:")
    backend_dir = root_dir / "backend"
    backend_ok = check_directory_exists(backend_dir, "Backend directory")
    
    if backend_ok:
        backend_files = [
            ("config.py", "Backend configuration"),
            ("fastapi/main.py", "Main FastAPI application"),
            ("helper/database.py", "Database helper"),
            ("pyrofork/__init__.py", "Pyrofork module"),
        ]
        
        for file_name, description in backend_files:
            if not check_file_exists(backend_dir / file_name, description):
                backend_ok = False
    
    # Check static directory
    print("\n📦 Static Files Directory:")
    static_dir = root_dir / "static"
    check_directory_exists(static_dir, "Static files directory (for built frontend)")
    
    # Check templates directory
    print("\n📄 Templates Directory:")
    templates_dir = backend_dir / "fastapi" / "templates"
    check_directory_exists(templates_dir, "Jinja2 templates directory")
    
    # Overall status
    print("\n" + "=" * 50)
    print("📊 Overall Status:")
    
    if all_config_ok and frontend_ok and backend_ok:
        print("✅ All critical files and directories are present!")
        print("🚀 Project is ready for deployment to Render")
        return 0
    else:
        print("❌ Some files or directories are missing")
        print("⚠️ Please check the issues above before deploying")
        return 1

if __name__ == "__main__":
    sys.exit(main())