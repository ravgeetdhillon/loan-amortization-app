<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Car Loan Amortization Calculator

This is a web-based car loan amortization calculator that handles floating interest rates while maintaining constant EMI payments.

## Key Features

- **Loan Start Date**: Specify custom start date for accurate calendar-based payment schedules
- **Floating Interest Rate Support**: The calculator allows for interest rate changes at any point during the loan period
- **Constant EMI**: Monthly payments remain the same throughout the loan term
- **Interactive Rate Updates**: Users can modify interest rates for specific payment periods
- **Visual Indicators**: Rate changes are highlighted in the amortization table
- **Export Functionality**: Schedule can be exported to CSV format
- **Search and Pagination**: Easy navigation through large payment schedules
- **Indian Currency Formatting**: Proper INR formatting with commas and 2 decimal places

## Technical Implementation

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Responsive design for mobile and desktop
- Real-time calculation updates when rates change
- Proper financial calculations considering compound interest

## Financial Calculation Logic

- Monthly interest rate = Annual rate / 12
- Interest payment = Remaining balance × Monthly rate
- Principal payment = EMI - Interest payment
- New balance = Previous balance - Principal payment

## Code Structure

- `index.html`: Main interface with forms and table
- `styles.css`: Modern, responsive styling
- `script.js`: Core calculation logic and UI interactions
- Uses ES6+ features like classes and arrow functions
