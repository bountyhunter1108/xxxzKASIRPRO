// C++ barcode parsing utilities header for Smile POS
#ifndef BARCODE_PARSER_H
#define BARCODE_PARSER_H

#include <string>

class BarcodeParser {
public:
    // Trims prefix / suffix control codes from physical barcode scanner inputs
    static std::string cleanRawInput(const std::string& rawInput);

    // Validates if barcode matches typical EAN-13, UPC-A, or custom store formats
    static bool isValidBarcode(const std::string& barcode);

    // Extract product code or SKU part from composite barcode formats
    static std::string extractSku(const std::string& compositeInput);
};

#endif // BARCODE_PARSER_H
