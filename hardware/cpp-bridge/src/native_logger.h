// C++ native logger for hardware operations
#ifndef NATIVE_LOGGER_H
#define NATIVE_LOGGER_H

#include <string>

class NativeLogger {
private:
    std::string logFilePath;
    static std::string getCurrentTimestamp();

public:
    NativeLogger(const std::string& path);
    void logInfo(const std::string& message);
    void logWarning(const std::string& message);
    void logError(const std::string& message);
};

#endif // NATIVE_LOGGER_H
