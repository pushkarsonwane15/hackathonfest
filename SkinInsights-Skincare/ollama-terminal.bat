@echo off
title Ollama Skincare AI Terminal - Kura Labs
color 0A
echo ==============================================================================
echo        SKININSIGHTS LAB - OLLAMA LOCAL AI TERMINAL
echo ==============================================================================
echo.
echo Model:     qwen2.5:0.5b (Ultra-fast Local LLM)
echo Storage:   D:\ollama\models (70 GB space available)
echo Endpoint:  http://127.0.0.1:11434
echo.
echo Connecting to local Ollama session...
echo Type your question below (e.g. "What routine should I use for acne?")
echo Type "/bye" to exit at any time.
echo ------------------------------------------------------------------------------
echo.

set CUDA_VISIBLE_DEVICES=
set OLLAMA_MODELS=D:\ollama\models

ollama run qwen2.5:0.5b
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Starting Ollama background daemon...
    start /B ollama serve
    timeout /t 3 >nul
    ollama run qwen2.5:0.5b
)
pause
