// C++ ESC/POS printing converter for Smile POS
#include <iostream>
#include <string>
#include <vector>

class EscPosPrinter {
private:
    std::string printerName;
    int paperWidth; // 58 or 80

public:
    EscPosPrinter(std::string name, int width) : printerName(name), paperWidth(width) {}

    std::vector<unsigned char> generateReceipt(const std::string& cashier, const std::string& total, const std::vector<std::string>& items) {
        std::vector<unsigned char> commandStream;
        
        // ESC @ (Initialize printer)
        commandStream.push_back(0x1B);
        commandStream.push_back(0x40);

        // ESC a 1 (Align center)
        commandStream.push_back(0x1B);
        commandStream.push_back(0x61);
        commandStream.push_back(0x01);

        // Header Text
        std::string header = "SMILE POS STORE\n";
        commandStream.insert(commandStream.end(), header.begin(), header.end());

        // ESC a 0 (Align left)
        commandStream.push_back(0x1B);
        commandStream.push_back(0x61);
        commandStream.push_back(0x00);

        std::string line = "--------------------------------\n";
        commandStream.insert(commandStream.end(), line.begin(), line.end());

        // Items Loop
        for (const auto& item : items) {
            std::string itemText = item + "\n";
            commandStream.insert(commandStream.end(), itemText.begin(), itemText.end());
        }

        commandStream.insert(commandStream.end(), line.begin(), line.end());

        // ESC a 2 (Align right)
        commandStream.push_back(0x1B);
        commandStream.push_back(0x61);
        commandStream.push_back(0x02);

        std::string totalText = "TOTAL: Rp " + total + "\n";
        commandStream.insert(commandStream.end(), totalText.begin(), totalText.end());

        // ESC a 1 (Align center)
        commandStream.push_back(0x1B);
        commandStream.push_back(0x61);
        commandStream.push_back(0x01);

        std::string footer = "Terima kasih atas kunjungan Anda!\n\n\n";
        commandStream.insert(commandStream.end(), footer.begin(), footer.end());

        // GS V 66 0 (Cut paper)
        commandStream.push_back(0x1D);
        commandStream.push_back(0x56);
        commandStream.push_back(0x42);
        commandStream.push_back(0x00);

        return commandStream;
    }
};