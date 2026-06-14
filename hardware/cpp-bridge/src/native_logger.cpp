// C++ native logger implementation for Smile POS
#include "native_logger.h"
#include <iostream>
#include <fstream>
#include <chrono>
#include <iomanip>
#include <sstream>

NativeLogger::NativeLogger(const std::string& path) : logFilePath(path) {}

std::string NativeLogger::getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

void NativeLogger::logInfo(const std::string& message) {
    std::string line = "[" + getCurrentTimestamp() + "] [INFO] " + message;
    std::cout << line << std::endl;
    
    std::ofstream outfile(logFilePath, std::ios_base::app);
    if (outfile.is_open()) {
        outfile << line << "\n";
    }
}

void NativeLogger::logWarning(const std::string& message) {
    std::string line = "[" + getCurrentTimestamp() + "] [WARN] " + message;
    std::cerr << line << std::endl;
    
    std::ofstream outfile(logFilePath, std::ios_base::app);
    if (outfile.is_open()) {
        outfile << line << "\n";
    }
}

void NativeLogger::logError(const std::string& message) {
    std::string line = "[" + getCurrentTimestamp() + "] [ERROR] " + message;
    std::cerr << line << std::endl;
    
    std::ofstream outfile(logFilePath, std::ios_base::app);
    if (outfile.is_open()) {
        outfile << line << "\n";
    }
}
