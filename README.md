# Car Loan Amortization Calculator

A modern, responsive web application for calculating car loan amortization schedules with support for floating interest rates and automatic EMI calculation.

## Features

### Core Functionality

- **Automatic EMI Calculation**: Calculate EMI from principal, tenure, and interest rate
- **Loan Start Date**: Specify when the loan begins for accurate calendar dates
- **Payment Progress Tracking**: Track payment status and view progress statistics
- **Floating Interest Rate Support**: Change interest rates at any point during the loan period
- **Real-time Calculations**: Automatic recalculation when rates are updated
- **Visual Rate Change Indicators**: Highlighted rows show when rates change
- **Indian Currency Support**: All amounts displayed in INR (₹)
- **Indian Currency Support**: All amounts displayed in INR (₹)

### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Search Functionality**: Find specific payments quickly
- **Pagination**: Handle large payment schedules efficiently
- **Export to CSV**: Download complete amortization schedule

### Financial Accuracy

- **Standard EMI Formula**: Uses the industry-standard EMI calculation formula
- **Proper Compound Interest**: Accurate monthly interest calculations
- **Final Payment Adjustment**: Handles remaining balance in final payment
- **Multiple Rate Changes**: Support for unlimited interest rate modifications
- **Payment Progress Tracking**: Track payments made till any date
- **Loan Summary**: Total interest, total payments, and loan duration

## How to Use

### 1. Enter Loan Details

- **Principal Amount**: The loan amount in INR (₹) - Default: ₹12,00,000
- **Tenure**: Loan period in months - Default: 84 months (7 years)
- **Initial Interest Rate**: Starting annual interest rate (%) - Default: 8.8%
- **Loan Start Date**: The date when the loan begins - Default: 22 August 2024
- **Paid Till Date**: Optional - Select date till which EMIs are paid for progress tracking

### 2. Calculate EMI & Schedule

Click "Calculate EMI & Amortization" to:

- Calculate the monthly EMI automatically using standard formula
- Generate the complete payment schedule with default values pre-filled

### 3. Update Interest Rates (Optional)

- **Constant EMI**: EMI remains the same throughout the loan period
- Select the payment number from which the new rate applies
- Enter the new annual interest rate
- Click "Update Rate" to recalculate the schedule
- Only the interest/principal split changes, EMI stays constant

### 4. Track Payment Progress (Optional)

- Select "Paid Till Date" to see progress statistics
- View Interest Paid vs Interest Remaining
- View Principal Paid vs Principal Remaining
- See EMIs Paid vs EMIs Remaining
- Paid rows in the table are visually highlighted

### 5. Review and Export

- Browse the amortization table with pagination
- Search for specific payments
- Export the complete schedule to CSV
- All amounts displayed in INR with proper comma formatting and 2 decimal places

## EMI Calculation Formula

The application uses the standard EMI calculation formula:

**EMI = [P × R × (1+R)^N] / [(1+R)^N-1]**

Where:

- P = Principal loan amount
- R = Monthly interest rate (Annual rate ÷ 12)
- N = Number of months (tenure)

## Development Setup

### Live Development Server

For instant code reflection during development:

1. **Install Live Server** (one-time setup):

   ```bash
   npm install -g live-server
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

   Or use VS Code tasks:

   - Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Tasks: Run Task"
   - Select "Start Development Server"

3. **Access the Application**:
   - Opens automatically at `http://localhost:3000`
   - Any code changes will automatically refresh the browser

### File Structure

```
├── index.html          # Main application interface
├── styles.css          # Responsive CSS styling
├── script.js           # Core calculation logic
├── package.json        # Development dependencies
├── docs.md            # Requirements documentation
└── README.md          # This file
```

## Technical Details

### Calculation Logic

- **EMI Calculation**: Standard banking formula for equal monthly installments
- **Interest Calculation**: Monthly compounding based on reducing balance
- **Rate Changes**: Recalculates EMI for remaining tenure when rate changes
- **Final Payment**: Automatically adjusts to clear remaining balance

### Key Features Implementation

- **EMI Calculation**: Computed from principal, rate, and tenure inputs
- **Constant EMI**: EMI remains the same throughout the loan term even when rates change
- **Currency Formatting**: Indian number formatting with proper comma placement and 2 decimal places
- **Real-time Updates**: Instant recalculation and display updates
- **Default Values**: Pre-filled with realistic loan values for immediate use

## Example Usage

### Default Car Loan Example:

- **Principal Amount**: ₹12,00,000 (Default)
- **Tenure**: 84 months (7 years) (Default)
- **Initial Rate**: 8.8% (Default)
- **Start Date**: 22 August 2024 (Default)
- **Calculated EMI**: ₹18,603 (approximately)
- **First Payment**: 22 September 2024

### Rate Change Scenario:

- Change rate to 9.2% from payment #13
- Change rate to 8.4% from payment #37
- EMI remains constant at ₹18,603
- Only interest/principal split changes
- View updated schedule with recalculated EMIs

## Browser Compatibility

- Modern browsers supporting ES6+ features
- Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- Mobile browsers on iOS and Android

## Contributing

This is a standalone web application. To contribute:

1. Fork the repository
2. Set up the development server
3. Make your changes with live reloading
4. Test thoroughly with different scenarios
5. Submit a pull request

## License

This project is open source and available under the MIT License.
