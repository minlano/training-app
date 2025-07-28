#!/usr/bin/env python3
"""
서버 시작 스크립트
백엔드와 프론트엔드를 동시에 시작합니다.
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def print_banner():
    """시작 배너 출력"""
    print("=" * 60)
    print("🚀 트레이닝 앱 서버 시작")
    print("=" * 60)
    print("백엔드: http://localhost:8000")
    print("프론트엔드: http://localhost:5173")
    print("=" * 60)

def start_backend():
    """백엔드 서버 시작"""
    print("🔧 백엔드 서버 시작 중...")
    
    # backend 디렉토리로 이동
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ backend 디렉토리를 찾을 수 없습니다.")
        return None
    
    # 현재 디렉토리 저장
    original_dir = os.getcwd()
    
    try:
        # 절대 경로로 가상환경 Python 실행 파일 찾기
        venv_python = os.path.abspath(backend_dir / "venv" / "Scripts" / "python.exe")
        
        if not os.path.exists(venv_python):
            print(f"❌ 가상환경을 찾을 수 없습니다: {venv_python}")
            os.chdir(original_dir)
            return None
        
        print(f"✅ 가상환경 찾음: {venv_python}")
        
        # 백엔드 서버 시작
        process = subprocess.Popen(
            [venv_python, "main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True,
            cwd=str(backend_dir)  # 작업 디렉토리 설정
        )
        
        # 프로세스가 정상적으로 시작되었는지 확인
        time.sleep(2)  # 2초 대기
        if process.poll() is not None:
            print("❌ 백엔드 서버가 시작되자마자 종료되었습니다.")
            return None
        
        print("✅ 백엔드 서버가 시작되었습니다.")
        return process
        
    except Exception as e:
        print(f"❌ 백엔드 서버 시작 실패: {e}")
        os.chdir(original_dir)
        return None

def start_frontend():
    """프론트엔드 서버 시작"""
    print("🎨 프론트엔드 서버 시작 중...")
    
    try:
        # npm이 설치되어 있는지 확인
        npm_check = subprocess.run(["npm", "--version"], capture_output=True, text=True, shell=True)
        if npm_check.returncode != 0:
            print("❌ npm이 설치되지 않았습니다.")
            return None
        
        # package.json이 있는지 확인
        if not Path("package.json").exists():
            print("❌ package.json 파일을 찾을 수 없습니다.")
            return None
        
        # npm run dev 실행
        process = subprocess.Popen(
            ["npm", "run", "dev"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True,
            shell=True
        )
        
        print("✅ 프론트엔드 서버가 시작되었습니다.")
        return process
        
    except FileNotFoundError:
        print("❌ npm 명령어를 찾을 수 없습니다. Node.js가 설치되어 있는지 확인하세요.")
        return None
    except Exception as e:
        print(f"❌ 프론트엔드 서버 시작 실패: {e}")
        return None

def monitor_process(process, name):
    """프로세스 모니터링"""
    try:
        for line in process.stdout:
            print(f"[{name}] {line.strip()}")
    except:
        pass

def main():
    """메인 함수"""
    print_banner()
    
    # 현재 디렉토리 저장
    original_dir = os.getcwd()
    
    # 백엔드 시작
    backend_process = start_backend()
    if not backend_process:
        print("❌ 백엔드 시작 실패. 종료합니다.")
        return
    
    # 원래 디렉토리로 복귀
    os.chdir(original_dir)
    
    # 프론트엔드 시작
    frontend_process = start_frontend()
    if not frontend_process:
        print("❌ 프론트엔드 시작 실패. 백엔드를 종료합니다.")
        backend_process.terminate()
        return
    
    # 모니터링 스레드 시작
    backend_thread = threading.Thread(
        target=monitor_process, 
        args=(backend_process, "BACKEND")
    )
    frontend_thread = threading.Thread(
        target=monitor_process, 
        args=(frontend_process, "FRONTEND")
    )
    
    backend_thread.daemon = True
    frontend_thread.daemon = True
    
    backend_thread.start()
    frontend_thread.start()
    
    print("\n🎉 모든 서버가 시작되었습니다!")
    print("브라우저에서 http://localhost:5173 으로 접속하세요.")
    print("종료하려면 Ctrl+C를 누르세요.")
    
    try:
        # 서버들이 실행되는 동안 대기
        while True:
            time.sleep(1)
            
            # 프로세스가 종료되었는지 확인
            if backend_process.poll() is not None:
                print("❌ 백엔드 서버가 종료되었습니다.")
                break
                
            if frontend_process.poll() is not None:
                print("❌ 프론트엔드 서버가 종료되었습니다.")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 서버를 종료합니다...")
        print("수동으로 종료하려면:")
        print("1. 새 터미널을 열고")
        print("2. taskkill /f /im node.exe")
        print("3. taskkill /f /im python.exe")

if __name__ == "__main__":
    main() 